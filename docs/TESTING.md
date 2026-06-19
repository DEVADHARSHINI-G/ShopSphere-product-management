# 🧪 Testing Guide

## Overview

ShopSphere uses **Jest** as the test runner and **Supertest** for HTTP endpoint testing.

## Test Structure

```
tests/
├── unit/
│   ├── auth.test.js        # Password hashing & JWT tests
│   └── validation.test.js  # Input validation helper tests
└── integration/
    └── api.test.js         # Full API endpoint tests
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run with Coverage Report
```bash
npm run test:coverage
```

### Run Verbose (detailed output)
```bash
npm run test:verbose
```

### Run Specific Test File
```bash
npx jest tests/unit/auth.test.js
```

## Test Categories

### Unit Tests

**Auth Tests (auth.test.js)**
- Password hashing with bcrypt
- Password verification (correct & incorrect)
- JWT token generation
- JWT token verification
- Token expiration handling
- Invalid token rejection

**Validation Tests (validation.test.js)**
- Required fields validation
- Email format validation
- Password length validation
- Positive number validation
- Integer validation
- AppError class behavior

### Integration Tests

**API Tests (api.test.js)**
- Health check endpoint
- User registration (success & duplicate rejection)
- User login (success & invalid credentials)
- Token authentication (with & without token)
- Product CRUD (list, search, filter, sort, create, update, delete)
- Category CRUD
- Cart operations (add, get, update quantity)
- Order creation from cart
- Contact form submission
- Admin endpoints (stats, users)
- Role-based access control
- Cleanup operations

## Expected Results

All tests should pass with output similar to:

```
PASS  tests/unit/auth.test.js
PASS  tests/unit/validation.test.js
PASS  tests/integration/api.test.js

Test Suites: 3 passed, 3 total
Tests:       35+ passed, 35+ total
```

## Coverage

Coverage reports are generated in the `coverage/` directory. Open `coverage/lcov-report/index.html` in a browser to view the interactive report.
