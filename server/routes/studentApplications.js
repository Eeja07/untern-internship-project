import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, requireStudent } from '../middleware/auth.js';

const router = express.Router();

// Get student applications
router.get('/', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { id, student_id } = req.user;
    const profileId = student_id || id;

    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID not found in token'
      });
    }

    const result = await pool.query(
      `SELECT a.application_id, a.status, a.applied_date,
              i.internship_id, i.title, i.description, i.location, i.type,
              i.salary_min, i.salary_max, i.application_deadline,
              c.company_name, c.logo_url
       FROM applications a
       JOIN internships i ON a.internship_id = i.internship_id
       JOIN companies c ON i.company_id = c.company_id
       WHERE a.student_profile_id = $1
       ORDER BY a.applied_date DESC`,
      [profileId]
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