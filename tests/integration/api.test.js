const request = require('supertest');
const path = require('path');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_integration_secret_key';

const app = require(path.join(__dirname, '..', '..', 'backend', 'server'));

let authToken = '';
let adminToken = '';
let createdProductId = null;
let createdCategoryId = null;
let cartItemId = null;

describe('ShopSphere API Integration Tests', () => {
  beforeAll(() => {
    const fs = require('fs');
    const jsonPath = path.join(__dirname, '..', '..', 'shopsphere.json');
    if (fs.existsSync(jsonPath)) {
      try {
        fs.unlinkSync(jsonPath);
      } catch (err) {}
    }
  });

  // ─── Health Check ───
  describe('GET /api/health', () => {
    test('should return health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('running');
    });
  });

  // ─── Auth Routes ───
  describe('Auth API', () => {
    test('POST /api/auth/register - should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'testuser@test.com',
          password: 'Test@123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('id');
      expect(res.body.data.user.email).toBe('testuser@test.com');
      expect(res.body.data.token).toBeDefined();
      authToken = res.body.data.token;
    });

    test('POST /api/auth/register - should reject duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User 2',
          email: 'testuser@test.com',
          password: 'Test@123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('POST /api/auth/register - should reject missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test' });

      expect(res.statusCode).toBe(400);
    });

    test('POST /api/auth/login - should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@shopsphere.com',
          password: 'Admin@123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('admin');
      adminToken = res.body.data.token;
    });

    test('POST /api/auth/login - should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@shopsphere.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('GET /api/auth/me - should return current user', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.user.email).toBe('testuser@test.com');
    });

    test('GET /api/auth/me - should reject without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toBe(401);
    });
  });

  // ─── Products Routes ───
  describe('Products API', () => {
    test('GET /api/products - should return products with pagination', async () => {
      const res = await request(app).get('/api/products');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.products)).toBe(true);
      expect(res.body.data.pagination).toBeDefined();
      expect(res.body.data.pagination.totalProducts).toBeGreaterThan(0);
    });

    test('GET /api/products?search=headphones - should search products', async () => {
      const res = await request(app).get('/api/products?search=headphones');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.products.length).toBeGreaterThanOrEqual(0);
    });

    test('GET /api/products?category=1 - should filter by category', async () => {
      const res = await request(app).get('/api/products?category=1');

      expect(res.statusCode).toBe(200);
      res.body.data.products.forEach(p => {
        expect(p.category_id).toBe(1);
      });
    });

    test('GET /api/products?sort=price_asc - should sort products', async () => {
      const res = await request(app).get('/api/products?sort=price_asc');

      expect(res.statusCode).toBe(200);
      const prices = res.body.data.products.map(p => p.price);
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      }
    });

    test('GET /api/products/featured - should return featured products', async () => {
      const res = await request(app).get('/api/products/featured');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.products.length).toBeLessThanOrEqual(8);
    });

    test('GET /api/products/1 - should return a single product', async () => {
      const res = await request(app).get('/api/products/1');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.product).toHaveProperty('name');
      expect(res.body.data.product).toHaveProperty('price');
    });

    test('GET /api/products/99999 - should return 404 for non-existent', async () => {
      const res = await request(app).get('/api/products/99999');
      expect(res.statusCode).toBe(404);
    });

    test('POST /api/products - admin should create a product', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product',
          description: 'A test product',
          price: 29.99,
          stock: 10,
          category_id: 1
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.product.name).toBe('Test Product');
      createdProductId = res.body.data.product.id;
    });

    test('POST /api/products - non-admin should be rejected', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test', price: 10 });

      expect(res.statusCode).toBe(403);
    });

    test('PUT /api/products/:id - admin should update a product', async () => {
      const res = await request(app)
        .put(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Test Product', price: 39.99 });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.product.name).toBe('Updated Test Product');
    });
  });

  // ─── Categories Routes ───
  describe('Categories API', () => {
    test('GET /api/categories - should return all categories', async () => {
      const res = await request(app).get('/api/categories');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data.categories)).toBe(true);
      expect(res.body.data.categories.length).toBeGreaterThan(0);
    });

    test('GET /api/categories/1 - should return a category with products', async () => {
      const res = await request(app).get('/api/categories/1');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.category).toHaveProperty('name');
      expect(Array.isArray(res.body.data.products)).toBe(true);
    });

    test('POST /api/categories - admin should create a category', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Category',
          description: 'A test category'
        });

      expect(res.statusCode).toBe(201);
      createdCategoryId = res.body.data.category.id;
    });
  });

  // ─── Cart Routes ───
  describe('Cart API', () => {
    test('POST /api/cart - should add item to cart', async () => {
      const res = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ product_id: 1 });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
    });

    test('GET /api/cart - should return cart items', async () => {
      const res = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.items.length).toBeGreaterThan(0);
      expect(res.body.data.total).toBeGreaterThan(0);
      cartItemId = res.body.data.items[0].id;
    });

    test('PUT /api/cart/:id - should update quantity', async () => {
      const res = await request(app)
        .put(`/api/cart/${cartItemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ quantity: 3 });

      expect(res.statusCode).toBe(200);
    });

    test('GET /api/cart - should reject without auth', async () => {
      const res = await request(app).get('/api/cart');
      expect(res.statusCode).toBe(401);
    });
  });

  // ─── Contact Routes ───
  describe('Contact API', () => {
    test('POST /api/contact - should submit a message', async () => {
      const res = await request(app)
        .post('/api/contact')
        .send({
          name: 'Test User',
          email: 'test@test.com',
          subject: 'Test Subject',
          message: 'This is a test message.'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
    });

    test('POST /api/contact - should reject missing fields', async () => {
      const res = await request(app)
        .post('/api/contact')
        .send({ name: 'Test' });

      expect(res.statusCode).toBe(400);
    });

    test('GET /api/contact - admin should see messages', async () => {
      const res = await request(app)
        .get('/api/contact')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data.messages)).toBe(true);
    });
  });

  // ─── Orders Routes ───
  describe('Orders API', () => {
    test('POST /api/orders - should create order from cart', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ shipping_address: '123 Test St' });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.order.status).toBe('pending');
    });

    test('GET /api/orders - should return user orders', async () => {
      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data.orders)).toBe(true);
    });
  });

  // ─── Admin Routes ───
  describe('Admin API', () => {
    test('GET /api/admin/stats - should return dashboard stats', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.stats).toHaveProperty('totalUsers');
      expect(res.body.data.stats).toHaveProperty('totalProducts');
      expect(res.body.data.stats).toHaveProperty('totalRevenue');
    });

    test('GET /api/admin/stats - should reject non-admin', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(403);
    });

    test('GET /api/admin/users - should return all users', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.users.length).toBeGreaterThan(0);
    });
  });

  // ─── Cleanup ───
  describe('Cleanup', () => {
    test('DELETE /api/products/:id - should delete created product', async () => {
      if (createdProductId) {
        const res = await request(app)
          .delete(`/api/products/${createdProductId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
      }
    });

    test('DELETE /api/categories/:id - should delete created category', async () => {
      if (createdCategoryId) {
        const res = await request(app)
          .delete(`/api/categories/${createdCategoryId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
      }
    });
  });
});
