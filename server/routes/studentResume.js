import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, requireStudent } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure upload directories exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/resumes/';
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  }
});

// Upload resume 
router.post('/resume', authenticateToken, requireStudent, upload.single('cv'), async (req, res) => {
  try {
    const { id, student_id } = req.user;
    const profileId = student_id || id;

    console.log('Resume upload - User:', { id, student_id, profileId });
    console.log('Resume upload - File:', req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded'
      });
    }

    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID not found in token'
      });
    }

    const resume_url = `/uploads/resumes/${req.file.filename}`;

    // Update student profile with resume URL
    const result = await pool.query(
      'UPDATE students SET resume_url = $1 WHERE student_id = $2',
      [resume_url, profileId]
    );

    console.log('Resume upload - Update result:', result.rowCount);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      resume_url
    });

  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload resume',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Remove resume
router.delete('/resume', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { id, student_id } = req.user;
    const profileId = student_id || id;

    console.log('Resume removal - User:', { id, student_id, profileId });

    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID not found in token'
      });
    }

    // Get current resume URL to delete the file
    const currentResult = await pool.query(
      'SELECT resume_url FROM students WHERE student_id = $1',
      [profileId]
    );

    if (currentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const currentResumeUrl = currentResult.rows[0].resume_url;

    // Update student profile to remove resume URL
    const result = await pool.query(
      'UPDATE students SET resume_url = NULL WHERE student_id = $1',
      [profileId]
    );

    console.log('Resume removal - Update result:', result.rowCount);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Delete the physical file if it exists
    if (currentResumeUrl) {
      const filePath = path.join(path.resolve(), currentResumeUrl.replace(/^\//, ''));
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log('Resume file deleted:', filePath);
        }
      } catch (fileError) {
        console.error('Error deleting resume file:', fileError);
        // Continue anyway - database is updated
      }
    }

    res.json({
      success: true,
      message: 'Resume removed successfully'
    });

  } catch (error) {
    console.error('Resume removal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove resume',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Configure multer for profile picture uploads
const profilePictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/profile-pictures/';
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const profilePictureUpload = multer({
  storage: profilePictureStorage,
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

// Upload profile picture
router.post('/profile-picture', authenticateToken, requireStudent, profilePictureUpload.single('profilePicture'), async (req, res) => {
  try {
    const { id, student_id } = req.user;
    const profileId = student_id || id;

    console.log('Profile picture upload - User:', { id, student_id, profileId });
    console.log('Profile picture upload - File:', req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No profile picture uploaded'
      });
    }

    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID not found in token'
      });
    }

    const profile_picture_url = `/uploads/profile-pictures/${req.file.filename}`;

    // Update student profile with profile picture URL
    const result = await pool.query(
      'UPDATE students SET profile_picture_url = $1 WHERE student_id = $2',
      [profile_picture_url, profileId]
    );

    console.log('Profile picture upload - Update result:', result.rowCount);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      profile_picture_url
    });

  } catch (error) {
    console.error('Profile picture upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile picture',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Remove profile picture
router.delete('/profile-picture', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { id, student_id } = req.user;
    const profileId = student_id || id;

    console.log('Profile picture removal - User:', { id, student_id, profileId });

    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID not found in token'
      });
    }

    // Get current profile picture URL to delete the file
    const currentResult = await pool.query(
      'SELECT profile_picture_url FROM students WHERE student_id = $1',
      [profileId]
    );

    if (currentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const currentProfilePictureUrl = currentResult.rows[0].profile_picture_url;

    // Update student profile to remove profile picture URL
    const result = await pool.query(
      'UPDATE students SET profile_picture_url = NULL WHERE student_id = $1',
      [profileId]
    );

    console.log('Profile picture removal - Update result:', result.rowCount);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Delete the physical file if it exists
    if (currentProfilePictureUrl) {
      const filePath = path.join(path.resolve(), currentProfilePictureUrl.replace(/^\//, ''));
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log('Profile picture file deleted:', filePath);
        }
      } catch (fileError) {
        console.error('Error deleting profile picture file:', fileError);
        // Continue anyway - database is updated
      }
    }

    res.json({
      success: true,
      message: 'Profile picture removed successfully'
    });

  } catch (error) {
    console.error('Profile picture removal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove profile picture',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;