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

    // console.log('Debug - Token data:', { id, student_id, profileId });

    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID not found in token. Please login again.'
      });
    }

    // First, let's check what columns exist in the students table
    try {
      const columnsResult = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'students' AND table_schema = 'public'
      `);
      // console.log('Available columns in students table:', columnsResult.rows.map(r => r.column_name));
    } catch (columnError) {
      console.error('Error checking columns:', columnError);
    }

    // Use a basic query with only essential columns that should exist
    const result = await pool.query(
      `SELECT s.student_id, s.name, s.phone_number, s.bio, s.resume_url, s.profile_picture_url,
              l.email, l.id
       FROM students s
       JOIN login l ON l.id = s.student_id
       WHERE s.student_id = $1`,
      [profileId]
    );

    // console.log('Debug - Query result:', result.rows.length, 'rows found');

    if (result.rows.length === 0) {
      // Try to check if student record exists at all
      const checkStudent = await pool.query('SELECT student_id FROM students WHERE student_id = $1', [profileId]);
      const checkLogin = await pool.query('SELECT id FROM login WHERE id = $1', [id]);
      
      // console.log('Debug - Student exists:', checkStudent.rows.length > 0);
      // console.log('Debug - Login exists:', checkLogin.rows.length > 0);
      
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

    // Initialize optional fields with defaults
    profile.skills = [];
    profile.education = [];
    profile.address = profile.address || '';
    profile.resume_url = profile.resume_url || '';
    profile.portfolio_url = '';
    profile.phone_verified = false;
    profile.profile_picture_url = profile.profile_picture_url || '';

    // Try to get additional fields if they exist
    try {
      const additionalResult = await pool.query(
        `SELECT resume_url, portfolio_url, skills, address, education, phone_verified, profile_picture_url
         FROM students WHERE student_id = $1`,
        [profileId]
      );
      
      if (additionalResult.rows.length > 0) {
        const additional = additionalResult.rows[0];
        
        // Parse skills from JSONB
        if (additional.skills) {
          try {
            profile.skills = typeof additional.skills === 'string' ? JSON.parse(additional.skills) : additional.skills;
          } catch (error) {
            console.error('Error parsing skills JSON:', error);
            profile.skills = [];
          }
        }

        // Parse education from JSONB
        if (additional.education) {
          try {
            profile.education = typeof additional.education === 'string' ? JSON.parse(additional.education) : additional.education;
          } catch (error) {
            console.error('Error parsing education JSON:', error);
            profile.education = [];
          }
        }

        // Set other fields if they exist
        profile.address = additional.address || '';
        profile.resume_url = additional.resume_url || '';
        profile.portfolio_url = additional.portfolio_url || '';
        profile.phone_verified = additional.phone_verified || false;
        profile.profile_picture_url = additional.profile_picture_url || '';
      }
    } catch (additionalError) {
      console.log('Some optional columns may not exist, using defaults:', additionalError.message);
    }

    res.json({
      success: true,
      profile
    });

  } catch (error) {
    console.error('Student profile fetch error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
      position: error.position,
      query: error.query
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
      email,
      address,
      bio,
      portfolio_url,
      education
    } = req.body;

    // Use id as student_id if student_id is not present
    const profileId = student_id || id;

    // console.log('Debug - Update profile:', { id, student_id, profileId, profileData: req.body });

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

    // Update students table - only update fields that exist
    let updateQuery = 'UPDATE students SET bio = $1, name = $2, phone_number = $3';
    let updateParams = [bio || '', name || '', phone_number || ''];
    let paramCount = 3;
    
    // Add optional fields if they were provided
    if (portfolio_url !== undefined) {
      paramCount++;
      updateQuery += `, portfolio_url = $${paramCount}`;
      updateParams.push(portfolio_url);
    }
    
    if (address !== undefined) {
      paramCount++;
      updateQuery += `, address = $${paramCount}`;
      updateParams.push(address);
    }
    
    if (education !== undefined) {
      paramCount++;
      updateQuery += `, education = $${paramCount}`;
      updateParams.push(JSON.stringify(education || []));
    }
    
    paramCount++;
    updateQuery += ` WHERE student_id = $${paramCount}`;
    updateParams.push(profileId);

    const updateResult = await client.query(updateQuery, updateParams);

    // Update email in login table if provided
    if (email) {
      await client.query(
        `UPDATE login SET email = $1 WHERE id = $2`,
        [email, profileId]
      );
    }

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