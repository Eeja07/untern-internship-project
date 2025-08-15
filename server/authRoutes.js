import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { pool } from './db.js';

dotenv.config();

const router = express.Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Test database connection using the imported pool
const testDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    client.release();
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.log('❌ Database connection error:', err.message);
  }
};

testDatabaseConnection();

// Email configuration for Gmail
let transporter;
try {
  // Check if email credentials are provided
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️ Email credentials not provided. Email sending will be disabled.');
    transporter = null;
  } else {
    console.log('🔧 Configuring email with:', process.env.EMAIL_USER);
    
    // Try multiple configurations
    const configs = [
      {
        name: 'Gmail SMTP',
        config: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          },
          tls: {
            rejectUnauthorized: false
          }
        }
      },
      {
        name: 'Gmail SMTP Secure',
        config: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        }
      }
    ];
    
    let configWorking = false;
    
    for (const { name, config } of configs) {
      try {
        console.log(`🔍 Testing ${name}...`);
        transporter = nodemailer.createTransport(config);
        
        // Test the connection
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Connection timeout'));
          }, 5000);
          
          transporter.verify((error, success) => {
            clearTimeout(timeout);
            if (error) {
              reject(error);
            } else {
              resolve(success);
            }
          });
        });
        
        console.log(`✅ ${name} working! Email server is ready.`);
        configWorking = true;
        break;
        
      } catch (error) {
        console.log(`❌ ${name} failed:`, error.message);
        transporter = null;
      }
    }
    
    if (!configWorking) {
      console.log('❌ All email configurations failed. Email will be disabled.');
      console.log('📧 Verification codes will be shown in console for development.');
      transporter = null;
    }
    
    console.log('✅ Email transporter setup completed');
  }
} catch (error) {
  console.error('❌ Email transporter creation failed:', error.message);
  transporter = null;
}

// Generate verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};

// Send verification email
const sendVerificationEmail = async (email, code) => {
  // Check if transporter is available
  if (!transporter) {
    console.log('⚠️ Email transporter not available. Skipping email send.');
    return false;
  }

  const mailOptions = {
    from: `"Untern Platform" <${process.env.EMAIL_USER}>`, // sender address with name
    to: email,
    subject: 'Untern - Email Verification Code',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #007bff; text-align: center;">Welcome to Untern!</h2>
        <p>Thank you for registering with Untern. Please use the verification code below to complete your registration:</p>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
        <hr style="margin: 30px 0; border: 1px solid #e1e5e9;">
        <p style="color: #666; font-size: 12px; text-align: center;">
          This is an automated email from Untern. Please do not reply to this email.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    return false;
  }
};

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

// Send verification code endpoint
router.post('/send-verification-code', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT email FROM login WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store verification code in database
    await pool.query(
      `INSERT INTO email_verifications (email, code, expires_at) 
       VALUES ($1, $2, $3)
       ON CONFLICT (email) 
       DO UPDATE SET code = $2, expires_at = $3, created_at = CURRENT_TIMESTAMP`,
      [email, verificationCode, expiresAt]
    );

    // Try to send email, but don't fail if it doesn't work
    let emailSent = false;
    try {
      emailSent = await sendVerificationEmail(email, verificationCode);
    } catch (emailError) {
      console.error('Email sending failed, but continuing:', emailError);
    }

    if (emailSent) {
      res.json({
        success: true,
        message: 'Verification code sent to your email'
      });
    } else {
      // For development/testing - log the code to console
      console.log(`🔐 VERIFICATION CODE for ${email}: ${verificationCode}`);
      res.json({
        success: true,
        message: 'Verification code generated (check server console for testing)',
        code: verificationCode // Remove this in production!
      });
    }

  } catch (error) {
    console.error('Send verification code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification code'
    });
  }
});

