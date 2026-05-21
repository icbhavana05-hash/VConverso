const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/notes/:topic_id
// @desc    Get all notes for a selected topic
// @access  Private (Requires JWT token)
router.get('/:topic_id', authMiddleware, noteController.getNotesByTopic);

module.exports = router;
