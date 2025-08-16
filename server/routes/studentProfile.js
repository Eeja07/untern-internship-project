import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, requireStudent } from '../middleware/auth.js';

const router = express.Router();

// GET /api/student/profile - Get student profile
router.get('/', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { id, student_id } = req.user;

    // Use id as student_id if student_id is not present
    const profileId = student_id || id;

    console.log('Debug - Token data:', { id, student_id, profileId });

    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID not found in token. Please login again.'
      });
    }

    const result = await pool.query(
      `SELECT s.student_id, s.university, s.major,
              s.bio, s.resume_url, s.portfolio_url, s.name, s.phone_number, s.skills,
              l.email, l.id
       FROM students s
       JOIN login l ON l.id = s.student_id
       WHERE s.student_id = $1`,
      [profileId]
    );

    console.log('Debug - Query result:', result.rows.length, 'rows found');

    if (result.rows.length === 0) {
      // Try to check if student record exists at all
      const checkStudent = await pool.query('SELECT student_id FROM students WHERE student_id = $1', [profileId]);
      const checkLogin = await pool.query('SELECT id FROM login WHERE id = $1', [id]);
      
      console.log('Debug - Student exists:', checkStudent.rows.length > 0);
      console.log('Debug - Login exists:', checkLogin.rows.length > 0);
      
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
        debug: {
          profileId,
          studentExists: checkStudent.rows.length > 0,
          loginExists: checkLogin.rows.length > 0
        }
      });
    }

    const profile = result.rows[0];

    // Parse skills from JSONB
    if (profile.skills) {
      try {
        profile.skills = typeof profile.skills === 'string' ? JSON.parse(profile.skills) : profile.skills;
      } catch (error) {
        console.error('Error parsing skills JSON:', error);
        profile.skills = [];
      }
    } else {
      profile.skills = [];
    }

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

// PUT /api/student/profile - Update student profile
router.put('/', authenticateToken, requireStudent, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id, student_id } = req.user;
    const {
      name,
      phone_number,
      university,
      major,
      bio,
      portfolio_url
    } = req.body;

    // Use id as student_id if student_id is not present
    const profileId = student_id || id;

    console.log('Debug - Update profile:', { id, student_id, profileId, profileData: req.body });

    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID not found in token'
      });
    }

    // Check if student record exists before updating
    const checkResult = await client.query('SELECT student_id FROM students WHERE student_id = $1', [profileId]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found for update',
        debug: { profileId }
      });
    }

    // Update students table
    const updateResult = await client.query(
      `UPDATE students 
       SET university = $1, major = $2, bio = $3, portfolio_url = $4, name = $5, phone_number = $6
       WHERE student_id = $7`,
      [university, major, bio, portfolio_url, name, phone_number, profileId]
    );

    console.log('Debug - Update result:', updateResult.rowCount, 'rows affected');

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
      message: 'Failed to update student profile',
      error: error.message
    });
  } finally {
    client.release();
  }
});

export default router;