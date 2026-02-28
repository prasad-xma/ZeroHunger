const service = require('./weeklyMeal.service');

// Create weekly plan
exports.createWeeklyMeal = async (req, res) => {
    try {
        const result = await service.createWeeklyMeal(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


// Get plan
exports.getWeeklyMeal = async (req, res) => {
    const plan = await service.getWeeklyMealById(req.params.id);
    res.json(plan);
};


// Add food
exports.addFood = async (req, res) => {
    try {
        const { day, mealType, name, grams } = req.body;

        const result = await service.addFoodToMeal(
            req.params.id,
            day,
            mealType,
            { name, grams }
        );

        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


// Mark meal completed
exports.completeMeal = async (req, res) => {
    try {
        const { day, mealType, isCompleted } = req.body;

        const result = await service.completeMeal(
            req.params.id,
            day,
            mealType,
            isCompleted
        );

        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


// Summary
exports.getSummary = async (req, res) => {
    try {
        const summary = await service.getWeeklySummary(req.params.id);
        res.json(summary);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};