const mongoose = require('mongoose');

// Each day structure
const dayMealSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true
    },
    breakfast: {
        type: String,
        default: ''
    },
    lunch: {
        type: String,
        default: ''
    },
    dinner: {
        type: String,
        default: ''
    }
});

// Weekly plan schema
const weeklyMealSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    weekStartDate: {
        type: Date,
        required: true
    },
    meals: [dayMealSchema]
}, { timestamps: true });

module.exports = mongoose.model('WeeklyMeal', weeklyMealSchema);