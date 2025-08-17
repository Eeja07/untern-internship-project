import express from 'express';
import { authenticateToken, requireStudent } from './middleware/auth.js';
import { pool } from './config/database.js';
import studentProfileRoutes from './routes/studentProfile.js';
import studentSkillsRoutes from './routes/studentSkills.js';
import studentResumeRoutes from './routes/studentResume.js';
import studentApplicationsRoutes from './routes/studentApplications.js';
import studentPhoneVerificationRoutes from './routes/studentPhoneVerification.js';

const router = express.Router();

// Mount sub-routes with student prefix
router.use('/student/profile', studentProfileRoutes);
router.use('/student/skills', studentSkillsRoutes);
router.use('/student', studentResumeRoutes); // This will handle /student/resume and /student/profile-picture
router.use('/student/applications', studentApplicationsRoutes);
router.use('/student/phone', studentPhoneVerificationRoutes);

// Get student's applications
router.get('/student/applications', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { id: userId, student_id } = req.user;
    const profileId = student_id || userId;

    console.log('Fetching applications for student ID:', profileId);

    const result = await pool.query(`
      SELECT 
        a.application_id,
        a.internship_id,
        CASE 
            WHEN a.status = 'shortlisted' THEN 'pending'
            ELSE a.status
        END as status,
        a.applied_date,
        i.title as internship_title,
        i.description as internship_description,
        i.location,
        i.type,
        i.duration_months,
        i.salary_min,
        i.salary_max,
        i.application_deadline,
        c.company_name,
        c.industry,
        c.logo_url
      FROM applications a
      JOIN internships i ON a.internship_id = i.internship_id
      JOIN companies c ON i.company_id = c.company_id
      WHERE a.student_profile_id = $1
      ORDER BY a.applied_date DESC
    `, [profileId]);

    console.log('Found applications:', result.rows.length);

    res.json({
      success: true,
      applications: result.rows
    });

  } catch (error) {
    console.error('Student applications fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
});

export default router;