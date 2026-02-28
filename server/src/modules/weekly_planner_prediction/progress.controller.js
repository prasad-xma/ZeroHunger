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

        // userId will be added by auth middleware
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized - User ID required" });
        }

        const mealPlan = await WeeklyMeal.findOne({ userId: req.userId, weekStartDate });
        let performance = 0;

        if (mealPlan) {
            const totalMeals = mealPlan.days.length * 3;
            let completed = 0;
            mealPlan.days.forEach(day => {
                ["breakfast","lunch","dinner"].forEach(meal => {
                    if (day.meals[meal].isCompleted) completed++;
                });
            });
            performance = (completed / totalMeals) * 100;
        }

        const existingProgress = await Progress.findOne({ userId: req.userId, weekStartDate });
        if (existingProgress) {
            existingProgress.weight = weight;
            existingProgress.performance = performance;
            await existingProgress.save();
            return res.json(existingProgress);
        }

        const progress = new Progress({ userId: req.userId, weekStartDate, weight, performance });
        await progress.save();
        res.status(201).json(progress);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPrediction = async (req, res) => {
    try {
        const { userId, goal } = req.params;

        if (!userId || !goal) {
            return res.status(400).json({ message: "Missing required parameters: userId, goal" });
        }

        const history = await Progress.find({ userId }).sort({ weekStartDate: 1 });

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
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ message: "Missing required parameter: userId" });
        }

        const history = await Progress.find({ userId }).sort({ weekStartDate: -1 });
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
        const result = await deleteAllUserProgress(req.params.userId);
        res.json({ 
            message: "All user progress deleted successfully", 
            deletedCount: result.deletedCount 
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};