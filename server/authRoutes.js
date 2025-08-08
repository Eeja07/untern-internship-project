const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const router = express.Router();

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'untern_db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Test database connection
pool.connect()
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.log('❌ Database connection error:', err.message));

// Middleware to verify JWT token
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
      graduation_date,
      bio
    } = req.body;

    console.log('Registration request body:', req.body); // Debug log

    if (!email || !password) {
      console.log('Missing basic fields - email:', !!email, 'password:', !!password);
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Use email as default name if not provided
    const userName = name || email.split('@')[0];
    
    // For company registration, use a default company name if not provided
    let companyName = company_name;
    if (user_type === 'company' && !company_name) {
      companyName = `${userName}`; // Default company name
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

    // Generate user_id
    const userIdResult = await client.query('SELECT uuid_generate_v4() as user_id');
    const user_id = userIdResult.rows[0].user_id;

    // Insert into login table
    const loginResult = await client.query(
      `INSERT INTO login (user_id, email, password, user_type)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [user_id, email, hashedPassword, user_type]
    );

    // Insert into users table
    await client.query(
      `INSERT INTO users (user_id, name, phone_number)
       VALUES ($1, $2, $3)`,
      [user_id, userName, phone_number]
    );

    // Insert into appropriate profile table based on user type
    if (user_type === 'company') {
      console.log('Inserting company with:', {
        user_id,
        companyName,
        company_website: company_website || null,
        industry: industry || null,
        company_size: company_size || null,
        about: about || null,
        address: address || null
      });
      
      await client.query(
        `INSERT INTO companies (user_id, company_name, company_website, industry, company_size, about, address)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [user_id, companyName, company_website || null, industry || null, company_size || null, about || null, address || null]
      );
    } else if (user_type === 'student') {
      console.log('Inserting student with:', {
        user_id,
        university: university || null,
        major: major || null,
        graduation_date: graduation_date || null,
        bio: bio || null
      });
      
      await client.query(
        `INSERT INTO student_profiles (user_id, university, major, graduation_date, bio)
         VALUES ($1, $2, $3, $4, $5)`,
        [user_id, university || null, major || null, graduation_date || null, bio || null]
      );
    }

    await client.query('COMMIT');

    // Generate JWT token
    const token = jwt.sign(
      { id: loginResult.rows[0].id, user_id, email, user_type },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: loginResult.rows[0].id,
        user_id,
        email,
        name: userName, // Use the computed userName
        userType: user_type,
        phone_number
      }
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

    // Get user from login table with user details
    const result = await pool.query(
      `SELECT l.id, l.user_id, l.email, l.password, l.user_type, l.failed_attempts, l.is_locked,
              u.name, u.phone_number, u.profile_picture_url
       FROM login l
       JOIN users u ON l.user_id = u.user_id
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

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, user_id: user.user_id, email: user.email, user_type: user.user_type },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        userType: user.user_type,
        phone_number: user.phone_number,
        profile_picture_url: user.profile_picture_url
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
    const { user_id, user_type } = req.user;

    let query = `
      SELECT u.user_id, u.name, u.phone_number, u.profile_picture_url,
             l.email, l.user_type
      FROM users u
      JOIN login l ON u.user_id = l.user_id
      WHERE u.user_id = $1
    `;

    const result = await pool.query(query, [user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userProfile = result.rows[0];

    // Get additional profile data based on user type
    if (user_type === 'company') {
      const companyResult = await pool.query(
        'SELECT * FROM companies WHERE user_id = $1',
        [user_id]
      );
      if (companyResult.rows.length > 0) {
        userProfile.company = companyResult.rows[0];
      }
    } else if (user_type === 'student') {
      const studentResult = await pool.query(
        'SELECT * FROM student_profiles WHERE user_id = $1',
        [user_id]
      );
      if (studentResult.rows.length > 0) {
        userProfile.student_profile = studentResult.rows[0];
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
      user_id: req.user.user_id,
      email: req.user.email,
      userType: req.user.user_type
    }
  });
});

// Refresh token
router.post('/refresh', authenticateToken, (req, res) => {
  try {
    const { id, user_id, email, user_type } = req.user;

    // Generate new token
    const token = jwt.sign(
      { id, user_id, email, user_type },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

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
    
    const { user_id, user_type } = req.user;
    const { name, phone_number, ...otherFields } = req.body;

    // Update users table
    await client.query(
      'UPDATE users SET name = $1, phone_number = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3',
      [name, phone_number, user_id]
    );

    // Update profile-specific table
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
         WHERE user_id = $7`,
        [company_name, company_website, industry, company_size, about, address, user_id]
      );
    } else if (user_type === 'student') {
      const {
        university,
        major,
        graduation_date,
        bio,
        portfolio_url
      } = otherFields;

      await client.query(
        `UPDATE student_profiles 
         SET university = $1, major = $2, graduation_date = $3, 
             bio = $4, portfolio_url = $5
         WHERE user_id = $6`,
        [university, major, graduation_date, bio, portfolio_url, user_id]
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

// ========== STUDENT PROFILE SECTION ==========

// Get student profile
router.get('/student/profile', authenticateToken, async (req, res) => {
  try {
    const { user_id, user_type } = req.user;

    if (user_type !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to students only'
      });
    }

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
router.put('/student/profile', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { user_id, user_type } = req.user;

    if (user_type !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to students only'
      });
    }

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

// ========== COMPANY PROFILE SECTION ==========

// Get company profile
router.get('/company/profile', authenticateToken, async (req, res) => {
  try {
    const { user_id, user_type } = req.user;

    if (user_type !== 'company') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to companies only'
      });
    }

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
router.put('/company/profile', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { user_id, user_type } = req.user;

    if (user_type !== 'company') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to companies only'
      });
    }

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

    console.log('Company profile update data:', req.body); // Debug log

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

module.exports = router;