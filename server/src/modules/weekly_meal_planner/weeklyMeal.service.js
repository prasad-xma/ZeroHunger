const WeeklyMeal = require('./weeklyMeal.model');
const generateWeekDays = require('./weekGenerator.utils');

// Create weekly meal plan
exports.createWeeklyMeal = async (data) => {

    const existing = await WeeklyMeal.findOne({
        userId: data.userId,
        weekStartDate: data.weekStartDate
    });

    if (existing) {
        throw new Error("Weekly plan already exists for this date");
    }

    const weeklyMeal = new WeeklyMeal({
        userId: data.userId,
        weekStartDate: data.weekStartDate,
        goal: data.goal,
        days: generateWeekDays()
    });

    return await weeklyMeal.save();
};


// Get plan by ID
exports.getWeeklyMealById = async (id) => {
    return await WeeklyMeal.findById(id);
};


// Add food to a meal
exports.addFoodToMeal = async (planId, dayName, mealType, food) => {

    const plan = await WeeklyMeal.findById(planId);
    if (!plan) throw new Error("Plan not found");

    const day = plan.days.find(d => d.day === dayName);
    if (!day) throw new Error("Day not found");

    day.meals[mealType].foods.push(food);

    return await plan.save();
};


// Mark meal completed (checkbox)
exports.completeMeal = async (planId, dayName, mealType, status) => {

    const plan = await WeeklyMeal.findById(planId);
    if (!plan) throw new Error("Plan not found");

    const day = plan.days.find(d => d.day === dayName);
    if (!day) throw new Error("Day not found");

    day.meals[mealType].isCompleted = status;

    return await plan.save();
};


// Weekly summary (performance)
exports.getWeeklySummary = async (planId) => {

    const plan = await WeeklyMeal.findById(planId);
    if (!plan) throw new Error("Plan not found");

    let totalMeals = 0;
    let completedMeals = 0;

    plan.days.forEach(day => {
        ["breakfast", "lunch", "dinner"].forEach(meal => {
            totalMeals++;
            if (day.meals[meal].isCompleted) {
                completedMeals++;
            }
        });
    });

    const performance = ((completedMeals / totalMeals) * 100).toFixed(2);

    return {
        goal: plan.goal,
        totalMeals,
        completedMeals,
        performance
    };
};