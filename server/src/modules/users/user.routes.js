const express = require('express');
const router = express.Router();

const { protect } = require('../../middlewares/auth.middleware');
const { authorizedRole } = require('../../middlewares/role.middleware');
const { getAllUsers, getUserById, updateUser } = require('./user.controller');

// Get all users
router.get('/', protect, authorizedRole('admin'), getAllUsers);

// Get single user by ID
router.get('/:id', protect, getUserById);

// Update user
router.put('/:id', protect, updateUser);

module.exports = router;