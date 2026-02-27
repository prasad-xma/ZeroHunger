const express = require('express');
const router = express.Router();
const { generateHealthAdvice, getHealthAdvice, getAllHealthAdvice, regenerateHealthAdvice } = require('./healthAdvice.controller');
const { protect } = require('../../middlewares/auth.middleware');

// Generate new health advice for a health profile
router.post('/generate/:healthProfileId', protect, generateHealthAdvice);

// Get health advice for a specific health profile
router.get('/:healthProfileId', protect, getHealthAdvice);

// Get all health advice for the authenticated user
router.get('/', protect, getAllHealthAdvice);

// Regenerate health advice for a health profile
router.post('/regenerate/:healthProfileId', protect, regenerateHealthAdvice);

module.exports = router;
