const { getDb } = require('../config/db');
const { validateRequired, validateInteger } = require('../middleware/validate');

// GET /api/cart
function getCart(req, res, next) {
  try {
    const db = getDb();
    const items = db.prepare(`
      SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image, p.stock
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `).all(req.user.id);

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      success: true,
      data: {
        items,
        total: Math.round(total * 100) / 100,
        itemCount: items.length
      }
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/cart
function addToCart(req, res, next) {
  try {
    const { product_id, quantity = 1 } = req.body;

    validateRequired(['product_id'], req.body);

    const db = getDb();

    // Check if product exists
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available.'
      });
    }

    // Check if already in cart
    const existing = db.prepare(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?'
    ).get(req.user.id, product_id);

    if (existing) {
      db.prepare(
        'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?'
      ).run(quantity, req.user.id, product_id);
    } else {
      db.prepare(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)'
      ).run(req.user.id, product_id, quantity);
    }

    res.status(201).json({
      success: true,
      message: 'Product added to cart!'
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/cart/:id
function updateCartItem(req, res, next) {
  try {
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1.'
      });
    }

    const db = getDb();
    const item = db.prepare(
      'SELECT * FROM cart WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.user.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found.'
      });
    }

    db.prepare('UPDATE cart SET quantity = ? WHERE id = ?').run(quantity, req.params.id);

    res.json({
      success: true,
      message: 'Cart updated successfully!'
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/cart/:id
function removeFromCart(req, res, next) {
  try {
    const db = getDb();
    const item = db.prepare(
      'SELECT * FROM cart WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.user.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found.'
      });
    }

    db.prepare('DELETE FROM cart WHERE id = ?').run(req.params.id);

    res.json({
      success: true,
      message: 'Item removed from cart!'
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/cart
function clearCart(req, res, next) {
  try {
    const db = getDb();
    db.prepare('DELETE FROM cart WHERE user_id = ?').run(req.user.id);

    res.json({
      success: true,
      message: 'Cart cleared!'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
