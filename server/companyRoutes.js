import express from 'express';
import { authenticateToken, requireCompany } from './middleware/auth.js';
import { pool } from './config/database.js';
import companyProfileRoutes from './routes/companyProfile.js';
import companyInternshipsRoutes from './routes/companyInternships.js';
import companyApplicationsRoutes from './routes/companyApplications.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Mount sub-routes with company prefix
router.use('/company/profile', companyProfileRoutes);
// Commenting out internships sub-route to handle directly
// router.use('/company/internships', companyInternshipsRoutes);
// Commenting out applications sub-route to handle directly
// router.use('/company/applications', companyApplicationsRoutes);

// Configure multer for logo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/logos/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, PNG, and GIF files are allowed'));
    }
  }
});

// Upload or remove company logo
router.post('/company/logo', authenticateToken, requireCompany, upload.single('logo'), async (req, res) => {
  try {
    const { id } = req.user;
    if (!req.file) {
      // Remove logo if no file uploaded
      await pool.query('UPDATE companies SET logo_url = NULL WHERE company_id = $1', [id]);
      return res.json({ success: true, message: 'Logo removed', logo_url: null });
    }
    const logo_url = `/uploads/logos/${req.file.filename}`;
    const result = await pool.query(
      'UPDATE companies SET logo_url = $1 WHERE company_id = $2',
      [logo_url, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    res.json({ success: true, message: 'Logo uploaded successfully', logo_url });
  } catch (error) {
    console.error('Logo upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload logo' });
  }
});

// Get applications for company's internships
router.get('/company/applications', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { id: companyId } = req.user;
    console.log('Fetching applications for company ID:', companyId);

    const result = await pool.query(`
      SELECT 
        a.application_id,
        a.internship_id,
        a.student_profile_id,
        a.status,
        a.applied_date,
        i.title as internship_title,
        s.name as student_name,
        s.university,
        s.major,
        s.bio,
        s.resume_url,
        s.portfolio_url,
        s.phone_number,
        s.skills,
        s.profile_picture_url,
        s.education,
        s.address,
        s.languages,
        s.certifications,
        s.work_experience,
        s.event_experience,
        s.organization_experience,
        l.email as student_email
      FROM applications a
      JOIN internships i ON a.internship_id = i.internship_id
      JOIN students s ON a.student_profile_id = s.student_id
      JOIN login l ON s.student_id = l.id
      WHERE i.company_id = $1
      ORDER BY a.applied_date DESC
    `, [companyId]);

    console.log('Found applications:', result.rows.length);

    res.json({
      success: true,
      applications: result.rows
    });

  } catch (error) {
    console.error('Applications fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
});

// Get company's internships
router.get('/company/internships', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { id: companyId } = req.user;
    
    console.log('Fetching internships for company ID:', companyId);

    const result = await pool.query(`
      SELECT 
        i.*,
        COALESCE(COUNT(a.application_id), 0) as application_count
      FROM internships i
      LEFT JOIN applications a ON i.internship_id = a.internship_id
      WHERE i.company_id = $1
      GROUP BY i.internship_id
      ORDER BY i.created_at DESC
    `, [companyId]);

    console.log('Found internships:', result.rows.length);

    res.json({
      success: true,
      internships: result.rows
    });

  } catch (error) {
    console.error('Internships fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch internships',
      error: error.message
    });
  }
});

// Create new internship
router.post('/company/internships', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { id: companyId } = req.user;
    const {
      title,
      description,
      requirements,
      location,
      type,
      duration_months,
      salary_min,
      salary_max,
      application_deadline
    } = req.body;

    console.log('Creating internship for company:', companyId, 'with data:', req.body);

    // Validation
    if (!title || !description || !requirements || !location || !type || !duration_months) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const result = await pool.query(`
      INSERT INTO internships (
        company_id, title, description, requirements, location, type,
        duration_months, salary_min, salary_max, application_deadline,
        created_at, updated_at, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true)
      RETURNING *
    `, [
      companyId, title, description, requirements, location, type,
      duration_months, salary_min, salary_max, application_deadline
    ]);

    console.log('Internship created successfully:', result.rows[0].internship_id);

    res.status(201).json({
      success: true,
      message: 'Internship created successfully',
      internship: result.rows[0]
    });

  } catch (error) {
    console.error('Internship creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create internship',
      error: error.message
    });
  }
});

