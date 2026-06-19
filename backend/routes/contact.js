const express = require('express');
const router = express.Router();
const { submitContact, getMessages } = require('../controllers/contactController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.post('/', submitContact);
router.get('/', authMiddleware, adminMiddleware, getMessages);

module.exports = router;
