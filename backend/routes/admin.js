const express = require('express');
const router = express.Router();
const { getStats, getUsers, deleteUser } = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.use(authMiddleware, adminMiddleware);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
