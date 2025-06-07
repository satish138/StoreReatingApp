const express = require('express');
const userController = require('../controller/userController');
const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/admin/users', userController.getAllUsers);
router.put('/admin/users/:userId/role', userController.updateUserRole);

module.exports = router;
