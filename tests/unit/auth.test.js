const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'test_secret_key_for_unit_tests';

describe('Authentication Logic', () => {
  describe('Password Hashing', () => {
    test('should hash a password correctly', () => {
      const password = 'TestPassword123';
      const hash = bcrypt.hashSync(password, 10);

      expect(hash).not.toBe(password);
      expect(hash.startsWith('$2a$') || hash.startsWith('$2b$')).toBe(true);
    });

    test('should verify a correct password', () => {
      const password = 'TestPassword123';
      const hash = bcrypt.hashSync(password, 10);

      expect(bcrypt.compareSync(password, hash)).toBe(true);
    });

    test('should reject an incorrect password', () => {
      const password = 'TestPassword123';
      const hash = bcrypt.hashSync(password, 10);

      expect(bcrypt.compareSync('WrongPassword', hash)).toBe(false);
    });

    test('should generate different hashes for same password', () => {
      const password = 'TestPassword123';
      const hash1 = bcrypt.hashSync(password, 10);
      const hash2 = bcrypt.hashSync(password, 10);

      expect(hash1).not.toBe(hash2);
      // But both should verify correctly
      expect(bcrypt.compareSync(password, hash1)).toBe(true);
      expect(bcrypt.compareSync(password, hash2)).toBe(true);
    });
  });

  describe('JWT Token', () => {
    test('should generate a valid token', () => {
      const payload = { id: 1 };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    test('should verify a valid token', () => {
      const payload = { id: 42, role: 'admin' };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
      const decoded = jwt.verify(token, JWT_SECRET);

      expect(decoded.id).toBe(42);
      expect(decoded.role).toBe('admin');
    });

    test('should reject a token with wrong secret', () => {
      const token = jwt.sign({ id: 1 }, JWT_SECRET);

      expect(() => {
        jwt.verify(token, 'wrong_secret');
      }).toThrow();
    });

    test('should reject an expired token', () => {
      const token = jwt.sign({ id: 1 }, JWT_SECRET, { expiresIn: '-1s' });

      expect(() => {
        jwt.verify(token, JWT_SECRET);
      }).toThrow();
    });

    test('should include expiration in token', () => {
      const token = jwt.sign({ id: 1 }, JWT_SECRET, { expiresIn: '7d' });
      const decoded = jwt.verify(token, JWT_SECRET);

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });
  });
});
