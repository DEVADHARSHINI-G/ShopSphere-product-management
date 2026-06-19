const { getDb } = require('../config/db');

// GET /api/admin/stats
function getStats(req, res, next) {
  try {
    const db = getDb();

    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    const totalCategories = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
    const totalMessages = db.prepare('SELECT COUNT(*) as count FROM contact_messages').get().count;

    const revenueResult = db.prepare(
      "SELECT COALESCE(SUM(total), 0) as revenue FROM orders WHERE status != 'cancelled'"
    ).get();

    const recentOrders = db.prepare(`
      SELECT o.*, u.name as user_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `).all().map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }));

    const topProducts = db.prepare(`
      SELECT * FROM products ORDER BY rating DESC LIMIT 5
    `).all();

    const ordersByStatus = db.prepare(`
      SELECT status, COUNT(*) as count FROM orders GROUP BY status
    `).all();

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalCategories,
          totalMessages,
          totalRevenue: Math.round(revenueResult.revenue * 100) / 100
        },
        recentOrders,
        topProducts,
        ordersByStatus
      }
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/admin/users
function getUsers(req, res, next) {
  try {
    const db = getDb();
    const users = db.prepare(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    ).all();

    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/admin/users/:id
function deleteUser(req, res, next) {
  try {
    const db = getDb();

    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account.'
      });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully!'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getStats, getUsers, deleteUser };
