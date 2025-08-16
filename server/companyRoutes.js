import express from 'express';
import { authenticateToken, requireCompany } from './middleware/auth.js';
import { pool } from './config/database.js';
import companyProfileRoutes from './routes/companyProfile.js';
import companyInternshipsRoutes from './routes/companyInternships.js';
import companyApplicationsRoutes from './routes/companyApplications.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Mount sub-routes with company prefix
router.use('/company/profile', companyProfileRoutes);
router.use('/company/internships', companyInternshipsRoutes);
router.use('/company/applications', companyApplicationsRoutes);

// Configure multer for logo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/logos/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, PNG, and GIF files are allowed'));
    }
  }
});

// Upload company logo
router.post('/company/logo', authenticateToken, requireCompany, upload.single('logo'), async (req, res) => {
  try {
    const { id } = req.user;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No logo file uploaded'
      });
    }

    const logo_url = `/uploads/logos/${req.file.filename}`;

    const result = await pool.query(
      'UPDATE companies SET logo_url = $1 WHERE company_id = $2',
      [logo_url, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      logo_url
    });

  } catch (error) {
    console.error('Logo upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload logo'
    });
  }
});

export default router;