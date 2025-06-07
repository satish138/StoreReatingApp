const db = require('../config/db');

const getSystemStats = (req, res) => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM users) AS usersCount,
      (SELECT COUNT(*) FROM stores) AS storesCount,
      (SELECT COUNT(*) FROM ratings) AS ratingsCount
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching system stats:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    // results[0] has the counts
    const { usersCount, storesCount, ratingsCount } = results[0];
    res.json({
      users: usersCount,
      stores: storesCount,
      ratings: ratingsCount,
    });
  });
};

module.exports = { getSystemStats };
