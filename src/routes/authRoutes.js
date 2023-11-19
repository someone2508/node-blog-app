const express = require('express');
const router = express.Router();

const authController = require('../controllers/authControllers');

router.post('/api/v1/auth/register', authController.register);

router.post('/api/v1/auth/login', authController.login);

module.exports = router;