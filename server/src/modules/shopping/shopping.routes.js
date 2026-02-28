const express = require('express');
const router = express.Router();
const {
    createShoppingList,
    getShoppingLists,
    getShoppingList,
    updateIngredientStatus,
    generatePDF
} = require('./shopping.controller');

// Middleware to protect routes (add your auth middleware here)
const { protect } = require('../../middlewares/auth.middleware');

// Create new shopping list
router.post('/', protect, createShoppingList);

// Get all shopping lists for user
router.get('/', protect, getShoppingLists);

// Get single shopping list
router.get('/:id', protect, getShoppingList);

// Update ingredient purchased status
router.patch('/:id/ingredient', protect, updateIngredientStatus);

// Generate PDF download
router.get('/:id/pdf', protect, generatePDF);

module.exports = router;
