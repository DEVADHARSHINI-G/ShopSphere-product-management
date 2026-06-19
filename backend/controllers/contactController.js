const { getDb } = require('../config/db');
const { validateRequired, validateEmail } = require('../middleware/validate');

// POST /api/contact
function submitContact(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;

    validateRequired(['name', 'email', 'subject', 'message'], req.body);
    validateEmail(email);

    const db = getDb();
    const result = db.prepare(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)'
    ).run(name.trim(), email.toLowerCase().trim(), subject.trim(), message.trim());

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      data: { id: result.lastInsertRowid }
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/contact (Admin)
function getMessages(req, res, next) {
  try {
    const db = getDb();
    const messages = db.prepare(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    ).all();

    res.json({
      success: true,
      data: { messages }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { submitContact, getMessages };
