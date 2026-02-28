const express = require('express');
const router = express.Router();
const controller = require('./weeklyMeal.controller');

// Create weekly plan
router.post('/', controller.createWeeklyMeal);

// Get plan
router.get('/:id', controller.getWeeklyMeal);

// Add food
router.put('/:id/add-food', controller.addFood);

// Mark completed
router.put('/:id/complete', controller.completeMeal);

// Weekly summary
router.get('/:id/summary', controller.getSummary);

module.exports = router;