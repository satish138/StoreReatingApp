const db = require('../config/db');


const createStore = (name, email, address, owner_id) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, address, owner_id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};


const getStores = (ownerId = null) => {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT 
        s.*, 
        COALESCE(AVG(r.rating), 0) AS rating,
        COUNT(r.rating) AS ratingCount
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
    `;
    const values = [];

    if (ownerId) {
      query += ' WHERE s.owner_id = ?';
      values.push(ownerId);
    }

    query += ' GROUP BY s.id ORDER BY s.name ASC';

    db.query(query, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};
module.exports = { createStore, getStores };
