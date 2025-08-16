// server.js - Main entry point
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import multer from 'multer';
import authRoutes from './authRoutes.js';
import studentRoutes from './studentRoutes.js';
import companyRoutes from './companyRoutes.js';
import generalRoutes from './generalRoutes.js';
import { pool, testDatabaseConnection } from './config/database.js';

dotenv.config(); // Load environment variables from .env file

// Initialize the Express app
const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enhanced CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:4000',
            'http://localhost:5173',
            'http://localhost:8080',
            process.env.CLIENT_URL
        ].filter(Boolean); // Remove undefined values
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log(`CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200 // For legacy browser support
}));

// Serve static files for uploads
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// Create upload directories if they don't exist
const uploadDirs = ['uploads', 'uploads/resumes', 'uploads/logos'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Test database connection
testDatabaseConnection()

// Mount routes
app.use('/api', authRoutes);
app.use('/api', studentRoutes);
app.use('/api', companyRoutes);
app.use('/api', generalRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// CORS test endpoint
app.get('/api/cors-test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'CORS is working properly',
    origin: req.headers.origin 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large'
            });
        }
    }
    
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler for all unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Allowed CLIENT_URL: ${process.env.CLIENT_URL || 'not set'}`);
});

export default app;