const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const authMiddleware = require('../middleware/auth');

// All cart routes require authentication
router.use(authMiddleware);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id', updateCartItem);
router.delete('/clear', clearCart);
router.delete('/:id', removeFromCart);

module.exports = router;
