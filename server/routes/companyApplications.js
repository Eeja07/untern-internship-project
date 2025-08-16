import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, requireCompany } from '../middleware/auth.js';

const router = express.Router();

// Get applications for company's internships
router.get('/', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { id } = req.user;
    const { internship_id } = req.query;

    let query = `
      SELECT a.application_id, a.status, a.applied_date,
             i.internship_id, i.title as internship_title,
             s.name as student_name, s.phone_number,
             s.university, s.major, s.graduation_date, s.bio, s.resume_url,
             (SELECT email FROM login WHERE id = s.student_id) as student_email
      FROM applications a
      JOIN internships i ON a.internship_id = i.internship_id
      JOIN companies c ON i.company_id = c.company_id
      JOIN students s ON a.student_profile_id = s.student_id
      WHERE c.company_id = $1
    `;

    const params = [id];

    if (internship_id) {
      query += ' AND i.internship_id = $2';
      params.push(internship_id);
    }

    query += ' ORDER BY a.applied_date DESC';

    const result = await pool.query(query, params);

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

// Update application status
router.put('/:applicationId', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { id } = req.user;
    const { applicationId } = req.params;
    const { status } = req.body;

    // Verify application belongs to company's internship
    const verifyResult = await pool.query(
      `SELECT a.application_id 
       FROM applications a
       JOIN internships i ON a.internship_id = i.internship_id
       JOIN companies c ON i.company_id = c.company_id
       WHERE a.application_id = $1 AND c.company_id = $2`,
      [applicationId, id]
    );

    if (verifyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found or access denied'
      });
    }

    await pool.query(
      'UPDATE applications SET status = $1 WHERE application_id = $2',
      [status, applicationId]
    );

    res.json({
      success: true,
      message: 'Application status updated successfully'
    });

  } catch (error) {
    console.error('Application status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status'
    });
  }
});

export default router;