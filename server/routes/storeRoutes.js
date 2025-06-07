const express = require('express');
const { createStore, getStores } = require('../controller/storeController');
const roleMiddleware = require('../middleware/roleMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/store',
  verifyToken,
  roleMiddleware(['System Administrator', 'Store Owner']),
  createStore
);

router.get(
  '/stores',
  verifyToken,
  getStores
);
router.get('/',getStores)

module.exports = router;
