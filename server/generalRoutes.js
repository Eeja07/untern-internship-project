import express from 'express';
import { pool } from './config/database.js';
import { authenticateToken } from './middleware/auth.js';

const router = express.Router();

// Get all internships with filters
router.get('/internships', async (req, res) => {
  try {
    const {
      location,
      type,
      industry,
      company_size,
      salary_min,
      salary_max,
      search,
      page = 1,
      limit = 10
    } = req.query;

    let query = `
      SELECT i.internship_id, i.title, i.description, i.requirements, i.location, i.type,
             i.duration_months, i.salary_min, i.salary_max, i.application_deadline,
             i.created_at, i.is_active,
             c.company_name, c.company_website, c.industry, c.company_size, c.logo_url,
             COUNT(*) OVER() as total_count
      FROM internships i
      JOIN companies c ON i.company_id = c.company_id
      WHERE i.is_active = true AND i.application_deadline > CURRENT_DATE
    `;

    const params = [];
    let paramCount = 0;

    // Apply filters
    if (location) {
      paramCount++;
      query += ` AND LOWER(i.location) LIKE LOWER($${paramCount})`;
      params.push(`%${location}%`);
    }

    if (type) {
      paramCount++;
      query += ` AND i.type = $${paramCount}`;
      params.push(type);
    }

    if (industry) {
      paramCount++;
      query += ` AND c.industry = $${paramCount}`;
      params.push(industry);
    }

    if (company_size) {
      paramCount++;
      query += ` AND c.company_size = $${paramCount}`;
      params.push(company_size);
    }

    if (salary_min) {
      paramCount++;
      query += ` AND i.salary_min >= $${paramCount}`;
      params.push(parseInt(salary_min));
    }

    if (salary_max) {
      paramCount++;
      query += ` AND i.salary_max <= $${paramCount}`;
      params.push(parseInt(salary_max));
    }

    if (search) {
      paramCount++;
      query += ` AND (LOWER(i.title) LIKE LOWER($${paramCount}) OR LOWER(i.description) LIKE LOWER($${paramCount}) OR LOWER(c.company_name) LIKE LOWER($${paramCount}))`;
      params.push(`%${search}%`);
    }

    // Add pagination
    query += ` ORDER BY i.created_at DESC`;
    
    const offset = (page - 1) * limit;
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await pool.query(query, params);

    const totalCount = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      internships: result.rows.map(row => {
        const { total_count, ...internship } = row;
        return internship;
      }),
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_count: totalCount,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Internships fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch internships'
    });
  }
});

