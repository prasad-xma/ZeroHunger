const AiFoodAllergy = require('./aiFoodAllergy.model');
const { generateAllergyRecommendations } = require('./googleAi.service');


// Generate AI allergy recommendations
const generateAiAllergyResponse = async (req, res) => {
    try {
        const userId = req.user.id;
        const { allergies } = req.body;

        if (!allergies || !Array.isArray(allergies) || allergies.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Allergies array is required'
            });
        }

        // Check if user already has an active allergy profile
        const existingProfile = await AiFoodAllergy.findOne({ 
            userId, 
            is_active: true 
        });

        // Generate AI recommendations
        const aiResult = await generateAllergyRecommendations(allergies, req.user);

        let allergyProfile;
        if (existingProfile) {
            // Update existing profile
            existingProfile.allergies = allergies;
            existingProfile.ai_response = aiResult.ai_response;
            existingProfile.response_metadata = aiResult.metadata;
            existingProfile.is_active = true;
            
            allergyProfile = await existingProfile.save();
        } else {
            // Create new profile
            allergyProfile = new AiFoodAllergy({
                userId,
                allergies,
                ai_response: aiResult.ai_response,
                response_metadata: aiResult.metadata
            });
            
            await allergyProfile.save();
        }

        return res.status(200).json({
            success: true,
            message: 'AI allergy recommendations generated successfully',
            data: allergyProfile
        });

    } catch (error) {
        console.error('generateAiAllergyResponse error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate allergy recommendations',
            error: error.message
        });
    }
};


// Get user's allergy profile
const getUserAllergyProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const allergyProfile = await AiFoodAllergy.findOne({ 
            userId, 
            is_active: true 
        })
        .populate('userId', 'firstName lastName email')
        .sort({ createdAt: -1 });

        if (!allergyProfile) {
            return res.status(404).json({
                success: false,
                message: 'No allergy profile found'
            });
        }

        return res.status(200).json({
            success: true,
            data: allergyProfile
        });

    } catch (error) {
        console.error('getUserAllergyProfile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Update user's allergy profile
const updateAllergyProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { allergies } = req.body;

        if (!allergies || !Array.isArray(allergies) || allergies.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Allergies array is required'
            });
        }

        // Generate new AI recommendations
        const aiResult = await generateAllergyRecommendations(allergies, req.user);

        const allergyProfile = await AiFoodAllergy.findOneAndUpdate(
            { userId, is_active: true },
            { 
                allergies,
                ai_response: aiResult.ai_response,
                response_metadata: aiResult.metadata
            },
            { new: true }
        );

        if (!allergyProfile) {
            return res.status(404).json({
                success: false,
                message: 'Allergy profile not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Allergy profile updated successfully',
            data: allergyProfile
        });

    } catch (error) {
        console.error('updateAllergyProfile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update allergy profile',
            error: error.message
        });
    }
};

const deleteAllergyProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const allergyProfile = await AiFoodAllergy.findOneAndDelete(
            { userId, is_active: true }
        );

        if (!allergyProfile) {
            return res.status(404).json({
                success: false,
                message: 'Allergy profile not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Allergy profile deleted successfully'
        });

    } catch (error) {
        console.error('deleteAllergyProfile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    generateAiAllergyResponse,
    getUserAllergyProfile,
    updateAllergyProfile,
    deleteAllergyProfile
};
