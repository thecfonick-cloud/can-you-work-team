const express = require('express');
const { register, login } = require('../controllers/authController');
const fraudDetector = require('../middleware/fraudDetector');
const router = express.Router();

router.post('/register', fraudDetector, register);
router.post('/login', login);

module.exports = router;
