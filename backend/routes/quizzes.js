const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/quizzes/:topic_id
// @desc    Get all quizzes for a selected topic
// @access  Private (Requires JWT token)
router.get('/quizzes/:topic_id', authMiddleware, quizController.getQuizzesByTopic);

// @route   GET /api/questions/:quiz_id
// @desc    Get questions for a selected quiz (without correct answers to prevent cheating)
// @access  Private (Requires JWT token)
router.get('/questions/:quiz_id', authMiddleware, quizController.getQuestionsByQuiz);

// @route   POST /api/submit-quiz
// @desc    Submit quiz answers, auto-grade, update Attempts & Scores table
// @access  Private (Requires JWT token)
router.post('/submit-quiz', authMiddleware, quizController.submitQuiz);

module.exports = router;
