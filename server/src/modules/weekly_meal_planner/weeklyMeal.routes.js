const express = require('express');
const router = express.Router();
// const { protect } = require('../../middlewares/auth.middleware');
const controller = require('./weeklyMeal.controller');

// All routes require authentication
// router.use(protect);

// CREATE
router.post('/', controller.createWeeklyMeal);

// READ
router.get('/user', controller.getPlansByUser);
router.get('/:id', controller.getWeeklyMeal);
router.get('/:id/summary', controller.getSummary);

// UPDATE
router.put('/:id/add-food', controller.addFood);
router.put('/:id/update-food', controller.updateFood);
router.put('/:id/remove-food', controller.removeFood);
router.put('/:id/complete', controller.completeMeal);

// DELETE
router.delete('/all', controller.deleteAllPlans); 
router.delete('/:id', controller.deleteWeeklyMeal);

module.exports = router;