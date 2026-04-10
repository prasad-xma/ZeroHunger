const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    grams: { type: Number, required: true, min: 1 }
});

const mealSchema = new mongoose.Schema({
    foods: [foodSchema],
    isCompleted: { type: Boolean, default: false }
});

const daySchema = new mongoose.Schema({
    day: { type: String, required: true },
    meals: {
        breakfast: mealSchema,
        lunch: mealSchema,
        dinner: mealSchema
    }
});

const weeklyMealSchema = new mongoose.Schema({
    weekStartDate: { type: Date, required: true },
    goal: { type: String, default: "General" },
    days: [daySchema]
}, { timestamps: true });

module.exports = mongoose.model('WeeklyMeal', weeklyMealSchema);