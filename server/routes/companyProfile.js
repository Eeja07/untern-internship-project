import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, requireCompany } from '../middleware/auth.js';

const router = express.Router();

// Get company profile
router.get('/', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { id: company_id } = req.user;
    const result = await pool.query(
      `SELECT c.company_id, c.company_name, c.company_website, c.industry, c.company_size, c.about, c.address, c.logo_url, l.email AS company_email, c.company_number
       FROM companies c
       JOIN login l ON l.id = c.company_id
       WHERE c.company_id = $1`,
      [company_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }
    res.json({ success: true, profile: result.rows[0] });
  } catch (error) {
    console.error('Company profile fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch company profile' });
  }
});

// Update company profile
router.put('/', authenticateToken, requireCompany, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id: company_id } = req.user;
    const { company_name, company_website, industry, company_size, about, address, company_number } = req.body;
    await client.query(
      `UPDATE companies SET company_name = $1, company_website = $2, industry = $3, company_size = $4, about = $5, address = $6, company_number = $7 WHERE company_id = $8`,
      [company_name, company_website, industry, company_size, about, address, company_number, company_id]
    );
    const updated = await client.query(
      `SELECT c.company_id, c.company_name, c.company_website, c.industry, c.company_size, c.about, c.address, c.logo_url, l.email AS company_email, c.company_number
       FROM companies c
       JOIN login l ON l.id = c.company_id
       WHERE c.company_id = $1`,
      [company_id]
    );
    await client.query('COMMIT');
    res.json({ success: true, profile: updated.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Company profile update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update company profile' });
  } finally {
    client.release();
  }
});

export default router;