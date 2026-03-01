const Progress = require('./progress.model');
const WeeklyMeal = require('../weekly_meal_planner/weeklyMeal.model');
const { IPredictionService } = require('./interfaces');

/**
 * Prediction Service Implementation
 * Implements IPredictionService interface
 */
class PredictionService extends IPredictionService {
    
    predictMonthlyWeight(history) {
        // Use last 2 weeks for simple linear prediction
        const n = history.length;
        if (n < 2) return null;

        const last = history[n-1].weight;
        const prev = history[n-2].weight;
        const delta = last - prev;

        return (last + delta * 4).toFixed(2); // next month estimate
    }

    async deleteProgress(progressId) {
        const progress = await Progress.findByIdAndDelete(progressId);
        if (!progress) throw new Error("Progress record not found");
        return progress;
    }

    async deleteAllUserProgress(userId) {
        const result = await Progress.deleteMany({ userId });
        return { deletedCount: result.deletedCount };
    }
}

// Create singleton instance
const predictionService = new PredictionService();

// Export methods for backward compatibility
module.exports = {
    predictMonthlyWeight: predictionService.predictMonthlyWeight.bind(predictionService),
    deleteProgress: predictionService.deleteProgress.bind(predictionService),
    deleteAllUserProgress: predictionService.deleteAllUserProgress.bind(predictionService),
    PredictionService
};