// Get single internship by ID
router.get('/internships/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT i.*, c.company_name, c.company_website, c.industry, c.company_size, 
              c.about, c.address, c.logo_url
       FROM internships i
       JOIN companies c ON i.company_id = c.company_id
       WHERE i.internship_id = $1 AND i.is_active = true`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    res.json({
      success: true,
      internship: result.rows[0]
    });

  } catch (error) {
    console.error('Internship fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch internship'
    });
  }
});

// Apply for internship (student only)
router.post('/internships/:id/apply', authenticateToken, async (req, res) => {
  try {
    const { id: user_id, user_type, student_id } = req.user;
    const { id: internshipId } = req.params;

    if (user_type !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can apply for internships'
      });
    }

    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: 'Student ID not found in token'
      });
    }

    // Check if internship exists and is active
    const internshipResult = await pool.query(
      'SELECT internship_id FROM internships WHERE internship_id = $1 AND is_active = true AND application_deadline > CURRENT_DATE',
      [internshipId]
    );

    if (internshipResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found or no longer accepting applications'
      });
    }

    // Check if student has already applied
    const existingApplication = await pool.query(
      `SELECT application_id FROM applications 
       WHERE internship_id = $1 AND student_profile_id = $2`,
      [internshipId, student_id]
    );

    if (existingApplication.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this internship'
      });
    }

    // Create application
    const result = await pool.query(
      'INSERT INTO applications (internship_id, student_profile_id) VALUES ($1, $2) RETURNING application_id',
      [internshipId, student_id]
    );

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application_id: result.rows[0].application_id
    });

  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application'
    });
  }
});

// Get filter options for internships
router.get('/internships-filters', async (req, res) => {
  try {
    const [locationsResult, typesResult, industriesResult, companySizesResult] = await Promise.all([
      pool.query('SELECT DISTINCT location FROM internships WHERE location IS NOT NULL AND is_active = true ORDER BY location'),
      pool.query('SELECT DISTINCT type FROM internships WHERE type IS NOT NULL AND is_active = true ORDER BY type'),
      pool.query('SELECT DISTINCT industry FROM companies WHERE industry IS NOT NULL ORDER BY industry'),
      pool.query('SELECT DISTINCT company_size FROM companies WHERE company_size IS NOT NULL ORDER BY company_size')
    ]);

    res.json({
      success: true,
      filters: {
        locations: locationsResult.rows.map(row => row.location),
        types: typesResult.rows.map(row => row.type),
        industries: industriesResult.rows.map(row => row.industry),
        company_sizes: companySizesResult.rows.map(row => row.company_size)
      }
    });

  } catch (error) {
    console.error('Filters fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch filter options'
    });
  }
});

// Get all skills - Extract from students table JSONB skills field
router.get('/skills', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT jsonb_array_elements_text(skills) as skill_name 
       FROM students 
       WHERE skills IS NOT NULL 
       ORDER BY skill_name`
    );

    const skills = result.rows.map(row => row.skill_name);

    res.json({
      success: true,
      skills
    });

  } catch (error) {
    console.error('Skills fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skills'
    });
  }
});

// Search skills
router.get('/skills/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const result = await pool.query(
      `SELECT DISTINCT jsonb_array_elements_text(skills) as skill_name 
       FROM students 
       WHERE skills IS NOT NULL 
       AND jsonb_array_elements_text(skills) ILIKE $1
       ORDER BY skill_name
       LIMIT 20`,
      [`%${q}%`]
    );

    const skills = result.rows.map(row => row.skill_name);

    res.json({
      success: true,
      skills
    });

  } catch (error) {
    console.error('Skills search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search skills'
    });
  }
});

// Get company reviews
router.get('/companies/:companyId/reviews', async (req, res) => {
  try {
    const { companyId } = req.params;

    const result = await pool.query(
      `SELECT cr.review_id, cr.rating, cr.review_text, cr.created_at,
              s.name as reviewer_name
       FROM company_reviews cr
       JOIN students s ON cr.student_profile_id = s.student_id
       WHERE cr.company_id = $1
       ORDER BY cr.created_at DESC`,
      [companyId]
    );

    // Calculate average rating
    const avgResult = await pool.query(
      'SELECT AVG(rating)::numeric(3,2) as avg_rating, COUNT(*) as review_count FROM company_reviews WHERE company_id = $1',
      [companyId]
    );

    res.json({
      success: true,
      reviews: result.rows,
      average_rating: avgResult.rows[0].avg_rating || 0,
      review_count: parseInt(avgResult.rows[0].review_count)
    });

  } catch (error) {
    console.error('Company reviews fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company reviews'
    });
  }
});

// Create company review (student only)
router.post('/companies/:companyId/reviews', authenticateToken, async (req, res) => {
  try {
    const { id, user_type, student_id } = req.user;
    const { companyId } = req.params;
    const { rating, review_text } = req.body;

    if (user_type !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can submit reviews'
      });
    }

    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: 'Student ID not found in token'
      });
    }

    // Check if student has already reviewed this company
    const existingReview = await pool.query(
      'SELECT review_id FROM company_reviews WHERE company_id = $1 AND student_profile_id = $2',
      [companyId, student_id]
    );

    if (existingReview.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this company'
      });
    }

    // Create review
    const result = await pool.query(
      'INSERT INTO company_reviews (company_id, student_profile_id, rating, review_text) VALUES ($1, $2, $3, $4) RETURNING review_id',
      [companyId, student_id, rating, review_text]
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review_id: result.rows[0].review_id
    });

  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review'
    });
  }
});

export default router;