const storeModel = require('../models/storeModel');

const createStore = async (req, res) => {
  const { name, email, address } = req.body;
  const owner_id = req.user.id; 
  try {
    await storeModel.createStore(name, email, address, owner_id);
    res.status(201).json({ message: 'Store created successfully' });
  } catch (err) {
    console.error('Create Store Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStores = async (req, res) => {
  try { 
    const role = req.user?.role;
    const userId = req.user?.id;
    const ownerId = role === 'Store Owner' ? userId : null;

    const stores = await storeModel.getStores(ownerId);
    res.json(stores);
  } catch (err) {
    console.error('Get Stores Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createStore, getStores };
