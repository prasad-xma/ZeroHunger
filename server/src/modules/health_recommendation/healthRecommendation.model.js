const mongoose = require('mongoose');

const healthRecommendationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    user_profile: {
        age: {
            type: Number,
            required: true,
            min: 1,
            max: 120
        },
        gender: {
            type: String,
            required: true,
            enum: ['male', 'female', 'other']
        },
        height_cm: {
            type: Number,
            required: true,
            min: 50,
            max: 300
        },
        weight_kg: {
            type: Number,
            required: true,
            min: 20,
            max: 500
        },
        target_weight_kg: {
            type: Number,
            required: true,
            min: 20,
            max: 500
        },
        activity_level: {
            type: String,
            required: true,
            enum: ['sedentary', 'lightly active', 'moderately active', 'very active', 'extra active']
        },
        allergies: [{
            type: String,
            trim: true
        }],
        goal: {
            type: String,
            required: true,
            enum: ['lose', 'gain', 'maintain']
        },
        target_areas: [{
            type: String,
            trim: true
        }],
        dietary_preference: {
            type: String,
            required: true,
            enum: ['vegetarian', 'vegan', 'non-vegetarian', 'keto', 'paleo', 'mediterranean', 'gluten-free', 'dairy-free', 'other']
        },
        medical_conditions: [{
            type: String,
            trim: true
        }],
        exercise: {
            type: {
                type: String,
                required: true,
                enum: ['cardio', 'strength', 'flexibility', 'balance', 'mixed', 'none']
            },
            frequency: {
                type: Number,
                required: true,
                min: 0,
                max: 7
            },
            duration_min: {
                type: Number,
                required: true,
                min: 0,
                max: 480
            }
        },
        sleep_hours: {
            type: Number,
            required: true,
            min: 0,
            max: 24
        },
        water_intake: {
            type: Number,
            required: true,
            min: 0,
            max: 20
        },
        meal_frequency: {
            type: Number,
            required: true,
            min: 1,
            max: 10
        },
        cooking_time: {
            type: String,
            required: true,
            enum: ['< 15 min', '15-30 min', '30-60 min', '> 60 min']
        },
        cuisine_preferences: [{
            type: String,
            trim: true
        }]
    },
    recommendations: {
        bmi: {
            value: Number,
            category: String
        },
        daily_calories: Number,
        macronutrients: {
            protein: Number,
            carbs: Number,
            fat: Number
        },
        water_intake_goal: Number,
        meal_suggestions: [String],
        exercise_recommendations: [String],
        lifestyle_tips: [String]
    },
    status: {
        type: String,
        enum: ['pending', 'generated', 'updated', 'deactivated'],
        default: 'pending'
    },
    profile_name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Index for efficient queries by user
healthRecommendationSchema.index({ userId: 1 });

module.exports = mongoose.model('HealthRecommendation', healthRecommendationSchema);
