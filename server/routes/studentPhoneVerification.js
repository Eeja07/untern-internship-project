import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, requireStudent } from '../middleware/auth.js';

const router = express.Router();

// Send phone verification code
router.post('/send-verification', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { id, student_id } = req.user;
    const { phone_number } = req.body;
    const profileId = student_id || id;

    if (!phone_number) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store verification code in database (you might want to create a phone_verifications table)
    await pool.query(
      `INSERT INTO phone_verifications (student_id, phone_number, code, expires_at) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (student_id) 
       DO UPDATE SET phone_number = $2, code = $3, expires_at = $4, created_at = CURRENT_TIMESTAMP`,
      [profileId, phone_number, verificationCode, expiresAt]
    );

    // In production, you would send SMS here
    // For development, we'll just log the code
    console.log(`📱 Phone verification code for ${phone_number}: ${verificationCode}`);

    res.json({
      success: true,
      message: 'Verification code sent to your phone',
      // Remove this in production
      code: verificationCode
    });

  } catch (error) {
    console.error('Phone verification send error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification code'
    });
  }
});

// Verify phone code
router.post('/verify-code', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { id, student_id } = req.user;
    const { code } = req.body;
    const profileId = student_id || id;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Verification code is required'
      });
    }

    // Get verification record
    const result = await pool.query(
      'SELECT * FROM phone_verifications WHERE student_id = $1 AND code = $2',
      [profileId, code]
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
      await pool.query('DELETE FROM phone_verifications WHERE student_id = $1', [profileId]);
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired'
      });
    }

    // Mark phone as verified and update student profile
    await pool.query(
      'UPDATE students SET phone_verified = true, phone_number = $1 WHERE student_id = $2',
      [verification.phone_number, profileId]
    );

    // Clean up verification record
    await pool.query('DELETE FROM phone_verifications WHERE student_id = $1', [profileId]);

    res.json({
      success: true,
      message: 'Phone number verified successfully'
    });

  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Phone verification failed'
    });
  }
});

export default router;