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
import midtransClient from 'midtrans-client';

dotenv.config(); // Load environment variables

// Initialize the Express app
const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enhanced CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:4000',
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:3001',
      process.env.CLIENT_URL
    ].filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Serve static files for uploads with proper headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  const ext = path.extname(req.path).toLowerCase();
  if (ext === '.pdf') res.type('application/pdf');
  else if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) res.type(`image/${ext.slice(1)}`);
  else if (['.doc', '.docx'].includes(ext)) res.type('application/msword');

  next();
}, express.static(path.join(path.resolve(), 'uploads')));

// Create upload directories if they don't exist
const uploadDirs = ['uploads', 'uploads/resumes', 'uploads/logos', 'uploads/profile-pictures'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Test database connection
testDatabaseConnection();

// Mount routes
app.use('/api', authRoutes);
app.use('/api', studentRoutes);
app.use('/api', companyRoutes);
app.use('/api', generalRoutes);

// Midtrans Snap integration
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// Create Snap payment
app.post('/api/pay/midtrans', async (req, res) => {
  const { amount, orderId, name, email, phone } = req.body;
  try {
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount
      },
      customer_details: {
        first_name: name,
        email: email,
        phone: phone
      }
    };
    const transaction = await snap.createTransaction(parameter);
    res.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url
    });
  } catch (err) {
    console.error('Midtrans Error:', err.message);
    if (err.ApiResponse) {
      res.status(err.httpStatusCode || 500).json({ error: err.message, details: err.ApiResponse });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

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

  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File size too large' });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Allowed CLIENT_URL: ${process.env.CLIENT_URL || 'not set'}`);
});

export default app;
