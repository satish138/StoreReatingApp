const db = require('../config/db');

function addRating(user_id, store_id, rating, callback) {
  const query = 'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)';
  db.query(query, [user_id, store_id, rating], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
}

function upsertRating(user_id, store_id, rating, callback) {
  const query = `
    INSERT INTO ratings (user_id, store_id, rating)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE rating = VALUES(rating)
  `;
  db.query(query, [user_id, store_id, rating], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
}

function getRatingsByStoreId(store_id, callback) {
  const query = 'SELECT * FROM ratings WHERE store_id = ?';
  db.query(query, [store_id], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
}

function getAverageRating(store_id, callback) {
  const query = 'SELECT AVG(rating) AS averageRating FROM ratings WHERE store_id = ?';
  db.query(query, [store_id], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows[0].averageRating || 0);
  });
}

module.exports = {
  addRating,
  upsertRating,
  getRatingsByStoreId,
  getAverageRating,
};
