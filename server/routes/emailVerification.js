import express from 'express';
import nodemailer from 'nodemailer';
import { pool } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

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

// Generate verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
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

export default router;