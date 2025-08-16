import express from 'express';
import studentProfileRoutes from './routes/studentProfile.js';
import studentSkillsRoutes from './routes/studentSkills.js';
import studentResumeRoutes from './routes/studentResume.js';
import studentApplicationsRoutes from './routes/studentApplications.js';

const router = express.Router();

// Mount sub-routes with student prefix
router.use('/student/profile', studentProfileRoutes);
router.use('/student/skills', studentSkillsRoutes);
router.use('/student/resume', studentResumeRoutes);
router.use('/student/applications', studentApplicationsRoutes);

export default router;