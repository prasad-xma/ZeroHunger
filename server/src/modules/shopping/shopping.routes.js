const express = require('express');
const router = express.Router();
const {
    createShoppingList,
    getShoppingLists,
    getShoppingList,
    updateIngredientStatus,
    updateShoppingList,
    generatePDF,
    deleteShoppingList,
    updateIngredient,
    deleteIngredient
} = require('./shopping.controller');

// Middleware to protect routes (add your auth middleware here)
const { protect } = require('../../middlewares/auth.middleware');

// Create new shopping list
router.post('/', protect, createShoppingList);

// Update single ingredient
router.patch('/ingredient/:ingredientId', protect, updateIngredient);

// Delete single ingredient
router.delete('/ingredient/:ingredientId', protect, deleteIngredient);

// Get all shopping lists for user
router.get('/', protect, getShoppingLists);

// Get single shopping list
router.get('/:id', protect, getShoppingList);

// Update shopping list content
router.patch('/:id', protect, updateShoppingList);

// Update ingredient purchased status
router.patch('/:id/ingredient', protect, updateIngredientStatus);

// Generate PDF download
router.get('/:id/pdf', protect, generatePDF);

// Delete shopping list
router.delete('/:id', protect, deleteShoppingList);

module.exports = router;
