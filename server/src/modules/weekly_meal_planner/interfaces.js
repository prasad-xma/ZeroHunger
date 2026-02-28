/**
 * Interface definitions for Weekly Meal Planner
 * Defines contracts for data structures and service methods
 */

/**
 * @interface IFoodItem
 * @description Represents a single food item in a meal
 */
class IFoodItem {
    /**
     * @param {string} name - Name of the food item
     * @param {number} grams - Weight in grams
     */
    constructor(name, grams) {
        this.name = name;
        this.grams = grams;
    }
}

/**
 * @interface IMeal
 * @description Represents a meal (breakfast, lunch, or dinner)
 */
class IMeal {
    /**
     * @param {Array<IFoodItem>} foods - List of food items
     * @param {boolean} isCompleted - Whether meal is completed
     */
    constructor(foods = [], isCompleted = false) {
        this.foods = foods;
        this.isCompleted = isCompleted;
    }
}

/**
 * @interface IDayMeals
 * @description Represents all meals for a specific day
 */
class IDayMeals {
    /**
     * @param {string} day - Day of the week
     * @param {IMeal} breakfast - Breakfast meal
     * @param {IMeal} lunch - Lunch meal
     * @param {IMeal} dinner - Dinner meal
     */
    constructor(day, breakfast, lunch, dinner) {
        this.day = day;
        this.meals = {
            breakfast,
            lunch,
            dinner
        };
    }
}

/**
 * @interface IWeeklyMealPlan
 * @description Represents a complete weekly meal plan
 */
class IWeeklyMealPlan {
    /**
     * @param {string} userId - User identifier
     * @param {Date} weekStartDate - Start date of the week
     * @param {string} goal - User's goal (Weight Loss, Muscle Gain, etc.)
     * @param {Array<IDayMeals>} days - Array of daily meals
     */
    constructor(userId, weekStartDate, goal, days) {
        this.userId = userId;
        this.weekStartDate = weekStartDate;
        this.goal = goal;
        this.days = days;
    }
}

/**
 * @interface IWeeklySummary
 * @description Represents weekly performance summary
 */
class IWeeklySummary {
    /**
     * @param {string} goal - User's goal
     * @param {number} totalMeals - Total meals in week
     * @param {number} completedMeals - Completed meals count
     * @param {number} performance - Performance percentage
     */
    constructor(goal, totalMeals, completedMeals, performance) {
        this.goal = goal;
        this.totalMeals = totalMeals;
        this.completedMeals = completedMeals;
        this.performance = performance;
    }
}

/**
 * @interface IWeeklyMealService
 * @description Service interface for weekly meal operations
 */
class IWeeklyMealService {
    /**
     * Create a new weekly meal plan
     * @param {Object} data - Plan data
     * @returns {Promise<IWeeklyMealPlan>}
     */
    async createWeeklyMeal(data) {
        throw new Error('Method must be implemented');
    }

    /**
     * Get weekly meal plan by ID
     * @param {string} id - Plan ID
     * @returns {Promise<IWeeklyMealPlan>}
     */
    async getWeeklyMealById(id) {
        throw new Error('Method must be implemented');
    }

    /**
     * Get all plans for a user
     * @param {string} userId - User ID
     * @returns {Promise<Array<IWeeklyMealPlan>>}
     */
    async getPlansByUserId(userId) {
        throw new Error('Method must be implemented');
    }

    /**
     * Add food to a meal
     * @param {string} planId - Plan ID
     * @param {string} dayName - Day name
     * @param {string} mealType - Meal type
     * @param {IFoodItem} food - Food item
     * @returns {Promise<IWeeklyMealPlan>}
     */
    async addFoodToMeal(planId, dayName, mealType, food) {
        throw new Error('Method must be implemented');
    }

    /**
     * Update food in a meal
     * @param {string} planId - Plan ID
     * @param {string} dayName - Day name
     * @param {string} mealType - Meal type
     * @param {number} foodIndex - Food index
     * @param {IFoodItem} food - Updated food item
     * @returns {Promise<IWeeklyMealPlan>}
     */
    async updateFoodInMeal(planId, dayName, mealType, foodIndex, food) {
        throw new Error('Method must be implemented');
    }

    /**
     * Remove food from a meal
     * @param {string} planId - Plan ID
     * @param {string} dayName - Day name
     * @param {string} mealType - Meal type
     * @param {number} foodIndex - Food index
     * @returns {Promise<IWeeklyMealPlan>}
     */
    async removeFoodFromMeal(planId, dayName, mealType, foodIndex) {
        throw new Error('Method must be implemented');
    }

