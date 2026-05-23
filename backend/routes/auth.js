const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', authController.login);
// @route   POST /api/auth/google
// @desc    Authenticate / register user via Google ID token
// @access  Public
router.post('/google', authController.googleAuth);

module.exports = router;
