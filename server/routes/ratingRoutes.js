const express = require('express');
const ratingController = require('../controller/ratingController');
const router = express.Router();

router.post('/', ratingController.submitRating);
router.get('/:storeId', ratingController.getStoreRatings);

module.exports = router;