    /**
     * Mark meal as completed
     * @param {string} planId - Plan ID
     * @param {string} dayName - Day name
     * @param {string} mealType - Meal type
     * @param {boolean} status - Completion status
     * @returns {Promise<IWeeklyMealPlan>}
     */
    async completeMeal(planId, dayName, mealType, status) {
        throw new Error('Method must be implemented');
    }

    /**
     * Get weekly summary
     * @param {string} planId - Plan ID
     * @returns {Promise<IWeeklySummary>}
     */
    async getWeeklySummary(planId) {
        throw new Error('Method must be implemented');
    }

    /**
     * Delete weekly meal plan
     * @param {string} planId - Plan ID
     * @returns {Promise<IWeeklyMealPlan>}
     */
    async deleteWeeklyMeal(planId) {
        throw new Error('Method must be implemented');
    }

    /**
     * Delete all user plans
     * @param {string} userId - User ID
     * @returns {Promise<{deletedCount: number}>}
     */
    async deleteAllUserPlans(userId) {
        throw new Error('Method must be implemented');
    }

    /**
     * Delete all meals for a specific day
     * @param {string} planId - Plan ID
     * @param {string} dayName - Day name
     * @returns {Promise<IWeeklyMealPlan>}
     */
    async deleteDayMeals(planId, dayName) {
        throw new Error('Method must be implemented');
    }

    /**
     * Delete specific meal type for a day
     * @param {string} planId - Plan ID
     * @param {string} dayName - Day name
     * @param {string} mealType - Meal type
     * @returns {Promise<IWeeklyMealPlan>}
     */
    async deleteMealType(planId, dayName, mealType) {
        throw new Error('Method must be implemented');
    }
}

/**
 * @interface IWeeklyMealController
 * @description Controller interface for weekly meal operations
 */
class IWeeklyMealController {
    /**
     * Create weekly meal plan
     * @param {Object} req - Express request
     * @param {Object} res - Express response
     */
    async createWeeklyMeal(req, res) {
        throw new Error('Method must be implemented');
    }

    /**
     * Get weekly meal plan
     * @param {Object} req - Express request
     * @param {Object} res - Express response
     */
    async getWeeklyMeal(req, res) {
        throw new Error('Method must be implemented');
    }

    /**
     * Get plans by user
     * @param {Object} req - Express request
     * @param {Object} res - Express response
     */
    async getPlansByUser(req, res) {
        throw new Error('Method must be implemented');
    }

    /**
     * Add food to meal
     * @param {Object} req - Express request
     * @param {Object} res - Express response
     */
    async addFood(req, res) {
        throw new Error('Method must be implemented');
    }

    /**
     * Update food in meal
     * @param {Object} req - Express request
     * @param {Object} res - Express response
     */
    async updateFood(req, res) {
        throw new Error('Method must be implemented');
    }

    /**
     * Remove food from meal
     * @param {Object} req - Express request
     * @param {Object} res - Express response
     */
    async removeFood(req, res) {
        throw new Error('Method must be implemented');
    }

    /**
     * Complete meal
     * @param {Object} req - Express request
     * @param {Object} res - Express response
     */
    async completeMeal(req, res) {
        throw new Error('Method must be implemented');
    }

    /**
     * Get weekly summary
     * @param {Object} req - Express request
     * @param {Object} res - Express response
     */
    async getSummary(req, res) {
        throw new Error('Method must be implemented');
    }

    /**
     * Delete weekly meal plan
     * @param {Object} req - Express request
     * @param {Object} res - Express response
     */
    async deleteWeeklyMeal(req, res) {
        throw new Error('Method must be implemented');
    }

    /**
     * Delete all user plans
     * @param {Object} req - Express request
     * @param {Object} res - Express response
     */
    async deleteAllUserPlans(req, res) {
        throw new Error('Method must be implemented');
    }

    /**
     * Delete day meals
     * @param {Object} req - Express request
     * @param {Object} res - Express response
     */
    async deleteDayMeals(req, res) {
        throw new Error('Method must be implemented');
    }

    /**
     * Delete meal type
     * @param {Object} req - Express request
     * @param {Object} res - Express response
     */
    async deleteMealType(req, res) {
        throw new Error('Method must be implemented');
    }
}

module.exports = {
    IFoodItem,
    IMeal,
    IDayMeals,
    IWeeklyMealPlan,
    IWeeklySummary,
    IWeeklyMealService,
    IWeeklyMealController
};
