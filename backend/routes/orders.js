const express = require('express');
const router = express.Router();
const { getOrders, getOrder, createOrder, updateOrderStatus } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.use(authMiddleware);

router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);
router.put('/:id/status', adminMiddleware, updateOrderStatus);

module.exports = router;
