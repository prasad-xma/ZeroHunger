const Progress = require('./progress.model');
const WeeklyMeal = require('../weekly_meal_planner/weeklyMeal.model');
const { IPredictionService } = require('./interfaces');

/**
 * Prediction Service Implementation
 * Implements IPredictionService interface
 */
class PredictionService extends IPredictionService {
    
    predictMonthlyWeight(history) {
        // Use last 2 weeks for simple linear prediction with realistic limits
        const n = history.length;
        if (n < 2) return null;

        const last = history[n-1].weight;
        const prev = history[n-2].weight;
        const delta = last - prev;

        // Calculate weekly change and project to 4 weeks (1 month)
        const weeklyChange = delta;
        let monthlyChange = weeklyChange * 4;

        // Apply realistic limits for weight change
        const maxWeeklyLoss = 1.0; // Max 1kg loss per week (safe rate)
        const maxWeeklyGain = 0.5; // Max 0.5kg gain per week (muscle building)
        
        if (weeklyChange < -maxWeeklyLoss) {
            monthlyChange = -maxWeeklyLoss * 4;
        } else if (weeklyChange > maxWeeklyGain) {
            monthlyChange = maxWeeklyGain * 4;
        }

        const predictedWeight = last + monthlyChange;
        
        // Ensure predicted weight is within healthy bounds
        const minHealthyWeight = 40; // Minimum healthy weight in kg
        const maxHealthyWeight = 200; // Maximum reasonable weight in kg
        
        const finalPrediction = Math.max(minHealthyWeight, Math.min(maxHealthyWeight, predictedWeight));
        
        return finalPrediction.toFixed(2);
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
