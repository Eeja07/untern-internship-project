import express from 'express';
import emailVerificationRoutes from './routes/emailVerification.js';
import authRoutes from './routes/auth.js';

const router = express.Router();

// Mount email verification routes
router.use('/', emailVerificationRoutes);

// Mount authentication routes
router.use('/', authRoutes);

export default router;