// Update application status
router.put('/company/applications/:id/status', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const { status } = req.body;
    const { id: companyId } = req.user;

    console.log('Updating application:', applicationId, 'to status:', status, 'for company:', companyId);

    // Verify that this application belongs to the company's internship
    const verifyResult = await pool.query(`
      SELECT a.application_id 
      FROM applications a
      JOIN internships i ON a.internship_id = i.internship_id
      WHERE a.application_id = $1 AND i.company_id = $2
    `, [applicationId, companyId]);

    if (verifyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found or unauthorized'
      });
    }

    // Update application status
    await pool.query(
      'UPDATE applications SET status = $1 WHERE application_id = $2',
      [status, applicationId]
    );

    console.log('Application status updated successfully');

    res.json({
      success: true,
      message: `Application status updated to ${status}`
    });

  } catch (error) {
    console.error('Application status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status',
      error: error.message
    });
  }
});

// Update internship
router.put('/company/internships/:id', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { id: internshipId } = req.params;
    const { id: companyId } = req.user;
    const updateData = req.body;

    console.log('Updating internship:', internshipId, 'with data:', updateData);

    // Verify that this internship belongs to the company
    const verifyResult = await pool.query(
      'SELECT internship_id FROM internships WHERE internship_id = $1 AND company_id = $2',
      [internshipId, companyId]
    );

    if (verifyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found or unauthorized'
      });
    }

    // Build dynamic update query based on provided fields
    const fields = [];
    const values = [];
    let paramCount = 0;

    // List of allowed fields to update
    const allowedFields = [
      'title', 'description', 'requirements', 'location', 'type',
      'duration_months', 'salary_min', 'salary_max', 'application_deadline', 'is_active'
    ];

    allowedFields.forEach(field => {
      if (updateData.hasOwnProperty(field)) {
        paramCount++;
        fields.push(`${field} = $${paramCount}`);
        values.push(updateData[field]);
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    // Add the internship ID as the last parameter
    paramCount++;
    values.push(internshipId);

    const updateQuery = `
      UPDATE internships 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE internship_id = $${paramCount}
      RETURNING *
    `;

    console.log('Update query:', updateQuery);
    console.log('Update values:', values);

    const result = await pool.query(updateQuery, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    res.json({
      success: true,
      message: 'Internship updated successfully',
      internship: result.rows[0]
    });

  } catch (error) {
    console.error('Internship update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update internship',
      error: error.message
    });
  }
});

// Delete internship
router.delete('/company/internships/:id', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { id: internshipId } = req.params;
    const { id: companyId } = req.user;

    console.log('Deleting internship:', internshipId, 'for company:', companyId);

    // Verify that this internship belongs to the company
    const verifyResult = await pool.query(
      'SELECT internship_id FROM internships WHERE internship_id = $1 AND company_id = $2',
      [internshipId, companyId]
    );

    if (verifyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found or unauthorized'
      });
    }

    // Delete the internship
    const result = await pool.query(
      'DELETE FROM internships WHERE internship_id = $1 AND company_id = $2 RETURNING internship_id',
      [internshipId, companyId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    console.log('Internship deleted successfully');

    res.json({
      success: true,
      message: 'Internship deleted successfully'
    });

  } catch (error) {
    console.error('Internship deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete internship',
      error: error.message
    });
  }
});

// Debug endpoint to test applications fetching
router.get('/company/debug-applications', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { id: companyId } = req.user;
    console.log('Debug: Company ID from token:', companyId);

    // First, check if company has any internships
    const internshipsResult = await pool.query(
      'SELECT internship_id, title FROM internships WHERE company_id = $1',
      [companyId]
    );
    console.log('Debug: Company internships:', internshipsResult.rows);

    // Check all applications in the database
    const allApplicationsResult = await pool.query(
      'SELECT application_id, internship_id, student_profile_id, status FROM applications'
    );
    console.log('Debug: All applications in DB:', allApplicationsResult.rows);

    // Then check applications for those internships
    const applicationsResult = await pool.query(`
      SELECT 
        a.application_id,
        a.internship_id,
        a.student_profile_id,
        a.status,
        a.applied_date,
        i.title as internship_title
      FROM applications a
      JOIN internships i ON a.internship_id = i.internship_id
      WHERE i.company_id = $1
      ORDER BY a.applied_date DESC
    `, [companyId]);
    console.log('Debug: Applications found:', applicationsResult.rows);

    // Check if students table has data
    const studentsResult = await pool.query(
      'SELECT student_id, name FROM students LIMIT 5'
    );
    console.log('Debug: Sample students:', studentsResult.rows);

    res.json({
      success: true,
      debug: {
        companyId,
        internships: internshipsResult.rows,
        allApplications: allApplicationsResult.rows,
        applications: applicationsResult.rows,
        sampleStudents: studentsResult.rows
      }
    });

  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      success: false,
      message: 'Debug failed',
      error: error.message
    });
  }
});

export default router;