import express from 'express';
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

export default router;