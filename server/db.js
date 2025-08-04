// config/db.js - Database configuration
const { Pool } = require('pg');
require('dotenv').config();

// Configure PostgreSQL connection with proper error handling
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST ,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // Connection pool settings
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle
  connectionTimeoutMillis: 2000, // how long to wait when connecting
});

// Handle pool errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Handle pool connection
pool.on('connect', (client) => {
  console.log('New database connection established');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  pool.end(() => {
    console.log('Database pool has ended');
    process.exit(0);
  });
});

// Test connection function
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('Database connected successfully at:', result.rows[0].now);
    return true;
  } catch (err) {
    console.error('Database connection error:', err.message);
    return false;
  }
};

// Export the pool and test function
module.exports = {
  pool,
  testConnection
};