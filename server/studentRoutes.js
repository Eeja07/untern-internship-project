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

    // console.log('Fetching applications for student ID:', profileId);

    const result = await pool.query(`
      SELECT 
        a.application_id,
        a.internship_id,
        a.student_profile_id,
        COALESCE(a.done_intern, false) AS done_intern,
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
        c.company_id,
        c.company_name,
        c.industry,
        c.logo_url
      FROM applications a
      JOIN internships i ON a.internship_id = i.internship_id
      JOIN companies c ON i.company_id = c.company_id
      WHERE a.student_profile_id = $1
      ORDER BY a.applied_date DESC
    `, [profileId]);

    // console.log('Found applications:', result.rows.length);

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

// Dashboard stats for student
router.get('/student/dashboard-stats', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { id: userId, student_id } = req.user;
    const profileId = student_id || userId;

    // Active internships (pending or shortlisted)
    const activeRes = await pool.query(`
      SELECT COUNT(*) FROM applications
      WHERE student_profile_id = $1 AND status IN ('accepted')
    `, [profileId]);
    const active_internships = parseInt(activeRes.rows[0].count);

    // Applications submitted
    const appsRes = await pool.query(`
      SELECT COUNT(*) FROM applications
      WHERE student_profile_id = $1
    `, [profileId]);
    const applications_submitted = parseInt(appsRes.rows[0].count);

    // Internships completed
    const completedRes = await pool.query(`
      SELECT COUNT(*) FROM applications
      WHERE student_profile_id = $1 AND done_intern = true
    `, [profileId]);
    const internships_completed = parseInt(completedRes.rows[0].count);

    // Profile views from new profile_views table
    const viewsRes = await pool.query(`
      SELECT COUNT(*) FROM profile_views WHERE viewed_id = $1 AND viewed_type = 'student'
    `, [profileId]);
    const profile_views = parseInt(viewsRes.rows[0].count);

    res.json({
      success: true,
      stats: {
        active_internships,
        applications_submitted,
        internships_completed,
        profile_views
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
});

// Recent activity for student
router.get('/student/recent-activity', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { id: userId, student_id } = req.user;
    const profileId = student_id || userId;
    // Get last 10 activities (applications, completions, certificates, interviews)
    const result = await pool.query(`
      SELECT a.status, a.applied_date, i.title as internship_title, c.company_name, a.done_intern
      FROM applications a
      JOIN internships i ON a.internship_id = i.internship_id
      JOIN companies c ON i.company_id = c.company_id
      WHERE a.student_profile_id = $1
      ORDER BY a.applied_date DESC
      LIMIT 10
    `, [profileId]);
    // Map to activity objects
    const activities = [];
    result.rows.forEach(row => {
      // Always show application submitted
      activities.push({
        action: `Application submitted for ${row.internship_title} at ${row.company_name}`,
        time: new Date(row.applied_date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        type: 'application'
      });
      // Show other events if applicable
      if (row.status === 'interview') {
        activities.push({
          action: `Interview scheduled for ${row.internship_title} at ${row.company_name}`,
          time: new Date(row.applied_date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          type: 'interview'
        });
      }
      if (row.status === 'certificate') {
        activities.push({
          action: `Received certificate for ${row.internship_title} at ${row.company_name}`,
          time: new Date(row.applied_date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          type: 'certificate'
        });
      }
      if (row.done_intern) {
        activities.push({
          action: `${row.internship_title} internship completed at ${row.company_name}`,
          time: new Date(row.applied_date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          type: 'completed'
        });
      }
    });
    res.json({ success: true, activities });
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch recent activity' });
  }
});

export default router;