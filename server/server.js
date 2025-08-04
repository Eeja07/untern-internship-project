// server.js - Main entry point
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env file

// Initialize the Express app
const app = express();

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

// Add debugging middleware untuk melihat incoming requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Origin:', req.headers.origin);
    console.log('User-Agent:', req.headers['user-agent']);
    next();
});

app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Uploads directory created: ${uploadsDir}`);
}

// Make uploads directory accessible publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import database configuration
const { pool, testConnection } = require('./db');

// Test database connection on startup
testConnection().then(success => {
    if (!success) {
        console.error('Failed to connect to database. Please check your configuration.');
        process.exit(1);
    }
}).catch(err => {
    console.error('Database connection test failed:', err);
    process.exit(1);
});

// Import routes
const authRoutes = require('./authRoute');

// Mount routes
app.use('/api', authRoutes);

// Add a test endpoint untuk CORS debugging
app.get('/api/cors-test', (req, res) => {
    res.json({
        message: 'CORS is working!',
        origin: req.headers.origin,
        timestamp: new Date().toISOString(),
        headers: req.headers
    });
});

// Add a test endpoint to verify static file serving
app.get('/api/test-uploads', (req, res) => {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        const fileInfo = files.map(file => {
            const filePath = path.join(uploadsDir, file);
            try {
                const stats = fs.statSync(filePath);
                return {
                    name: file,
                    size: stats.size,
                    url: `/uploads/${file}`,
                    fullPath: filePath,
                    exists: fs.existsSync(filePath)
                };
            } catch (err) {
                return {
                    name: file,
                    error: err.message
                };
            }
        });
        
        res.json({
            uploadsDir,
            fileCount: files.length,
            files: fileInfo
        });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Allowed CLIENT_URL: ${process.env.CLIENT_URL || 'not set'}`);
});