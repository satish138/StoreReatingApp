const db = require('../config/db');

const createUser = (name, email, password, address, role) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, email, password, address, role], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};


const getAllUsers = (filters) => {
  return new Promise((resolve, reject) => {
    let query = 'SELECT id, name, email, address, role FROM users WHERE 1=1';
    const values = [];

    if (filters.name) {
      query += ' AND name LIKE ?';
      values.push(`%${filters.name}%`);
    }
    if (filters.email) {
      query += ' AND email LIKE ?';
      values.push(`%${filters.email}%`);
    }
    if (filters.address) {
      query += ' AND address LIKE ?';
      values.push(`%${filters.address}%`);
    }
    if (filters.role) {
      query += ' AND role = ?';
      values.push(filters.role);
    }

    query += ' ORDER BY name ASC';

    db.query(query, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const updateUserRole = (userId, role) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE users SET role = ? WHERE id = ?';
    db.query(query, [role, userId], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
};



module.exports = { createUser, getUserByEmail, getAllUsers,updateUserRole };
