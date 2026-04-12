const express = require('express');
const router = express.Router();
// const { protect } = require('../../middlewares/auth.middleware');
const controller = require('./progress.controller');

// All routes require authentication
// router.use(protect);

// CREATE
router.post('/', controller.saveProgress);

// READ
router.get('/prediction/:goal', controller.getPrediction);
router.get('/history', controller.getProgressHistory);

// DELETE
router.delete('/all', controller.deleteAllUserProgress);
router.delete('/:id', controller.deleteProgress);

module.exports = router;