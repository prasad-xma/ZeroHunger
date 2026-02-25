const express = require('express');
const { protect } = require('../../middlewares/auth.middleware');
const {
    createHealthProfile,
    getUserHealthProfile,
    updateRecommendations,
    deleteHealthProfile
} = require('./healthRecommendation.controller');

const router = express.Router();

// All routes are protected - user must be logged in
router.use(protect);

// Create or update health profile questionnaire
router.post('/', createHealthProfile);

// Get user's health profile
router.get('/', getUserHealthProfile);

// Update health recommendations
router.put('/recommendations', updateRecommendations);

// Delete health profile
router.delete('/', deleteHealthProfile);

module.exports = router;
