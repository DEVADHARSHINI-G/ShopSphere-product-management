const { getDb } = require('../config/db');
const { validateRequired } = require('../middleware/validate');

// GET /api/categories
function getCategories(req, res, next) {
  try {
    const db = getDb();
    const categories = db.prepare(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.name ASC
    `).all();

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/categories/:id
function getCategory(req, res, next) {
  try {
    const db = getDb();
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.'
      });
    }

    const products = db.prepare('SELECT * FROM products WHERE category_id = ?').all(req.params.id);

    res.json({
      success: true,
      data: { category, products }
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/categories (Admin)
function createCategory(req, res, next) {
  try {
    const { name, description, image } = req.body;
    validateRequired(['name'], req.body);

    const db = getDb();

    const existing = db.prepare('SELECT id FROM categories WHERE name = ?').get(name);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name already exists.'
      });
    }

    const result = db.prepare(
      'INSERT INTO categories (name, description, image) VALUES (?, ?, ?)'
    ).run(name.trim(), description || '', image || '');

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Category created successfully!',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/categories/:id (Admin)
function updateCategory(req, res, next) {
  try {
    const { name, description, image } = req.body;
    const db = getDb();

    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.'
      });
    }

    db.prepare(`
      UPDATE categories SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        image = COALESCE(?, image)
      WHERE id = ?
    `).run(name, description, image, req.params.id);

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);

    res.json({
      success: true,
      message: 'Category updated successfully!',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/categories/:id (Admin)
function deleteCategory(req, res, next) {
  try {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.'
      });
    }

    db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);

    res.json({
      success: true,
      message: 'Category deleted successfully!'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
