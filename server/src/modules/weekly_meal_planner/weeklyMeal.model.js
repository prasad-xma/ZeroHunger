const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: String,
    grams: Number
});

const mealSchema = new mongoose.Schema({
    foods: [foodSchema],
    isCompleted: {
        type: Boolean,
        default: false
    }
});

const daySchema = new mongoose.Schema({
    day: String,
    meals: {
        breakfast: mealSchema,
        lunch: mealSchema,
        dinner: mealSchema
    }
});

const weeklyMealSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    weekStartDate: {
        type: Date,
        required: true
    },
    goal: {
        type: String   // example: Weight Loss / Muscle Gain
    },
    days: [daySchema]
}, { timestamps: true });

module.exports = mongoose.model('WeeklyMeal', weeklyMealSchema);