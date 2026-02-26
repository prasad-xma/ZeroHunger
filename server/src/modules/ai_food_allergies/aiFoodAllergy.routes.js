const express = require('express');
const { protect } = require('../../middlewares/auth.middleware');
const {
    generateAiAllergyResponse,
    getUserAllergyProfile,
    updateAllergyProfile,
    deleteAllergyProfile
} = require('./aiFoodAllergy.controller');

const router = express.Router();

// All routes are protected - user must be logged in
router.use(protect);

// Generate AI allergy recommendations
router.post('/generate', generateAiAllergyResponse);

// Get user's allergy profile
router.get('/', getUserAllergyProfile);

// Update allergy profile (generates new AI response)
router.put('/', updateAllergyProfile);

// Soft delete allergy profile
router.delete('/', deleteAllergyProfile);

module.exports = router;
