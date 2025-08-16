import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, requireCompany } from '../middleware/auth.js';

const router = express.Router();

// Create internship
router.post('/', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { id } = req.user;
    const {
      title,
      description,
      requirements,
      location,
      type,
      duration_months,
      salary_min,
      salary_max,
      application_deadline
    } = req.body;

    const result = await pool.query(
      `INSERT INTO internships (company_id, title, description, requirements, location, type, 
                               duration_months, salary_min, salary_max, application_deadline)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING internship_id`,
      [id, title, description, requirements, location, type, 
       duration_months, salary_min, salary_max, application_deadline]
    );

    res.status(201).json({
      success: true,
      message: 'Internship created successfully',
      internship_id: result.rows[0].internship_id
    });

  } catch (error) {
    console.error('Internship creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create internship'
    });
  }
});

// Get company's internships
router.get('/', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { id } = req.user;

    const result = await pool.query(
      `SELECT i.*, c.company_name,
              COUNT(a.application_id) as application_count
       FROM internships i
       JOIN companies c ON i.company_id = c.company_id
       LEFT JOIN applications a ON i.internship_id = a.internship_id
       WHERE c.company_id = $1
       GROUP BY i.internship_id, c.company_name
       ORDER BY i.created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      internships: result.rows
    });

  } catch (error) {
    console.error('Company internships fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch internships'
    });
  }
});

// Update internship
router.put('/:internshipId', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { id } = req.user;
    const { internshipId } = req.params;
    const {
      title,
      description,
      requirements,
      location,
      type,
      duration_months,
      salary_min,
      salary_max,
      application_deadline,
      is_active
    } = req.body;

    // Verify internship belongs to company
    const verifyResult = await pool.query(
      `SELECT i.internship_id 
       FROM internships i
       JOIN companies c ON i.company_id = c.company_id
       WHERE i.internship_id = $1 AND c.company_id = $2`,
      [internshipId, id]
    );

    if (verifyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found or access denied'
      });
    }

    const result = await pool.query(
      `UPDATE internships 
       SET title = $1, description = $2, requirements = $3, location = $4, type = $5,
           duration_months = $6, salary_min = $7, salary_max = $8, 
           application_deadline = $9, is_active = $10
       WHERE internship_id = $11`,
      [title, description, requirements, location, type, duration_months, 
       salary_min, salary_max, application_deadline, is_active, internshipId]
    );

    res.json({
      success: true,
      message: 'Internship updated successfully'
    });

  } catch (error) {
    console.error('Internship update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update internship'
    });
  }
});

// Delete internship
router.delete('/:internshipId', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { id } = req.user;
    const { internshipId } = req.params;

    // Verify internship belongs to company
    const verifyResult = await pool.query(
      `SELECT i.internship_id 
       FROM internships i
       JOIN companies c ON i.company_id = c.company_id
       WHERE i.internship_id = $1 AND c.company_id = $2`,
      [internshipId, id]
    );

    if (verifyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found or access denied'
      });
    }

    await pool.query('DELETE FROM internships WHERE internship_id = $1', [internshipId]);

    res.json({
      success: true,
      message: 'Internship deleted successfully'
    });

  } catch (error) {
    console.error('Internship deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete internship'
    });
  }
});

export default router;