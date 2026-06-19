const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../config/db');
const { validateRequired, validateEmail, validatePassword } = require('../middleware/validate');

const JWT_SECRET = process.env.JWT_SECRET || 'shopsphere_dev_secret_key_2024_capstone_project';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

function generateToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
}

// POST /api/auth/register
function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    validateRequired(['name', 'email', 'password'], req.body);
    validateEmail(email);
    validatePassword(password);

    const db = getDb();

    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists.'
      });
    }

    // Hash password and create user
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
    ).run(name.trim(), email.toLowerCase().trim(), hashedPassword, 'user');

    const token = generateToken(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        user: {
          id: result.lastInsertRowid,
          name: name.trim(),
          email: email.toLowerCase().trim(),
          role: 'user'
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/login
function login(req, res, next) {
  try {
    const { email, password } = req.body;

    validateRequired(['email', 'password'], req.body);
    validateEmail(email);

    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/auth/me
function getMe(req, res, next) {
  try {
    res.json({
      success: true,
      data: { user: req.user }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, getMe, generateToken };
