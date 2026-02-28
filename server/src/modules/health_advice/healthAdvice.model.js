const mongoose = require('mongoose');

const healthAdviceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    healthProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'HealthRecommendation'
    },
    advice: {
        meal_management: {
            frequency: String,
            timing: [String],
            portion_control: String,
            meal_preparation: [String]
        },
        calorie_management: {
            daily_target: Number,
            meal_distribution: {
                breakfast: Number,
                lunch: Number,
                dinner: Number,
                snacks: Number
            },
            tips: [String]
        },
        nutrition_levels: {
            protein: {
                target: Number,
                sources: [String]
            },
            carbs: {
                target: Number,
                sources: [String]
            },
            fats: {
                target: Number,
                sources: [String]
            },
            vitamins: [String],
            minerals: [String]
        },
        meal_suggestions: {
            breakfast: [{
                name: String,
                ingredients: [String],
                calories: Number,
                prep_time: String
            }],
            lunch: [{
                name: String,
                ingredients: [String],
                calories: Number,
                prep_time: String
            }],
            dinner: [{
                name: String,
                ingredients: [String],
                calories: Number,
                prep_time: String
            }],
            snacks: [{
                name: String,
                ingredients: [String],
                calories: Number,
                prep_time: String
            }]
        },
        lifestyle_tips: {
            hydration: [String],
            exercise: [String],
            sleep: [String],
            stress_management: [String]
        },
        weekly_plan: [{
            day: String,
            meals: [{
                type: String,
                suggestions: [String]
            }],
            tips: [String]
        }]
    },
    generated_at: {
        type: Date,
        default: Date.now
    },
    expires_at: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Index for efficient queries
healthAdviceSchema.index({ userId: 1 });
healthAdviceSchema.index({ healthProfileId: 1 });
healthAdviceSchema.index({ expires_at: 1 });

module.exports = mongoose.model('HealthAdvice', healthAdviceSchema);
