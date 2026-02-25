const express = require('express');
const { protect } = require('../../middlewares/auth.middleware');
const {
    createHealthProfile,
    getUserHealthProfiles,
    getHealthProfileById,
    updateHealthProfile,
    updateRecommendations,
    deleteHealthProfile
} = require('./healthRecommendation.controller');

const router = express.Router();

// All routes are protected - user must be logged in
router.use(protect);

// Create new health profile
router.post('/', createHealthProfile);

// Get all user's active health profiles
router.get('/', getUserHealthProfiles);

// Get single health profile by ID
router.get('/:profileId', getHealthProfileById);

// Update health profile data
router.put('/:profileId', updateHealthProfile);

// Update health recommendations
router.put('/:profileId/recommendations', updateRecommendations);

// Soft delete health profile (deactivate)
router.delete('/:profileId', deleteHealthProfile);

module.exports = router;
