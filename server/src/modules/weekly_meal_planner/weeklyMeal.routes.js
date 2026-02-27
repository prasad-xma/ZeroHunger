const express = require('express');
const router = express.Router();

const controller = require('./weeklyMeal.controller');

// Create weekly plan
router.post('/', controller.createWeeklyPlan);

// Get plans by userId
router.get('/:userId', controller.getUserWeeklyPlan);

// Update plan
router.put('/:id', controller.updateWeeklyPlan);

// Delete plan
router.delete('/:id', controller.deleteWeeklyPlan);

module.exports = router;