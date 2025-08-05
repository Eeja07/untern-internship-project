// routes/auth.js - Authentication routes
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('./db');

// JWT Secret - bisa dari environment variable atau fallback
const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';

// Middleware untuk authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
};

// Register route for creating new users
router.post('/register', async (req, res) => {
  const { email, password, user_type = 'student' } = req.body; // Default ke student

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Email and password are required' 
    });
  }

  // Validate user_type
  if (!['student', 'company'].includes(user_type)) {
    return res.status(400).json({ 
      success: false,
      message: 'User type must be either "student" or "company"' 
    });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      message: 'Please provide a valid email address' 
    });
  }

  // Password strength validation
  if (password.length < 6) {
    return res.status(400).json({ 
      success: false,
      message: 'Password must be at least 6 characters long' 
    });
  }

  try {
    // Check if user already exists
    const checkUser = await pool.query('SELECT * FROM login WHERE email = $1', [email.toLowerCase()]);

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a unique user_id
    const userId = uuidv4();

    // Insert ke login table dengan user_type
    const result = await pool.query(
      'INSERT INTO login (user_id, email, password, user_type) VALUES ($1, $2, $3, $4) RETURNING id, user_id, email, user_type, created_at',
      [userId, email.toLowerCase(), hashedPassword, user_type]
    );
    
    const user = result.rows[0];

    // Generate JWT token dengan user_type
    const token = jwt.sign(
      { 
        id: user.id, 
        userId: user.user_id, 
        email: user.email,
        userType: user.user_type 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`${user_type} successfully registered: ${user.email} with ID: ${user.user_id}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: { 
        id: user.id,
        userId: user.user_id,
        email: user.email,
        userType: user.user_type,
        createdAt: user.created_at
      },
    });
    
  } catch (err) {
    // ...existing error handling...
  }
});

// Login route for authenticating users
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Email and password are required' 
    });
  }

  try {
    const query = 'SELECT * FROM login WHERE email = $1';
    const result = await pool.query(query, [email.toLowerCase()]);

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    const user = result.rows[0];

    // Compare the password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Generate a JWT token dengan user_type
    const token = jwt.sign(
      { 
        id: user.id, 
        userId: user.user_id, 
        email: user.email,
        userType: user.user_type || 'student' // fallback untuk data lama
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Optional: Update last login time
    try {
      await pool.query('UPDATE login SET updated_at = NOW() WHERE id = $1', [user.id]);
    } catch (updateErr) {
      console.warn('Failed to update last login time:', updateErr.message);
    }

    console.log(`${user.user_type || 'student'} successfully logged in: ${user.email}`);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { 
        id: user.id,
        userId: user.user_id,
        email: user.email,
        userType: user.user_type || 'student'
      },
    });
    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// Protected route to get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user basic info from login table
    const userQuery = 'SELECT id, user_id, email, created_at FROM login WHERE id = $1';
    const userResult = await pool.query(userQuery, [userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const user = userResult.rows[0];
    
    // Get additional user data from users table if exists
    const usersQuery = 'SELECT * FROM users WHERE user_id = $1';
    const usersResult = await pool.query(usersQuery, [user.user_id]);
    
    // Get user profile if exists (assuming there's a user_profiles table)
    let profile = null;
    try {
      const profileQuery = 'SELECT * FROM user_profiles WHERE user_id = $1';
      const profileResult = await pool.query(profileQuery, [user.user_id]);
      profile = profileResult.rows[0] || null;
    } catch (profileErr) {
      // Table might not exist, ignore error
      console.warn('user_profiles table might not exist:', profileErr.message);
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        userId: user.user_id,
        email: user.email,
        createdAt: user.created_at,
        userData: usersResult.rows[0] || null,
        profile: profile
      }
    });
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Route to verify token validity
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    user: {
      id: req.user.id,
      userId: req.user.userId,
      email: req.user.email
    }
  });
});

// Route to refresh token
router.post('/refresh', authenticateToken, (req, res) => {
  try {
    // Generate new token with same payload
    const newToken = jwt.sign(
      { 
        id: req.user.id, 
        userId: req.user.userId,
        email: req.user.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      token: newToken
    });
    
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout route (optional - untuk clear token di client side)
router.post('/logout', authenticateToken, (req, res) => {
  // Dalam implementasi sederhana, logout hanya menghapus token di client
  // Untuk implementasi advanced, bisa tambahkan token blacklist
  
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Export router dan authenticateToken untuk digunakan di file lain
module.exports = router;
module.exports.authenticateToken = authenticateToken;