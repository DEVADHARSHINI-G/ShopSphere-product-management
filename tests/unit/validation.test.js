const path = require('path');

// Mock the errorHandler to get AppError
const { AppError } = require(path.join(__dirname, '..', '..', 'backend', 'middleware', 'errorHandler'));
const {
  validateRequired,
  validateEmail,
  validatePassword,
  validatePositiveNumber,
  validateInteger
} = require(path.join(__dirname, '..', '..', 'backend', 'middleware', 'validate'));

describe('Validation Helpers', () => {
  describe('validateRequired', () => {
    test('should pass when all required fields are present', () => {
      expect(() => {
        validateRequired(['name', 'email'], { name: 'John', email: 'john@test.com' });
      }).not.toThrow();
    });

    test('should throw when required fields are missing', () => {
      expect(() => {
        validateRequired(['name', 'email'], { name: 'John' });
      }).toThrow('Missing required fields: email');
    });

    test('should throw when fields are empty strings', () => {
      expect(() => {
        validateRequired(['name'], { name: '   ' });
      }).toThrow('Missing required fields: name');
    });

    test('should throw when fields are undefined', () => {
      expect(() => {
        validateRequired(['name', 'email', 'password'], {});
      }).toThrow('Missing required fields: name, email, password');
    });
  });

  describe('validateEmail', () => {
    test('should accept valid emails', () => {
      const validEmails = [
        'test@example.com',
        'user@domain.org',
        'name.last@company.co',
        'user+tag@gmail.com'
      ];

      validEmails.forEach(email => {
        expect(() => validateEmail(email)).not.toThrow();
      });
    });

    test('should reject invalid emails', () => {
      const invalidEmails = [
        'notanemail',
        '@domain.com',
        'user@',
        'user@.com',
        ''
      ];

      invalidEmails.forEach(email => {
        expect(() => validateEmail(email)).toThrow();
      });
    });
  });

  describe('validatePassword', () => {
    test('should accept passwords with 6+ characters', () => {
      expect(() => validatePassword('123456')).not.toThrow();
      expect(() => validatePassword('strongpassword')).not.toThrow();
    });

    test('should reject passwords with less than 6 characters', () => {
      expect(() => validatePassword('12345')).toThrow('at least 6 characters');
      expect(() => validatePassword('ab')).toThrow();
    });
  });

  describe('validatePositiveNumber', () => {
    test('should accept positive numbers', () => {
      expect(() => validatePositiveNumber(1, 'Price')).not.toThrow();
      expect(() => validatePositiveNumber(99.99, 'Price')).not.toThrow();
      expect(() => validatePositiveNumber(0.01, 'Price')).not.toThrow();
    });

    test('should reject zero or negative numbers', () => {
      expect(() => validatePositiveNumber(0, 'Price')).toThrow('positive number');
      expect(() => validatePositiveNumber(-5, 'Price')).toThrow('positive number');
    });

    test('should reject non-numbers', () => {
      expect(() => validatePositiveNumber('abc', 'Price')).toThrow('positive number');
    });
  });

  describe('validateInteger', () => {
    test('should accept non-negative integers', () => {
      expect(() => validateInteger(0, 'Stock')).not.toThrow();
      expect(() => validateInteger(100, 'Stock')).not.toThrow();
    });

    test('should reject negative integers', () => {
      expect(() => validateInteger(-1, 'Stock')).toThrow('non-negative integer');
    });

    test('should reject non-integers', () => {
      expect(() => validateInteger(1.5, 'Stock')).toThrow('non-negative integer');
    });
  });

  describe('AppError', () => {
    test('should create an error with message and status code', () => {
      const error = new AppError('Not found', 404);
      expect(error.message).toBe('Not found');
      expect(error.statusCode).toBe(404);
      expect(error.isOperational).toBe(true);
    });

    test('should be an instance of Error', () => {
      const error = new AppError('Test error', 500);
      expect(error instanceof Error).toBe(true);
    });
  });
});
