const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', (req, res) => authController.login(req, res));
router.post('/logout', authMiddleware, (req, res) => authController.logout(req, res));

module.exports = router;
