const express = require('express');
const router = express.Router();
const controller = require('./progress.controller');

// CREATE
router.post('/', controller.saveProgress);

// READ
router.get('/prediction/:userId/:goal', controller.getPrediction);
router.get('/history/:userId', controller.getProgressHistory);

// DELETE
router.delete('/:id', controller.deleteProgress);
router.delete('/user/:userId/all', controller.deleteAllUserProgress);

module.exports = router;