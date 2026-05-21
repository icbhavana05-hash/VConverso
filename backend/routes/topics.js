const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/topics/:language_id
// @desc    Get all topics for a selected language
// @access  Private (Requires JWT token)
router.get('/:language_id', authMiddleware, topicController.getTopicsByLanguage);

module.exports = router;
