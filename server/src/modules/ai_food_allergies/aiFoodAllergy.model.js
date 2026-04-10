const mongoose = require('mongoose');

// AI Food Allergy Schema
const aiFoodAllergySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    allergies: [{
        type: String,
        trim: true,
        required: true
    }],
    ai_response: {
        recommendations: [String],
        foods_to_avoid: [String],
        safe_alternatives: [String],
        cross_contamination_notes: [String],
        reading_labels_tips: [String],
        emergency_precautions: [String],
        personalized_advice: {
            health_management: [String],
            nutrition_tips: [String],
            lifestyle_recommendations: [String],
            dining_guidance: [String]
        }
    },
    response_metadata: {
        model_used: String,
        response_time_ms: Number,
        generated_at: {
            type: Date,
            default: Date.now
        }
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Index for efficient queries by user
aiFoodAllergySchema.index({ userId: 1 });

module.exports = mongoose.model('AiFoodAllergy', aiFoodAllergySchema);
