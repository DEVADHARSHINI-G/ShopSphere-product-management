const { AppError } = require('./errorHandler');

function validateRequired(fields, body) {
  const missing = [];
  for (const field of fields) {
    if (!body[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
      missing.push(field);
    }
  }
  if (missing.length > 0) {
    throw new AppError(`Missing required fields: ${missing.join(', ')}`, 400);
  }
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Please provide a valid email address.', 400);
  }
}

function validatePassword(password) {
  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters long.', 400);
  }
}

function validatePositiveNumber(value, fieldName) {
  if (typeof value !== 'number' || value <= 0) {
    throw new AppError(`${fieldName} must be a positive number.`, 400);
  }
}

function validateInteger(value, fieldName) {
  if (!Number.isInteger(value) || value < 0) {
    throw new AppError(`${fieldName} must be a non-negative integer.`, 400);
  }
}

module.exports = {
  validateRequired,
  validateEmail,
  validatePassword,
  validatePositiveNumber,
  validateInteger
};
