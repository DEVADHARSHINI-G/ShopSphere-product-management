module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'backend/**/*.js',
    '!backend/server.js',
    '!backend/config/seed.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'lcov'],
  setupFilesAfterSetup: [],
  testTimeout: 10000
};
