const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');

  // Check if no header or doesn't start with Bearer
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access Denied: No token provided, authorization denied.' 
    });
  }

  try {
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const jwtSecret = process.env.JWT_SECRET || 'language_learning_jwt_secret_token_key_2026';
    const decoded = jwt.verify(token, jwtSecret);

    // Attach decoded user information to the request
    req.user = decoded;
    next();
  } catch (err) {
    console.error('[Auth Middleware] Token validation error:', err.message);
    res.status(401).json({ 
      success: false, 
      message: 'Access Denied: Invalid or expired token.' 
    });
  }
};
