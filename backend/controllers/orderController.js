const { getDb } = require('../config/db');
const { validateRequired } = require('../middleware/validate');

// GET /api/orders
function getOrders(req, res, next) {
  try {
    const db = getDb();
    let orders;

    if (req.user.role === 'admin') {
      orders = db.prepare(`
        SELECT o.*, u.name as user_name, u.email as user_email
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `).all();
    } else {
      orders = db.prepare(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC'
      ).all(req.user.id);
    }

    // Parse items JSON
    orders = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }));

    res.json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/orders/:id
function getOrder(req, res, next) {
  try {
    const db = getDb();
    let order;

    if (req.user.role === 'admin') {
      order = db.prepare(`
        SELECT o.*, u.name as user_name, u.email as user_email
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.id = ?
      `).get(req.params.id);
    } else {
      order = db.prepare(
        'SELECT * FROM orders WHERE id = ? AND user_id = ?'
      ).get(req.params.id, req.user.id);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    order.items = JSON.parse(order.items);

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/orders (Checkout)
function createOrder(req, res, next) {
  try {
    const { shipping_address } = req.body;
    const db = getDb();

    // Get cart items
    const cartItems = db.prepare(`
      SELECT c.quantity, p.id as product_id, p.name, p.price, p.stock
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `).all(req.user.id);

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty.'
      });
    }

    // Validate stock
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${item.name}. Available: ${item.stock}`
        });
      }
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderItems = cartItems.map(item => ({
      product_id: item.product_id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    // Create order in a transaction
    const createOrderTransaction = db.transaction(() => {
      // Insert order
      const result = db.prepare(
        'INSERT INTO orders (user_id, items, total, status, shipping_address) VALUES (?, ?, ?, ?, ?)'
      ).run(req.user.id, JSON.stringify(orderItems), Math.round(total * 100) / 100, 'pending', shipping_address || '');

      // Update stock
      for (const item of cartItems) {
        db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(item.quantity, item.product_id);
      }

      // Clear cart
      db.prepare('DELETE FROM cart WHERE user_id = ?').run(req.user.id);

      return result.lastInsertRowid;
    });

    const orderId = createOrderTransaction();
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    order.items = JSON.parse(order.items);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/orders/:id/status (Admin)
function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const db = getDb();
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);

    res.json({
      success: true,
      message: 'Order status updated!'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getOrders, getOrder, createOrder, updateOrderStatus };
