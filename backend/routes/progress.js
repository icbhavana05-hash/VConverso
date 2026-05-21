const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/progress/:user_id
// @desc    Get user's total score, quizzes attempted, progress percentage, and language-wise analysis
// @access  Private (Requires JWT token)
router.get('/:user_id', authMiddleware, progressController.getUserProgress);

module.exports = router;
