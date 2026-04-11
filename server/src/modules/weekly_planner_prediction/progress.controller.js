const Progress = require('./progress.model');
const WeeklyMeal = require('../weekly_meal_planner/weeklyMeal.model');
const { predictMonthlyWeight, deleteProgress, deleteAllUserProgress } = require('./prediction.service');
const { getAIAdvice } = require('./ai.service');

exports.saveProgress = async (req, res) => {
    try {
        const { weekStartDate, weight } = req.body;

        if (!weekStartDate || !weight) {
            return res.status(400).json({ message: "Missing required fields: weekStartDate, weight" });
        }

        if (weight <= 0 || weight > 1000) {
            return res.status(400).json({ message: "Invalid weight value" });
        }

        const mealPlan = await WeeklyMeal.findOne({ weekStartDate });
        let performance = 0;

        if (mealPlan) {
            // Count only planned meals, not all possible meals
            let totalPlannedMeals = 0;
            let completedMeals = 0;
            
            mealPlan.days.forEach(day => {
                ["breakfast","lunch","dinner"].forEach(meal => {
                    // Only count meals that have foods planned
                    if (day.meals[meal].foods && day.meals[meal].foods.length > 0) {
                        totalPlannedMeals++;
                        if (day.meals[meal].isCompleted) {
                            completedMeals++;
                        }
                    }
                });
            });
            
            // Calculate performance only if there are planned meals
            performance = totalPlannedMeals > 0 ? (completedMeals / totalPlannedMeals) * 100 : 0;
        }

        const existingProgress = await Progress.findOne({ weekStartDate });
        if (existingProgress) {
            existingProgress.weight = weight;
            existingProgress.performance = performance;
            await existingProgress.save();
            return res.json(existingProgress);
        }

        const progress = new Progress({ weekStartDate, weight, performance });
        await progress.save();
        res.status(201).json(progress);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPrediction = async (req, res) => {
    try {
        const { goal } = req.params;

        if (!goal) {
            return res.status(400).json({ message: "Missing required parameter: goal" });
        }

        const history = await Progress.find().sort({ weekStartDate: 1 });

        if (history.length < 2) {
            return res.status(400).json({ 
                message: "Not enough data for prediction. Need at least 2 weeks of progress data." 
            });
        }

        const predictedWeight = predictMonthlyWeight(history);
        
        const advice = await getAIAdvice({
            goal,
            performance: history[history.length-1].performance,
            predictedWeight
        });

        res.json({ 
            predictedWeight, 
            advice,
            dataPoints: history.length,
            currentWeight: history[history.length-1].weight,
            currentPerformance: history[history.length-1].performance
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProgressHistory = async (req, res) => {
    try {
        const history = await Progress.find().sort({ weekStartDate: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteProgress = async (req, res) => {
    try {
        const result = await deleteProgress(req.params.id);
        res.json({ message: "Progress record deleted successfully", deletedProgress: result });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

exports.deleteAllUserProgress = async (req, res) => {
    try {
        const result = await deleteAllUserProgress();
        res.json({ 
            message: "All user progress deleted successfully", 
            deletedCount: result.deletedCount 
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};