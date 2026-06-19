const { getDb } = require('../config/db');
const { validateRequired, validatePositiveNumber } = require('../middleware/validate');

// GET /api/products
function getProducts(req, res, next) {
  try {
    const db = getDb();
    const { search, category, page = 1, limit = 12, sort } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM products p WHERE 1=1';
    const params = [];
    const countParams = [];

    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      countQuery += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm);
    }

    if (category) {
      query += ' AND p.category_id = ?';
      countQuery += ' AND p.category_id = ?';
      params.push(parseInt(category));
      countParams.push(parseInt(category));
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        query += ' ORDER BY p.price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY p.price DESC';
        break;
      case 'rating':
        query += ' ORDER BY p.rating DESC';
        break;
      case 'newest':
        query += ' ORDER BY p.created_at DESC';
        break;
      default:
        query += ' ORDER BY p.id DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const products = db.prepare(query).all(...params);
    const { total } = db.prepare(countQuery).get(...countParams);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalProducts: total,
          limit: limitNum,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/products/:id
function getProduct(req, res, next) {
  try {
    const db = getDb();
    const product = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).get(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/products/featured
function getFeatured(req, res, next) {
  try {
    const db = getDb();
    const products = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.rating DESC
      LIMIT 8
    `).all();

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/products (Admin)
function createProduct(req, res, next) {
  try {
    const { name, description, price, image, category_id, stock, rating } = req.body;

    validateRequired(['name', 'price'], req.body);
    validatePositiveNumber(price, 'Price');

    const db = getDb();
    const result = db.prepare(
      'INSERT INTO products (name, description, price, image, category_id, stock, rating) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(name, description || '', price, image || '', category_id || null, stock || 0, rating || 0);

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/products/:id (Admin)
function updateProduct(req, res, next) {
  try {
    const { name, description, price, image, category_id, stock, rating } = req.body;
    const db = getDb();

    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    db.prepare(`
      UPDATE products SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        price = COALESCE(?, price),
        image = COALESCE(?, image),
        category_id = COALESCE(?, category_id),
        stock = COALESCE(?, stock),
        rating = COALESCE(?, rating)
      WHERE id = ?
    `).run(name, description, price, image, category_id, stock, rating, req.params.id);

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);

    res.json({
      success: true,
      message: 'Product updated successfully!',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/products/:id (Admin)
function deleteProduct(req, res, next) {
  try {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully!'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getProducts, getProduct, getFeatured, createProduct, updateProduct, deleteProduct };
