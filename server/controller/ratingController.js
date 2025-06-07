const ratingModel = require('../models/ratingModel');

const submitRating = async (req, res) => {
  const { user_id, store_id, rating } = req.body;

  if (!user_id || !store_id || !rating) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await new Promise((resolve, reject) => {
      ratingModel.upsertRating(user_id, store_id, rating, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (err) {
    console.error('Error submitting rating:', err);
    res.status(500).json({ message: 'Database error' });
  }
};

const getStoreRatings = async (req, res) => {
  const { storeId } = req.params;

  try {
    const ratings = await new Promise((resolve, reject) => {
      ratingModel.getRatingsByStoreId(storeId, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });

    if (!ratings || ratings.length === 0) {
      return res.status(404).json({ message: 'No ratings found for this store' });
    }

    res.json(ratings);
  } catch (err) {
    console.error('Error fetching ratings:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  submitRating,
  getStoreRatings
};
