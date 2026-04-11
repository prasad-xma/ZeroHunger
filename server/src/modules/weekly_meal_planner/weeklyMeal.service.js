const WeeklyMeal = require('./weeklyMeal.model');
const generateWeekDays = require('./weekGenerator.utils');
const { IWeeklyMealService } = require('./interfaces');

const validMeals = ["breakfast", "lunch", "dinner"];
const validDays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

/**
 * Weekly Meal Service Implementation
 * Implements IWeeklyMealService interface
 */
class WeeklyMealService extends IWeeklyMealService {
    
    async createWeeklyMeal(data) {
        const existing = await WeeklyMeal.findOne({
            weekStartDate: data.weekStartDate
        });
        if (existing) throw new Error("Weekly plan already exists for this date");

        const weeklyMeal = new WeeklyMeal({
            weekStartDate: data.weekStartDate,
            goal: data.goal,
            days: generateWeekDays()
        });

        return await weeklyMeal.save();
    }

    async getWeeklyMealById(id) {
        const plan = await WeeklyMeal.findById(id);
        if (!plan) throw new Error("Plan not found");
        return plan;
    }

    async getPlansByUserId() {
        return await WeeklyMeal.find().sort({ weekStartDate: -1 });
    }

    async addFoodToMeal(planId, dayName, mealType, food) {
        if (!validDays.includes(dayName)) throw new Error("Invalid day");
        if (!validMeals.includes(mealType)) throw new Error("Invalid meal type");

        const plan = await WeeklyMeal.findById(planId);
        if (!plan) throw new Error("Plan not found");

        const day = plan.days.find(d => d.day === dayName);
        day.meals[mealType].foods.push(food);

        return await plan.save();
    }

    async completeMeal(planId, dayName, mealType, status) {
        if (!validDays.includes(dayName)) throw new Error("Invalid day");
        if (!validMeals.includes(mealType)) throw new Error("Invalid meal type");

        const plan = await WeeklyMeal.findById(planId);
        if (!plan) throw new Error("Plan not found");

        const day = plan.days.find(d => d.day === dayName);
        day.meals[mealType].isCompleted = status;

        return await plan.save();
    }

    async getWeeklySummary(planId) {
        const plan = await WeeklyMeal.findById(planId);
        if (!plan) throw new Error("Plan not found");

        let totalMeals = 0, completedMeals = 0;
        plan.days.forEach(day => {
            validMeals.forEach(meal => {
                totalMeals++;
                if (day.meals[meal].isCompleted) completedMeals++;
            });
        });

        const performance = ((completedMeals / totalMeals) * 100).toFixed(2);

        return { goal: plan.goal, totalMeals, completedMeals, performance };
    }

    async updateFoodInMeal(planId, dayName, mealType, foodIndex, food) {
        if (!validDays.includes(dayName)) throw new Error("Invalid day");
        if (!validMeals.includes(mealType)) throw new Error("Invalid meal type");
        if (foodIndex < 0) throw new Error("Invalid food index");

        const plan = await WeeklyMeal.findById(planId);
        if (!plan) throw new Error("Plan not found");

        const day = plan.days.find(d => d.day === dayName);
        if (!day.meals[mealType].foods[foodIndex]) throw new Error("Food not found");
        day.meals[mealType].foods[foodIndex] = food;

        return await plan.save();
    }

    async removeFoodFromMeal(planId, dayName, mealType, foodIndex) {
        if (!validDays.includes(dayName)) throw new Error("Invalid day");
        if (!validMeals.includes(mealType)) throw new Error("Invalid meal type");
        if (foodIndex < 0) throw new Error("Invalid food index");

        const plan = await WeeklyMeal.findById(planId);
        if (!plan) throw new Error("Plan not found");

        const day = plan.days.find(d => d.day === dayName);
        if (!day.meals[mealType].foods[foodIndex]) throw new Error("Food not found");
        day.meals[mealType].foods.splice(foodIndex, 1);

        return await plan.save();
    }

    async deleteWeeklyMeal(planId) {
        const deletedPlan = await WeeklyMeal.findByIdAndDelete(planId);
        return deletedPlan;
    }

    async deleteAllUserPlans() {
        const result = await WeeklyMeal.deleteMany();
        return { deletedCount: result.deletedCount };
    }

    async deleteDayMeals(planId, dayName) {
        if (!validDays.includes(dayName)) throw new Error("Invalid day");

        const plan = await WeeklyMeal.findById(planId);
        if (!plan) throw new Error("Plan not found");

        const day = plan.days.find(d => d.day === dayName);
        day.meals.breakfast.foods = [];
        day.meals.lunch.foods = [];
        day.meals.dinner.foods = [];
        day.meals.breakfast.isCompleted = false;
        day.meals.lunch.isCompleted = false;
        day.meals.dinner.isCompleted = false;

        return await plan.save();
    }

    async deleteMealType(planId, dayName, mealType) {
        if (!validDays.includes(dayName)) throw new Error("Invalid day");
        if (!validMeals.includes(mealType)) throw new Error("Invalid meal type");

        const plan = await WeeklyMeal.findById(planId);
        if (!plan) throw new Error("Plan not found");

        const day = plan.days.find(d => d.day === dayName);
        day.meals[mealType].foods = [];
        day.meals[mealType].isCompleted = false;

        return await plan.save();
    }
}

// Create singleton instance
const weeklyMealService = new WeeklyMealService();

// Export methods for backward compatibility
module.exports = {
    createWeeklyMeal: weeklyMealService.createWeeklyMeal.bind(weeklyMealService),
    getWeeklyMealById: weeklyMealService.getWeeklyMealById.bind(weeklyMealService),
    getPlansByUserId: weeklyMealService.getPlansByUserId.bind(weeklyMealService),
    addFoodToMeal: weeklyMealService.addFoodToMeal.bind(weeklyMealService),
    completeMeal: weeklyMealService.completeMeal.bind(weeklyMealService),
    getWeeklySummary: weeklyMealService.getWeeklySummary.bind(weeklyMealService),
    updateFoodInMeal: weeklyMealService.updateFoodInMeal.bind(weeklyMealService),
    removeFoodFromMeal: weeklyMealService.removeFoodFromMeal.bind(weeklyMealService),
    deleteWeeklyMeal: weeklyMealService.deleteWeeklyMeal.bind(weeklyMealService),
    deleteAllUserPlans: weeklyMealService.deleteAllUserPlans.bind(weeklyMealService),
    deleteDayMeals: weeklyMealService.deleteDayMeals.bind(weeklyMealService),
    deleteMealType: weeklyMealService.deleteMealType.bind(weeklyMealService),
    WeeklyMealService
};