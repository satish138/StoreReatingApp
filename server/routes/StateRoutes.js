const express = require('express');
const { getSystemStats } = require('../controller/statsController');
const { verifyToken } = require('../middleware/authMiddleware'); // assuming you want auth here
const router = express.Router();

router.get('/stats', verifyToken, getSystemStats);

module.exports = router;
