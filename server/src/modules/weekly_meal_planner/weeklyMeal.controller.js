const service = require('./weeklyMeal.service');

const validateMealPlan = (req, res, next) => {
    const { weekStartDate, goal } = req.body;
    
    if (!weekStartDate) {
        return res.status(400).json({ 
            message: "Missing required fields: weekStartDate" 
        });
    }
    
    if (isNaN(Date.parse(weekStartDate))) {
        return res.status(400).json({ 
            message: "Invalid weekStartDate format" 
        });
    }
    
    // userId will be added by auth middleware
    if (!req.userId) {
        return res.status(401).json({ 
            message: "Unauthorized - User ID required" 
        });
    }
    
    next();
};

const validateFood = (req, res, next) => {
    const { day, mealType, name, grams } = req.body;
    
    if (!day || !mealType || !name || !grams) {
        return res.status(400).json({ 
            message: "Missing required fields: day, mealType, name, grams" 
        });
    }
    
    if (grams <= 0 || grams > 10000) {
        return res.status(400).json({ 
            message: "Invalid grams value (must be between 1 and 10000)" 
        });
    }
    
    next();
};

const validateMealCompletion = (req, res, next) => {
    const { day, mealType, isCompleted } = req.body;
    
    if (!day || !mealType || typeof isCompleted !== 'boolean') {
        return res.status(400).json({ 
            message: "Missing required fields: day, mealType, isCompleted (boolean)" 
        });
    }
    
    next();
};

const validateFoodUpdate = (req, res, next) => {
    const { day, mealType, foodIndex, name, grams } = req.body;
    
    if (!day || !mealType || foodIndex === undefined || !name || !grams) {
        return res.status(400).json({ 
            message: "Missing required fields: day, mealType, foodIndex, name, grams" 
        });
    }
    
    if (foodIndex < 0) {
        return res.status(400).json({ 
            message: "foodIndex must be 0 or greater" 
        });
    }
    
    if (grams <= 0 || grams > 10000) {
        return res.status(400).json({ 
            message: "Invalid grams value (must be between 1 and 10000)" 
        });
    }
    
    next();
};

const validateFoodRemoval = (req, res, next) => {
    const { day, mealType, foodIndex } = req.body;
    
    if (!day || !mealType || foodIndex === undefined) {
        return res.status(400).json({ 
            message: "Missing required fields: day, mealType, foodIndex" 
        });
    }
    
    if (foodIndex < 0) {
        return res.status(400).json({ 
            message: "foodIndex must be 0 or greater" 
        });
    }
    
    next();
};

// Create weekly plan
exports.createWeeklyMeal = [validateMealPlan, async (req, res) => {
    try {
        const result = await service.createWeeklyMeal(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}];

// Get plan
exports.getWeeklyMeal = async (req, res) => {
    try {
        const plan = await service.getWeeklyMealById(req.params.id);
        res.json(plan);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// Get plans by userId
exports.getPlansByUser = async (req, res) => {
    try {
        const plans = await service.getPlansByUserId(req.params.userId);
        res.json(plans);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Add food
exports.addFood = [validateFood, async (req, res) => {
    try {
        const { day, mealType, name, grams } = req.body;
        const result = await service.addFoodToMeal(
            req.params.id, day, mealType, { name, grams }
        );
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}];

// Update food in meal
exports.updateFood = [validateFoodUpdate, async (req, res) => {
    try {
        const { day, mealType, foodIndex, name, grams } = req.body;
        const result = await service.updateFoodInMeal(
            req.params.id, day, mealType, foodIndex, { name, grams }
        );
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}];

// Remove food from meal
exports.removeFood = [validateFoodRemoval, async (req, res) => {
    try {
        const { day, mealType, foodIndex } = req.body;
        const result = await service.removeFoodFromMeal(
            req.params.id, day, mealType, foodIndex
        );
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}];

// Mark meal completed
exports.completeMeal = [validateMealCompletion, async (req, res) => {
    try {
        const { day, mealType, isCompleted } = req.body;
        const result = await service.completeMeal(req.params.id, day, mealType, isCompleted);
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}];

// Weekly summary
exports.getSummary = async (req, res) => {
    try {
        const summary = await service.getWeeklySummary(req.params.id);
        res.json(summary);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete weekly plan
exports.deleteWeeklyMeal = async (req, res) => {
    try {
        const result = await service.deleteWeeklyMeal(req.params.id);
        res.json({ message: "Weekly plan deleted successfully", deletedPlan: result });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// Delete all user plans
exports.deleteAllUserPlans = async (req, res) => {
    try {
        const result = await service.deleteAllUserPlans(req.params.userId);
        res.json({ 
            message: "All user plans deleted successfully", 
            deletedCount: result.deletedCount 
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete all meals for a specific day
exports.deleteDayMeals = async (req, res) => {
    try {
        const { day } = req.body;
        if (!day) {
            return res.status(400).json({ message: "Missing required field: day" });
        }
        
        const result = await service.deleteDayMeals(req.params.id, day);
        res.json({ message: `All meals for ${day} deleted successfully`, plan: result });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete specific meal type for a day
exports.deleteMealType = async (req, res) => {
    try {
        const { day, mealType } = req.body;
        if (!day || !mealType) {
            return res.status(400).json({ message: "Missing required fields: day, mealType" });
        }
        
        const result = await service.deleteMealType(req.params.id, day, mealType);
        res.json({ 
            message: `${mealType} for ${day} deleted successfully`, 
            plan: result 
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};