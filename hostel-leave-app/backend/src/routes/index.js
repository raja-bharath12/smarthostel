const express = require('express');
const authRoutes = require('./authRoutes');
const leaveRoutes = require('./leaveRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
// Kept at /api/login and /api/logout too, for compatibility with the original frontend calls
router.use('/', authRoutes);
router.use('/leaves', leaveRoutes);

module.exports = router;
