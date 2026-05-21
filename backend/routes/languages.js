const express = require('express');
const router = express.Router();
const langController = require('../controllers/langController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/languages
// @desc    Get all available languages
// @access  Private (Requires JWT token)
router.get('/', authMiddleware, langController.getLanguages);

// @route   POST /api/languages/enroll
// @desc    Enroll in a specific language pathway
// @access  Private (Requires JWT token)
router.post('/enroll', authMiddleware, langController.enrollLanguage);

// @route   POST /api/languages/unenroll
// @desc    Unenroll from a specific language pathway and clean up progress
// @access  Private (Requires JWT token)
router.post('/unenroll', authMiddleware, langController.unenrollLanguage);

module.exports = router;
