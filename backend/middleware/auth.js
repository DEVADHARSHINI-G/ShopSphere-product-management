const jwt = require('jsonwebtoken');
const { getDb } = require('../config/db');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'shopsphere_dev_secret_key_2024_capstone_project');
    const db = getDb();
    const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Token may be invalid.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
}

module.exports = authMiddleware;
