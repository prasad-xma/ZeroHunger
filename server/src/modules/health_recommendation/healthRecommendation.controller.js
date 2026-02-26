const HealthRecommendation = require('./healthRecommendation.model');
const { calculateAllHealthMetrics } = require('./healthCalculations.utils');

// Create or update health recommendation questionnaire
const createHealthProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from authenticated request
        const { user_profile, profile_name } = req.body;

        // Calculate health metrics
        const calculatedMetrics = calculateAllHealthMetrics(user_profile);

        // Create new profile (allowing multiple profiles per user)
        const healthProfile = new HealthRecommendation({
            userId,
            user_profile,
            profile_name: profile_name || 'Default Profile',
            recommendations: {
                ...calculatedMetrics,
                meal_suggestions: [],
                exercise_recommendations: [],
                lifestyle_tips: []
            },
            status: 'generated'
        });

        await healthProfile.save();

        return res.status(201).json({
            success: true,
            message: 'Health profile created successfully',
            data: healthProfile
        });
    } catch (error) {
        console.error('createHealthProfile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get user's health profiles (all active profiles)
const getUserHealthProfiles = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from authenticated request

        const healthProfiles = await HealthRecommendation.find({ 
            userId, 
            is_active: true 
        })
        .populate('userId', 'firstName lastName email')
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: healthProfiles.length,
            data: healthProfiles
        });
    } catch (error) {
        console.error('getUserHealthProfiles error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get single health profile by ID
const getHealthProfileById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { profileId } = req.params;

        const healthProfile = await HealthRecommendation.findOne({ 
            _id: profileId, 
            userId, 
            is_active: true 
        })
        .populate('userId', 'firstName lastName email');

        if (!healthProfile) {
            return res.status(404).json({
                success: false,
                message: 'Health profile not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: healthProfile
        });
    } catch (error) {
        console.error('getHealthProfileById error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Update health recommendations (for AI/algorithm to update recommendations)
const updateRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;
        const { profileId } = req.params;
        const { recommendations } = req.body;

        const healthProfile = await HealthRecommendation.findOneAndUpdate(
            { _id: profileId, userId, is_active: true },
            { 
                recommendations,
                status: 'generated'
            },
            { new: true }
        );

        if (!healthProfile) {
            return res.status(404).json({
                success: false,
                message: 'Health profile not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Recommendations updated successfully',
            data: healthProfile
        });
    } catch (error) {
        console.error('updateRecommendations error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Soft delete health profile (change status to deactivated)
const deleteHealthProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { profileId } = req.params;

        const healthProfile = await HealthRecommendation.findOneAndUpdate(
            { _id: profileId, userId, is_active: true },
            { 
                status: 'deactivated',
                is_active: false
            },
            { new: true }
        );

        if (!healthProfile) {
            return res.status(404).json({
                success: false,
                message: 'Health profile not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Health profile deactivated successfully'
        });
    } catch (error) {
        console.error('deleteHealthProfile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Update health profile data
const updateHealthProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { profileId } = req.params;
        const { user_profile, profile_name } = req.body;

        // Calculate health metrics with updated data
        const calculatedMetrics = calculateAllHealthMetrics(user_profile);

        // Get existing profile to preserve other recommendation data
        const existingProfile = await HealthRecommendation.findOne({ 
            _id: profileId, 
            userId, 
            is_active: true 
        });

        if (!existingProfile) {
            return res.status(404).json({
                success: false,
                message: 'Health profile not found'
            });
        }

        const healthProfile = await HealthRecommendation.findOneAndUpdate(
            { _id: profileId, userId, is_active: true },
            { 
                user_profile,
                profile_name,
                recommendations: {
                    ...existingProfile.recommendations,
                    ...calculatedMetrics,
                    // Preserve existing suggestions and tips
                    meal_suggestions: existingProfile.recommendations.meal_suggestions || [],
                    exercise_recommendations: existingProfile.recommendations.exercise_recommendations || [],
                    lifestyle_tips: existingProfile.recommendations.lifestyle_tips || []
                },
                status: 'updated'
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Health profile updated successfully',
            data: healthProfile
        });
    } catch (error) {
        console.error('updateHealthProfile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Recalculate health metrics for existing profile
const recalculateHealthMetrics = async (req, res) => {
    try {
        const userId = req.user.id;
        const { profileId } = req.params;

        // Get existing profile
        const existingProfile = await HealthRecommendation.findOne({ 
            _id: profileId, 
            userId, 
            is_active: true 
        });

        if (!existingProfile) {
            return res.status(404).json({
                success: false,
                message: 'Health profile not found'
            });
        }

        // Recalculate metrics
        const calculatedMetrics = calculateAllHealthMetrics(existingProfile.user_profile);

        const healthProfile = await HealthRecommendation.findOneAndUpdate(
            { _id: profileId, userId, is_active: true },
            { 
                recommendations: {
                    ...existingProfile.recommendations,
                    ...calculatedMetrics,
                    // Preserve existing suggestions and tips
                    meal_suggestions: existingProfile.recommendations.meal_suggestions || [],
                    exercise_recommendations: existingProfile.recommendations.exercise_recommendations || [],
                    lifestyle_tips: existingProfile.recommendations.lifestyle_tips || []
                },
                status: 'generated'
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Health metrics recalculated successfully',
            data: healthProfile
        });
    } catch (error) {
        console.error('recalculateHealthMetrics error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    createHealthProfile,
    getUserHealthProfiles,
    getHealthProfileById,
    updateHealthProfile,
    updateRecommendations,
    deleteHealthProfile,
    recalculateHealthMetrics
};
