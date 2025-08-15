import express from 'express';
import { Pool } from 'pg';
import multer from 'multer';
import path from 'path';
const router = express.Router();

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware to verify JWT token (assuming this is imported from authRoutes)
import jwt from 'jsonwebtoken';
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

// Middleware to ensure user is a student
const requireStudent = (req, res, next) => {
  if (req.user.user_type !== 'student') {
    return res.status(403).json({
      success: false,
      message: 'Access restricted to students only'
    });
  }
  next();
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  }
});

// Get student profile
router.get('/profile', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { user_id } = req.user;

    const result = await pool.query(
      `SELECT u.user_id, u.name, u.phone_number, u.profile_picture_url,
              sp.student_profile_id, sp.university, sp.major, sp.graduation_date,
              sp.bio, sp.resume_url, sp.portfolio_url,
              l.email
       FROM users u
       JOIN student_profiles sp ON u.user_id = sp.user_id
       JOIN login l ON u.user_id = l.user_id
       WHERE u.user_id = $1`,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const profile = result.rows[0];

    // Get student skills
    const skillsResult = await pool.query(
      `SELECT s.skill_id, s.skill_name
       FROM student_skills ss
       JOIN skills s ON ss.skill_id = s.skill_id
       WHERE ss.student_profile_id = $1`,
      [profile.student_profile_id]
    );

    profile.skills = skillsResult.rows;

    res.json({
      success: true,
      profile
    });

  } catch (error) {
    console.error('Student profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student profile'
    });
  }
});

// Update student profile
router.put('/profile', authenticateToken, requireStudent, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { user_id } = req.user;
    const {
      name,
      phone_number,
      university,
      major,
      graduation_date,
      bio,
      portfolio_url
    } = req.body;

    // Update users table
    await client.query(
      'UPDATE users SET name = $1, phone_number = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3',
      [name, phone_number, user_id]
    );

    // Update student_profiles table
    await client.query(
      `UPDATE student_profiles 
       SET university = $1, major = $2, graduation_date = $3, bio = $4, portfolio_url = $5
       WHERE user_id = $6`,
      [university, major, graduation_date, bio, portfolio_url, user_id]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Student profile updated successfully'
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Student profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student profile'
    });
  } finally {
    client.release();
  }
});

// Get student skills
router.get('/skills', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { user_id } = req.user;

    // Get student_profile_id first
    const profileResult = await pool.query(
      'SELECT student_profile_id FROM student_profiles WHERE user_id = $1',
      [user_id]
    );

    if (profileResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const student_profile_id = profileResult.rows[0].student_profile_id;

    const result = await pool.query(
      `SELECT s.skill_id, s.skill_name
       FROM student_skills ss
       JOIN skills s ON ss.skill_id = s.skill_id
       WHERE ss.student_profile_id = $1
       ORDER BY s.skill_name`,
      [student_profile_id]
    );

    res.json({
      success: true,
      skills: result.rows
    });

  } catch (error) {
    console.error('Student skills fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skills'
    });
  }
});

// Add skill to student
router.post('/skills', authenticateToken, requireStudent, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { user_id } = req.user;
    const { skill_name } = req.body;

    // Get student_profile_id
    const profileResult = await client.query(
      'SELECT student_profile_id FROM student_profiles WHERE user_id = $1',
      [user_id]
    );

    if (profileResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const student_profile_id = profileResult.rows[0].student_profile_id;

    // Check if skill exists, if not create it
    let skillResult = await client.query(
      'SELECT skill_id FROM skills WHERE skill_name = $1',
      [skill_name]
    );

    let skill_id;
    if (skillResult.rows.length === 0) {
      // Create new skill
      const newSkillResult = await client.query(
        'INSERT INTO skills (skill_name) VALUES ($1) RETURNING skill_id',
        [skill_name]
      );
      skill_id = newSkillResult.rows[0].skill_id;
    } else {
      skill_id = skillResult.rows[0].skill_id;
    }

    // Check if student already has this skill
    const existingSkillResult = await client.query(
      'SELECT * FROM student_skills WHERE student_profile_id = $1 AND skill_id = $2',
      [student_profile_id, skill_id]
    );

    if (existingSkillResult.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Skill already added'
      });
    }

    // Add skill to student
    await client.query(
      'INSERT INTO student_skills (student_profile_id, skill_id) VALUES ($1, $2)',
      [student_profile_id, skill_id]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Skill added successfully',
      skill: { skill_id, skill_name }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Add skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add skill'
    });
  } finally {
    client.release();
  }
});

// Remove skill from student
router.delete('/skills/:skillId', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { skillId } = req.params;

    // Get student_profile_id
    const profileResult = await pool.query(
      'SELECT student_profile_id FROM student_profiles WHERE user_id = $1',
      [user_id]
    );

    if (profileResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const student_profile_id = profileResult.rows[0].student_profile_id;

    // Remove skill
    const result = await pool.query(
      'DELETE FROM student_skills WHERE student_profile_id = $1 AND skill_id = $2',
      [student_profile_id, skillId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found or already removed'
      });
    }

    res.json({
      success: true,
      message: 'Skill removed successfully'
    });

  } catch (error) {
    console.error('Remove skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove skill'
    });
  }
});

// Upload resume
router.post('/resume', authenticateToken, requireStudent, upload.single('resume'), async (req, res) => {
  try {
    const { user_id } = req.user;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded'
      });
    }

    const resume_url = `/uploads/resumes/${req.file.filename}`;

    // Update student profile with resume URL
    const result = await pool.query(
      'UPDATE student_profiles SET resume_url = $1 WHERE user_id = $2',
      [resume_url, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      resume_url
    });

  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload resume'
    });
  }
});

// Get student applications
router.get('/applications', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { user_id } = req.user;

    const result = await pool.query(
      `SELECT a.application_id, a.status, a.applied_date,
              i.internship_id, i.title, i.description, i.location, i.type,
              i.salary_min, i.salary_max, i.application_deadline,
              c.company_name, c.logo_url
       FROM applications a
       JOIN student_profiles sp ON a.student_profile_id = sp.student_profile_id
       JOIN internships i ON a.internship_id = i.internship_id
       JOIN companies c ON i.company_id = c.company_id
       WHERE sp.user_id = $1
       ORDER BY a.applied_date DESC`,
      [user_id]
    );

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

export default router;