// Verify email code endpoint
router.post('/verify-email-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required'
      });
    }

    // Get verification record
    const result = await pool.query(
      'SELECT * FROM email_verifications WHERE email = $1 AND code = $2',
      [email, code]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    const verification = result.rows[0];

    // Check if code has expired
    if (new Date() > verification.expires_at) {
      // Delete expired code
      await pool.query('DELETE FROM email_verifications WHERE email = $1', [email]);
      
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired'
      });
    }

    // Mark email as verified
    await pool.query(
      'UPDATE email_verifications SET is_verified = true WHERE email = $1',
      [email]
    );

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed'
    });
  }
});

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

    const user_id = loginResult.rows[0].id;

    // Insert into appropriate profile table based on user type
    if (user_type === 'company') {
      await client.query(
        `INSERT INTO companies (company_id, company_name, company_website, industry, company_size, about, address)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          user_id,
          companyName || '',
          company_website || '',
          industry || '',
          company_size || '',
          about || '',
          address || ''
        ]
      );
    } else if (user_type === 'student') {
      await client.query(
        `INSERT INTO student_profiles (user_id, university, major, graduation_date, bio)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          user_id,
          university || '',
          major || '',
          graduation_date || null, // Use null instead of empty string for date
          bio || 'I am a motivated student seeking internship opportunities.'
        ]
      );
    }

    // Clean up verification record
    await client.query('DELETE FROM email_verifications WHERE email = $1', [email]);

    await client.query('COMMIT');

    // Generate JWT token
    const token = jwt.sign(
      { id: loginResult.rows[0].id, email, user_type },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: loginResult.rows[0].id,
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

    // Get user from login table only
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

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

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
        'SELECT * FROM student_profiles WHERE user_id = $1',
        [id]
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
      email: req.user.email,
      userType: req.user.user_type
    }
  });
});

// Refresh token
router.post('/refresh', authenticateToken, (req, res) => {
  try {
    const { id, email, user_type } = req.user;

    // Generate new token
    const token = jwt.sign(
      { id, email, user_type },
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
        graduation_date,
        bio,
        portfolio_url
      } = otherFields;

      await client.query(
        `UPDATE student_profiles 
         SET university = $1, major = $2, graduation_date = $3, 
             bio = $4, portfolio_url = $5
         WHERE user_id = $6`,
        [university, major, graduation_date || null, bio, portfolio_url, id]
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
    const { id, user_type } = req.user;

    if (user_type !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to students only'
      });
    }

    const result = await pool.query(
      `SELECT sp.student_profile_id, sp.university, sp.major, sp.graduation_date,
              sp.bio, sp.resume_url, sp.portfolio_url,
              l.email, l.id
       FROM student_profiles sp
       JOIN login l ON sp.user_id = l.id
       WHERE l.id = $1`,
      [id]
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
    
    const { id, user_type } = req.user;

    if (user_type !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to students only'
      });
    }

    const {
      university,
      major,
      graduation_date,
      bio,
      portfolio_url
    } = req.body;

    // Update student_profiles table only
    await client.query(
      `UPDATE student_profiles 
       SET university = $1, major = $2, graduation_date = $3, bio = $4, portfolio_url = $5
       WHERE user_id = $6`,
      [university, major, graduation_date || null, bio, portfolio_url, id]
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
    const { id, user_type } = req.user;

    if (user_type !== 'company') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to companies only'
      });
    }

    const result = await pool.query(
      `SELECT c.company_id, c.company_name, c.company_website, c.industry,
              c.company_size, c.about, c.address, c.logo_url,
              l.email, l.id
       FROM companies c
       JOIN login l ON c.company_id = l.id
       WHERE l.id = $1`,
      [id]
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
    
    const { id, user_type } = req.user;

    if (user_type !== 'company') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to companies only'
      });
    }

    const {
      company_name,
      company_website,
      industry,
      company_size,
      about,
      address
    } = req.body;

    console.log('Company profile update data:', req.body); // Debug log

    // Update companies table only
    await client.query(
      `UPDATE companies 
       SET company_name = $1, company_website = $2, industry = $3, 
           company_size = $4, about = $5, address = $6
       WHERE company_id = $7`,
      [company_name, company_website, industry, company_size, about, address, id]
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

export default router;