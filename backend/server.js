const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Simple health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    message: 'Language Learning API is running perfectly!',
    database: db.getDbType()
  });
});

// Import Routes
const authRoutes = require('./routes/auth');
const languageRoutes = require('./routes/languages');
const topicRoutes = require('./routes/topics');
const noteRoutes = require('./routes/notes');
const quizRoutes = require('./routes/quizzes'); // handles /quizzes, /questions, /submit-quiz
const progressRoutes = require('./routes/progress');

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api', quizRoutes); // Mounted directly under /api to support exact paths
app.use('/api/progress', progressRoutes);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('[Express Server Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred.'
  });
});

// Start Database & Web Server
async function startServer() {
  try {
    // Initialize Database (attempts MySQL, falls back to SQLite)
    await db.initDb();

    // Bind Port
    app.listen(PORT, () => {
      console.log(`=============================================================`);
      console.log(`  SERVER RUNNING IN PRODUCTION/DEV MODE                      `);
      console.log(`  API Endpoint: http://localhost:${PORT}                      `);
      console.log(`  Database in use: ${db.getDbType().toUpperCase()}           `);
      console.log(`=============================================================`);
    });
  } catch (error) {
    console.error('[Server Start Failure]:', error.message);
    process.exit(1);
  }
}

startServer();
