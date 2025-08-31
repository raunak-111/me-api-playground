const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateAuth, validateLogin } = require('../middleware/validation');

// Auth routes with rate limiting
router.post('/register', [authLimiter, validateAuth], register);
router.post('/login', [authLimiter, validateLogin], login);
router.get('/me', auth, getMe);

module.exports = router;
