const { getDb } = require('../config/db');
const { validateRequired, validateEmail } = require('../middleware/validate');

// Send email notification via FormSubmit.co (FREE - no API key needed!)
async function sendEmailNotification(contactData) {
  try {
    const response = await fetch('https://formsubmit.co/ajax/devapapa64@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `🛍️ ShopSphere Contact: ${contactData.subject}`,
        name: contactData.name,
        email: contactData.email,
        subject: contactData.subject,
        message: contactData.message,
        _template: 'table'
      })
    });

    const result = await response.json();
    if (result.success) {
      console.log('📧 Contact email sent successfully to devapapa64@gmail.com');
    } else {
      console.log('📧 Email response:', JSON.stringify(result));
    }
  } catch (error) {
    console.error('📧 Email sending failed:', error.message);
    // Don't throw - email failure shouldn't block the contact form submission
  }
}

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

    // Send email notification (async, non-blocking)
    sendEmailNotification({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim()
    });

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
