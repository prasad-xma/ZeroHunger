const express = require('express');
const router = express.Router();
const controller = require('./weeklyMeal.controller');

// CREATE
router.post('/', controller.createWeeklyMeal);

// READ
router.get('/:id', controller.getWeeklyMeal);
router.get('/user/:userId', controller.getPlansByUser);
router.get('/:id/summary', controller.getSummary);

// UPDATE
router.put('/:id/add-food', controller.addFood);
router.put('/:id/update-food', controller.updateFood);
router.put('/:id/remove-food', controller.removeFood);
router.put('/:id/complete', controller.completeMeal);

// DELETE
router.delete('/:id', controller.deleteWeeklyMeal);
router.delete('/user/:userId/all', controller.deleteAllUserPlans);
router.delete('/:id/day', controller.deleteDayMeals);
router.delete('/:id/meal', controller.deleteMealType);

module.exports = router;