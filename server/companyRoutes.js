const express = require('express');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// JWT middleware
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to ensure user is a company
const requireCompany = (req, res, next) => {
  if (req.user.user_type !== 'company') {
    return res.status(403).json({
      success: false,
      message: 'Access restricted to companies only'
    });
  }
  next();
};

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

// Get company profile
router.get('/profile', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { user_id } = req.user;

    const result = await pool.query(
      `SELECT u.user_id, u.name, u.phone_number, u.profile_picture_url,
              c.company_id, c.company_name, c.company_website, c.industry,
              c.company_size, c.about, c.address, c.logo_url,
              l.email
       FROM users u
       JOIN companies c ON u.user_id = c.user_id
       JOIN login l ON u.user_id = l.user_id
       WHERE u.user_id = $1`,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    res.json({
      success: true,
      profile: result.rows[0]
    });

  } catch (error) {
    console.error('Company profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company profile'
    });
  }
});

// Update company profile
router.put('/profile', authenticateToken, requireCompany, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { user_id } = req.user;
    const {
      name,
      phone_number,
      company_name,
      company_website,
      industry,
      company_size,
      about,
      address
    } = req.body;

    // Update users table
    await client.query(
      'UPDATE users SET name = $1, phone_number = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3',
      [name, phone_number, user_id]
    );

    // Update companies table
    await client.query(
      `UPDATE companies 
       SET company_name = $1, company_website = $2, industry = $3, 
           company_size = $4, about = $5, address = $6
       WHERE user_id = $7`,
      [company_name, company_website, industry, company_size, about, address, user_id]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Company profile updated successfully'
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Company profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update company profile'
    });
  } finally {
    client.release();
  }
});

// Create internship
router.post('/internships', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { user_id } = req.user;
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

    // Get company_id
    const companyResult = await pool.query(
      'SELECT company_id FROM companies WHERE user_id = $1',
      [user_id]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    const company_id = companyResult.rows[0].company_id;

    const result = await pool.query(
      `INSERT INTO internships (company_id, title, description, requirements, location, type, 
                               duration_months, salary_min, salary_max, application_deadline)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING internship_id`,
      [company_id, title, description, requirements, location, type, 
       duration_months, salary_min, salary_max, application_deadline]
    );

    res.status(201).json({
      success: true,
      message: 'Internship created successfully',
      internship_id: result.rows[0].internship_id
    });

  } catch (error) {
    console.error('Internship creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create internship'
    });
  }
});

// Get company's internships
router.get('/internships', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { user_id } = req.user;

    const result = await pool.query(
      `SELECT i.*, c.company_name,
              COUNT(a.application_id) as application_count
       FROM internships i
       JOIN companies c ON i.company_id = c.company_id
       LEFT JOIN applications a ON i.internship_id = a.internship_id
       WHERE c.user_id = $1
       GROUP BY i.internship_id, c.company_name
       ORDER BY i.created_at DESC`,
      [user_id]
    );

    res.json({
      success: true,
      internships: result.rows
    });

  } catch (error) {
    console.error('Company internships fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch internships'
    });
  }
});

// Update internship
router.put('/internships/:internshipId', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { internshipId } = req.params;
    const {
      title,
      description,
      requirements,
      location,
      type,
      duration_months,
      salary_min,
      salary_max,
      application_deadline,
      is_active
    } = req.body;

    // Verify internship belongs to company
    const verifyResult = await pool.query(
      `SELECT i.internship_id 
       FROM internships i
       JOIN companies c ON i.company_id = c.company_id
       WHERE i.internship_id = $1 AND c.user_id = $2`,
      [internshipId, user_id]
    );

    if (verifyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found or access denied'
      });
    }

    const result = await pool.query(
      `UPDATE internships 
       SET title = $1, description = $2, requirements = $3, location = $4, type = $5,
           duration_months = $6, salary_min = $7, salary_max = $8, 
           application_deadline = $9, is_active = $10
       WHERE internship_id = $11`,
      [title, description, requirements, location, type, duration_months, 
       salary_min, salary_max, application_deadline, is_active, internshipId]
    );

    res.json({
      success: true,
      message: 'Internship updated successfully'
    });

  } catch (error) {
    console.error('Internship update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update internship'
    });
  }
});

// Delete internship
router.delete('/internships/:internshipId', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { internshipId } = req.params;

    // Verify internship belongs to company
    const verifyResult = await pool.query(
      `SELECT i.internship_id 
       FROM internships i
       JOIN companies c ON i.company_id = c.company_id
       WHERE i.internship_id = $1 AND c.user_id = $2`,
      [internshipId, user_id]
    );

    if (verifyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found or access denied'
      });
    }

    await pool.query('DELETE FROM internships WHERE internship_id = $1', [internshipId]);

    res.json({
      success: true,
      message: 'Internship deleted successfully'
    });

  } catch (error) {
    console.error('Internship deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete internship'
    });
  }
});

// Get applications for company's internships
router.get('/applications', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { internship_id } = req.query;

    let query = `
      SELECT a.application_id, a.status, a.applied_date,
             i.internship_id, i.title as internship_title,
             u.name as student_name, u.phone_number,
             sp.university, sp.major, sp.graduation_date, sp.bio, sp.resume_url,
             l.email as student_email
      FROM applications a
      JOIN internships i ON a.internship_id = i.internship_id
      JOIN companies c ON i.company_id = c.company_id
      JOIN student_profiles sp ON a.student_profile_id = sp.student_profile_id
      JOIN users u ON sp.user_id = u.user_id
      JOIN login l ON u.user_id = l.user_id
      WHERE c.user_id = $1
    `;

    const params = [user_id];

    if (internship_id) {
      query += ' AND i.internship_id = $2';
      params.push(internship_id);
    }

    query += ' ORDER BY a.applied_date DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      applications: result.rows
    });

  } catch (error) {
    console.error('Applications fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
});

// Update application status
router.put('/applications/:applicationId', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { applicationId } = req.params;
    const { status } = req.body;

    // Verify application belongs to company's internship
    const verifyResult = await pool.query(
      `SELECT a.application_id 
       FROM applications a
       JOIN internships i ON a.internship_id = i.internship_id
       JOIN companies c ON i.company_id = c.company_id
       WHERE a.application_id = $1 AND c.user_id = $2`,
      [applicationId, user_id]
    );

    if (verifyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found or access denied'
      });
    }

    await pool.query(
      'UPDATE applications SET status = $1 WHERE application_id = $2',
      [status, applicationId]
    );

    res.json({
      success: true,
      message: 'Application status updated successfully'
    });

  } catch (error) {
    console.error('Application status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status'
    });
  }
});

// Upload company logo
router.post('/logo', authenticateToken, requireCompany, upload.single('logo'), async (req, res) => {
  try {
    const { user_id } = req.user;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No logo file uploaded'
      });
    }

    const logo_url = `/uploads/logos/${req.file.filename}`;

    const result = await pool.query(
      'UPDATE companies SET logo_url = $1 WHERE user_id = $2',
      [logo_url, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      logo_url
    });

  } catch (error) {
    console.error('Logo upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload logo'
    });
  }
});

module.exports = router;