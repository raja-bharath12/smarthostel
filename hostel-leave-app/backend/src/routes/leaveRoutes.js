const express = require('express');
const leaveController = require('../controllers/leaveController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => leaveController.list(req, res));
router.post('/', (req, res) => leaveController.apply(req, res));
router.delete('/:id', (req, res) => leaveController.cancel(req, res));
router.get('/:id/approvals', (req, res) => leaveController.approvals(req, res));

module.exports = router;
