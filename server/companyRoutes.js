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

// Configure multer for internship documents uploads
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/internship-documents/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const documentUpload = multer({
  storage: documentStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, JPEG, PNG files are allowed'));
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
    // console.log('Fetching applications for company ID:', companyId);

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
    
    // console.log('Fetching internships for company ID:', companyId);

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

    // console.log('Found internships:', result.rows.length);

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

// POST /api/internship-documents
router.post('/internship-documents', authenticateToken, requireCompany, documentUpload.fields([
  { name: 'certificate', maxCount: 1 },
  { name: 'letter', maxCount: 1 }
]), async (req, res) => {
  try {
    const { studentName, internshipPost, mentor, feedback } = req.body;
    const companyId = req.user.id;
    console.log('Received studentName:', studentName);
    console.log('Received internshipPost:', internshipPost);
    // Lookup student_id from students table
    const studentRes = await pool.query('SELECT student_id, name FROM students WHERE name = $1', [studentName]);
    console.log('Student query result:', studentRes.rows);
    if (studentRes.rows.length === 0) {
      console.error('Student not found:', studentName);
      return res.status(400).json({ success: false, message: `Student not found: ${studentName}. Please check spelling/case.` });
    }
    const student_id = studentRes.rows[0].student_id;
    // Lookup internship_id from internships table
    const internshipRes = await pool.query('SELECT internship_id, title FROM internships WHERE title = $1 AND company_id = $2', [internshipPost, companyId]);
    console.log('Internship query result:', internshipRes.rows);
    if (internshipRes.rows.length === 0) {
      console.error('Internship post not found:', internshipPost);
      return res.status(400).json({ success: false, message: `Internship post not found: ${internshipPost}. Please check spelling/case.` });
    }
    const internship_id = internshipRes.rows[0].internship_id;
    // You may want to get actual start/end dates from internship or request
    const start_date = new Date();
    const end_date = new Date();
    let certificate_file_url = null;
    let letter_file_url = null;
    if (req.files['certificate']) {
      certificate_file_url = `/uploads/internship-documents/${req.files['certificate'][0].filename}`;
    }
    if (req.files['letter']) {
      letter_file_url = `/uploads/internship-documents/${req.files['letter'][0].filename}`;
    }
    // Insert into internship_documents table
    await pool.query(`
      INSERT INTO internship_documents (
        student_id, company_id, internship_id, certificate_file_url, letter_file_url, mentor, feedback, start_date, end_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [student_id, companyId, internship_id, certificate_file_url, letter_file_url, mentor, feedback, start_date, end_date]);
    res.json({ success: true, message: 'Documents uploaded successfully.' });
  } catch (error) {
    console.error('Internship document upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload documents.' });
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

// GET /api/students - return all students for dropdown
router.get('/students', authenticateToken, requireCompany, async (req, res) => {
  try {
    const result = await pool.query('SELECT student_id, name FROM students ORDER BY name ASC');
    res.json({ success: true, students: result.rows });
  } catch (error) {
    console.error('Fetch students error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
});

// GET /api/internship-documents/student/:studentId - fetch internship documents for a student
router.get('/internship-documents/student/:studentId', authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = await pool.query(`
      SELECT d.*, c.company_name, i.title AS internship_title
      FROM internship_documents d
      JOIN companies c ON d.company_id = c.company_id
      JOIN internships i ON d.internship_id = i.internship_id
      WHERE d.student_id = $1
      ORDER BY d.created_at DESC
    `, [studentId]);
    res.json({ success: true, documents: result.rows });
  } catch (error) {
    console.error('Fetch internship documents error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch internship documents' });
  }
});

// GET /api/company/student-applications?student_id=... - fetch applications for a student (company access)
router.get('/company/student-applications', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { student_id } = req.query;
    if (!student_id) return res.status(400).json({ success: false, message: 'student_id is required' });
    const result = await pool.query(`
      SELECT a.application_id, a.internship_id, i.title as internship_title
      FROM applications a
      JOIN internships i ON a.internship_id = i.internship_id
      WHERE a.student_profile_id = $1
      ORDER BY a.applied_date DESC
    `, [student_id]);
    res.json({ success: true, applications: result.rows });
  } catch (error) {
    console.error('Company fetch student applications error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch student applications' });
  }
});

// GET /api/internship-documents/company/:companyId - fetch internship documents for a company
router.get('/internship-documents/company/:companyId', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { companyId } = req.params;
    const result = await pool.query(`
      SELECT d.*, s.name AS student_name, i.title AS internship_title
      FROM internship_documents d
      JOIN students s ON d.student_id = s.student_id
      JOIN internships i ON d.internship_id = i.internship_id
      WHERE d.company_id = $1
      ORDER BY d.created_at DESC
    `, [companyId]);
    res.json({ success: true, documents: result.rows });
    // console.log('Fetched internship documents for company:', companyId);
  } catch (error) {
    console.error('Fetch internship documents for company error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch internship documents for company' });
  }
});

// PUT /api/internship-documents/:id - update mentor, feedback, and files
router.put('/internship-documents/:id', authenticateToken, requireCompany, documentUpload.fields([
  { name: 'certificate', maxCount: 1 },
  { name: 'letter', maxCount: 1 }
]), async (req, res) => {
  try {
    const { id } = req.params;
    const { mentor, feedback } = req.body;
    let certificate_file_url = null;
    let letter_file_url = null;
    if (req.files['certificate']) {
      certificate_file_url = `/uploads/internship-documents/${req.files['certificate'][0].filename}`;
    }
    if (req.files['letter']) {
      letter_file_url = `/uploads/internship-documents/${req.files['letter'][0].filename}`;
    }
    // Build dynamic update query
    const fields = [];
    const values = [];
    let paramCount = 0;
    if (mentor !== undefined) {
      paramCount++;
      fields.push(`mentor = $${paramCount}`);
      values.push(mentor);
    }
    if (feedback !== undefined) {
      paramCount++;
      fields.push(`feedback = $${paramCount}`);
      values.push(feedback);
    }
    if (certificate_file_url) {
      paramCount++;
      fields.push(`certificate_file_url = $${paramCount}`);
      values.push(certificate_file_url);
    }
    if (letter_file_url) {
      paramCount++;
      fields.push(`letter_file_url = $${paramCount}`);
      values.push(letter_file_url);
    }
    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' });
    }
    paramCount++;
    values.push(id);
    const updateQuery = `UPDATE internship_documents SET ${fields.join(', ')} WHERE document_id = $${paramCount}`;
    await pool.query(updateQuery, values);
    res.json({ success: true, message: 'Internship document updated' });
  } catch (error) {
    console.error('Internship document update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update internship document' });
  }
});

// DELETE /api/internship-documents/:id - delete the post
router.delete('/internship-documents/:id', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    if (type === 'certificate' || type === 'letter') {
      // Remove only the file
      const field = type === 'certificate' ? 'certificate_file_url' : 'letter_file_url';
      await pool.query(`UPDATE internship_documents SET ${field} = NULL WHERE document_id = $1`, [id]);
      return res.json({ success: true, message: `${type} removed` });
    } else {
      // Delete the whole post
      await pool.query('DELETE FROM internship_documents WHERE document_id = $1', [id]);
      return res.json({ success: true, message: 'Internship document deleted' });
    }
  } catch (error) {
    console.error('Internship document delete error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete internship document' });
  }
});

export default router;