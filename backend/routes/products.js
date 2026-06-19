const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  getFeatured,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.get('/', getProducts);
router.get('/featured', getFeatured);
router.get('/:id', getProduct);
router.post('/', authMiddleware, adminMiddleware, createProduct);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
