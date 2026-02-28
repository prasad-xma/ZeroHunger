const express = require('express');
const router = express.Router();
const controller = require('./progress.controller');
const { authenticateUser, authorize, extractUserIdFromParams } = require('./auth.middleware');

// All routes require authentication
router.use(authenticateUser);

// CREATE
router.post('/', controller.saveProgress);

// READ
router.get('/prediction/:userId/:goal', extractUserIdFromParams, controller.getPrediction);
router.get('/history/:userId', extractUserIdFromParams, controller.getProgressHistory);

// DELETE
router.delete('/:id', controller.deleteProgress);
router.delete('/user/:userId/all', extractUserIdFromParams, controller.deleteAllUserProgress);

// Admin-only routes
router.delete('/admin/all', authorize('admin'), controller.deleteAllUserProgress);

module.exports = router;