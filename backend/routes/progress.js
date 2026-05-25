const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/progress/:user_id
// @desc    Get user's total score, quizzes attempted, progress percentage, daily challenge status, and language-wise analysis
// @access  Private (Requires JWT token)
router.get('/:user_id', authMiddleware, progressController.getUserProgress);

// @route   POST /api/progress/daily-challenge/claim
// @desc    Claim today's daily challenge XP and persist it for the authenticated user
// @access  Private (Requires JWT token)
router.post('/daily-challenge/claim', authMiddleware, progressController.claimDailyChallenge);

module.exports = router;
