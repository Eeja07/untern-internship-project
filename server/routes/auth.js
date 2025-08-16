import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { pool } from '../config/database.js';
import { authenticateToken, JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      email,
      password,
      name,
      phone_number,
      user_type = 'student',
      // Company fields
      company_name,
      company_website,
      industry,
      company_size,
      about,
      address,
      // Student fields
      university,
      major,
      bio
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check if email is verified
    const verificationResult = await client.query(
      'SELECT is_verified FROM email_verifications WHERE email = $1',
      [email]
    );

    if (verificationResult.rows.length === 0 || !verificationResult.rows[0].is_verified) {
      return res.status(400).json({
        success: false,
        message: 'Please verify your email before registering'
      });
    }

    // Use email as default name if not provided
    const userName = name || email.split('@')[0];
    
    // For company registration, use a default company name if not provided
    let companyName = company_name;
    if (user_type === 'company' && !company_name) {
      companyName = `${userName} Company`; // Default company name
    }

    // Check if user already exists
    const existingUser = await client.query(
      'SELECT email FROM login WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into login table
    const loginResult = await client.query(
      `INSERT INTO login (email, password, user_type, is_verified)
       VALUES ($1, $2, $3, true) RETURNING id`,
      [email, hashedPassword, user_type]
    );

    const loginId = loginResult.rows[0].id;
    let studentCreatedId = null;

    // Insert into appropriate profile table based on user type
    if (user_type === 'company') {
      await client.query(
        `INSERT INTO companies (company_id, company_name, company_website, industry, company_size, about, address)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          loginId, // Use loginId as company_id
          companyName || '',
          company_website || '',
          industry || '',
          company_size || '',
          about || '',
          address || ''
        ]
      );
    } else if (user_type === 'student') {
      // Insert into students table with same UUID as login.id
      await client.query(
        `INSERT INTO students (student_id, university, major, bio, name, phone_number)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          loginId, // Use loginId as student_id
          university || '',
          major || '',
          bio || '',
          userName,
          phone_number || ''
        ]
      );
      studentCreatedId = loginId;
    }

    // Clean up verification record
    await client.query('DELETE FROM email_verifications WHERE email = $1', [email]);

    await client.query('COMMIT');

    // For students, we need to get the student_id we just created
    let userData = {
      id: loginResult.rows[0].id,
      email,
      name: userName,
      userType: user_type,
      phone_number
    };

    if (user_type === 'student' && studentCreatedId) {
      userData.student_id = studentCreatedId;
    }

    // Generate JWT token with student_id included if available
    const tokenPayload = { 
      id: loginResult.rows[0].id, 
      email, 
      user_type,
      ...(studentCreatedId ? { student_id: studentCreatedId } : {})
    };
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userData
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  } finally {
    client.release();
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Get user from login table
    const result = await pool.query(
      `SELECT l.id, l.email, l.password, l.user_type, l.failed_attempts, l.is_locked
       FROM login l
       WHERE l.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = result.rows[0];

    // Check if account is locked
    if (user.is_locked) {
      return res.status(423).json({
        success: false,
        message: 'Account is locked due to multiple failed attempts'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Increment failed attempts
      await pool.query(
        'UPDATE login SET failed_attempts = failed_attempts + 1, is_locked = CASE WHEN failed_attempts >= 4 THEN true ELSE false END WHERE email = $1',
        [email]
      );

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Reset failed attempts on successful login
    await pool.query(
      'UPDATE login SET failed_attempts = 0, last_login = CURRENT_TIMESTAMP WHERE email = $1',
      [email]
    );

    // For students, include student_id in token
    let tokenPayload = { id: user.id, email: user.email, user_type: user.user_type };
    
    if (user.user_type === 'student') {
      tokenPayload.student_id = user.id; // student_id is same as login.id
    }

    // Generate JWT token
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        userType: user.user_type
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { id, user_type } = req.user;

    // Get basic login info
    const loginResult = await pool.query(
      'SELECT id, email, user_type FROM login WHERE id = $1',
      [id]
    );

    if (loginResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userProfile = loginResult.rows[0];

    // Get additional profile data based on user type
    if (user_type === 'company') {
      const companyResult = await pool.query(
        'SELECT * FROM companies WHERE company_id = $1',
        [id]
      );
      if (companyResult.rows.length > 0) {
        userProfile.company = companyResult.rows[0];
      }
    } else if (user_type === 'student') {
      const studentResult = await pool.query(
        'SELECT * FROM students WHERE student_id = $1',
        [id]
      );
      if (studentResult.rows.length > 0) {
        userProfile.student = studentResult.rows[0];
      }
    }

    res.json({
      success: true,
      user: userProfile
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Verify token
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      userType: req.user.user_type
    }
  });
});

// Refresh token
router.post('/refresh', authenticateToken, (req, res) => {
  try {
    const { id, email, user_type, student_id } = req.user;

    // Generate new token with same payload structure
    const tokenPayload = { 
      id, 
      email, 
      user_type,
      ...(student_id ? { student_id } : {})
    };
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      token
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    // Get current password hash
    const result = await pool.query(
      'SELECT password FROM login WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, result.rows[0].password);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      'UPDATE login SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedNewPassword, id]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id, user_type } = req.user;
    const { ...otherFields } = req.body;

    // Update profile-specific table only (no users table)
    if (user_type === 'company') {
      const {
        company_name,
        company_website,
        industry,
        company_size,
        about,
        address
      } = otherFields;

      await client.query(
        `UPDATE companies 
         SET company_name = $1, company_website = $2, industry = $3, 
             company_size = $4, about = $5, address = $6
         WHERE company_id = $7`,
        [company_name, company_website, industry, company_size, about, address, id]
      );
    } else if (user_type === 'student') {
      const {
        university,
        major,
        bio,
        portfolio_url
      } = otherFields;

      await client.query(
        `UPDATE students 
         SET university = $1, major = $2, 
             bio = $3, portfolio_url = $4
         WHERE student_id = $5`,
        [university, major, bio, portfolio_url, req.user.student_id]
      );
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  } finally {
    client.release();
  }
});

// Logout (client should remove token, but we can track server-side if needed)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Add UUID validation helper function
const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuid && uuid !== 'no-student-id' && uuidRegex.test(uuid);
};

// Add validation before database queries that use student_id
router.use((req, res, next) => {
  if (req.params.studentId && !isValidUUID(req.params.studentId)) {
    return res.status(400).json({ error: 'Invalid student ID format' });
  }
  next();
});

export default router;