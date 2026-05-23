const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { OAuth2Client } = require('google-auth-library');

const JWT_SECRET = process.env.JWT_SECRET || 'language_learning_jwt_secret_token_key_2026';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * Register a new user
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide all required fields (name, email, password).' 
    });
  }

  try {
    // 1. Check if user already exists
    const [existingUsers] = await db.query(
      'SELECT * FROM User WHERE email = ?',
      [email]
    );

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'A user with this email address already exists.' 
      });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user in the database
    const [result] = await db.query(
      'INSERT INTO User (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const userId = result.insertId;

    // 4. Initialize Scores table entries for this user for all active languages (DISABLED for cinematic onboarding selection flow)
    /*
    const [languages] = await db.query('SELECT language_id FROM Language');
    for (const lang of languages) {
      await db.query(
        'INSERT INTO Scores (user_id, language_id, total_score, progress_percentage) VALUES (?, ?, 0, 0.0) ON DUPLICATE KEY UPDATE total_score = total_score',
        [userId, lang.language_id]
      ).catch(async (err) => {
        // Handle database specific behaviors: SQLite uses INSERT OR IGNORE, MySQL has ON DUPLICATE KEY.
        // If ON DUPLICATE KEY fails or is ignored due to SQLite fallback, we can catch and retry with simple insert/ignore
        await db.query(
          'INSERT OR IGNORE INTO Scores (user_id, language_id, total_score, progress_percentage) VALUES (?, ?, 0, 0.0)',
          [userId, lang.language_id]
        ).catch(() => {});
      });
    }
    */

    // 5. Generate JWT token
    const token = jwt.sign(
      { user_id: userId, name, email },
      JWT_SECRET,
      { expiresIn: '7d' } // Token lasts 7 days
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      token,
      user: {
        user_id: userId,
        name,
        email
      }
    });

  } catch (err) {
    console.error('[Registration Error]:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration. Please try again.' 
    });
  }
};

/**
 * Login existing user
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide both email and password.' 
    });
  }

  try {
    // 1. Find user by email
    const [users] = await db.query(
      'SELECT * FROM User WHERE email = ?',
      [email]
    );

    if (!users || users.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials. User not found.' 
      });
    }

    const user = users[0];

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials. Password matches incorrectly.' 
      });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { user_id: user.user_id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error('[Login Error]:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login. Please try again.' 
    });
  }
};

/**
 * Google OAuth sign-in
 * POST /api/auth/google
 * Body: { idToken }
 */
exports.googleAuth = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ success: false, message: 'Missing idToken' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID || undefined });
    const payload = ticket.getPayload();

    const email = payload.email;
    const name = payload.name || '';

    // Check existing user
    const [users] = await db.query('SELECT * FROM User WHERE email = ?', [email]);

    let userId;

    if (users && users.length > 0) {
      userId = users[0].user_id;
    } else {
      // Create a new user with empty password (Google users won't use password login)
      const [result] = await db.query('INSERT INTO User (name, email, password) VALUES (?, ?, ?)', [name, email, '']);
      userId = result.insertId;
    }

    const token = jwt.sign({ user_id: userId, name, email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      token,
      user: {
        user_id: userId,
        name,
        email
      }
    });
  } catch (err) {
    console.error('[Google Auth Error]:', err.message);
    res.status(500).json({ success: false, message: 'Google authentication failed' });
  }
};
