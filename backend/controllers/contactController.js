const { getDb } = require('../config/db');
const { validateRequired, validateEmail } = require('../middleware/validate');
const nodemailer = require('nodemailer');

// Email transporter configuration
const createTransporter = () => {
  // Use Gmail SMTP
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'devapapa64@gmail.com',
      pass: process.env.EMAIL_PASS || ''  // Gmail App Password required
    }
  });
};

// Send email notification
async function sendEmailNotification(contactData) {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"ShopSphere Contact" <${process.env.EMAIL_USER || 'devapapa64@gmail.com'}>`,
      to: 'devapapa64@gmail.com',
      replyTo: contactData.email,
      subject: `🛍️ ShopSphere Contact: ${contactData.subject}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,20,147,0.3);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #FF1493, #FF69B4); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🛍️ ShopSphere</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">New Contact Message Received</p>
          </div>
          
          <!-- Body -->
          <div style="padding: 30px;">
            <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.1);">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #FF69B4; font-weight: 600; width: 100px;">From:</td>
                  <td style="padding: 10px 0; color: #ffffff;">${contactData.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #FF69B4; font-weight: 600;">Email:</td>
                  <td style="padding: 10px 0; color: #ffffff;"><a href="mailto:${contactData.email}" style="color: #FF1493;">${contactData.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #FF69B4; font-weight: 600;">Subject:</td>
                  <td style="padding: 10px 0; color: #ffffff;">${contactData.subject}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; border: 1px solid rgba(255,255,255,0.1);">
              <h3 style="color: #FF69B4; margin: 0 0 12px; font-size: 16px;">💬 Message</h3>
              <p style="color: rgba(255,255,255,0.85); line-height: 1.6; margin: 0; white-space: pre-wrap;">${contactData.message}</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="padding: 20px 30px; background: rgba(255,255,255,0.02); text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
            <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0;">
              Sent from ShopSphere Contact Form • ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('📧 Contact email sent successfully to devapapa64@gmail.com');
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
