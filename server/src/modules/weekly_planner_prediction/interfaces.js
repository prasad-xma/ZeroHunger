/**
 * Interface definitions for Progress Tracking and Prediction
 * Defines contracts for data structures and service methods
 */

/**
 * @interface IProgressEntry
 * @description Represents a user's progress entry for a specific week
 */
class IProgressEntry {
    /**
     * @param {string} userId - User identifier
     * @param {Date} weekStartDate - Start date of the week
     * @param {number} weight - User's weight for the week
     * @param {number} performance - Meal plan performance percentage
     */
    constructor(userId, weekStartDate, weight, performance) {
        this.userId = userId;
        this.weekStartDate = weekStartDate;
        this.weight = weight;
        this.performance = performance;
    }
}

/**
 * @interface IWeightPrediction
 * @description Represents weight prediction results
 */
class IWeightPrediction {
    /**
     * @param {number} predictedWeight - Predicted weight for next month
     * @param {Array<string>} advice - AI-generated advice
     * @param {number} dataPoints - Number of data points used for prediction
     * @param {number} currentWeight - Current weight
     * @param {number} currentPerformance - Current performance percentage
     */
    constructor(predictedWeight, advice, dataPoints, currentWeight, currentPerformance) {
        this.predictedWeight = predictedWeight;
        this.advice = advice;
        this.dataPoints = dataPoints;
        this.currentWeight = currentWeight;
        this.currentPerformance = currentPerformance;
    }
}

/**
 * @interface IAIServiceRequest
 * @description Request payload for AI service
 */
class IAIServiceRequest {
    /**
     * @param {string} goal - User's goal
     * @param {number} performance - Current performance percentage
     * @param {number} predictedWeight - Predicted weight
     */
    constructor(goal, performance, predictedWeight) {
        this.goal = goal;
        this.performance = performance;
        this.predictedWeight = predictedWeight;
    }
}

/**
 * @interface IProgressService
 * @description Service interface for progress tracking operations
 */
class IProgressService {
    /**
     * Save user progress
     * @param {Object} data - Progress data
     * @returns {Promise<IProgressEntry>}
     */
    async saveProgress(data) {
        throw new Error('Method must be implemented');
    }

    /**
     * Get progress history for user
     * @param {string} userId - User ID
     * @returns {Promise<Array<IProgressEntry>>}
     */
    async getProgressHistory(userId) {
        throw new Error('Method must be implemented');
    }

    /**
     * Delete progress entry
     * @param {string} progressId - Progress entry ID
     * @returns {Promise<IProgressEntry>}
     */
    async deleteProgress(progressId) {
        throw new Error('Method must be implemented');
    }

    /**
     * Delete all user progress
     * @param {string} userId - User ID
     * @returns {Promise<{deletedCount: number}>}
     */
    async deleteAllUserProgress(userId) {
        throw new Error('Method must be implemented');
    }
}

/**
 * @interface IPredictionService
 * @description Service interface for weight prediction operations
 */
class IPredictionService {
    /**
     * Predict monthly weight based on history
     * @param {Array<IProgressEntry>} history - Progress history
     * @returns {number} Predicted weight
     */
    predictMonthlyWeight(history) {
        throw new Error('Method must be implemented');
    }
}

/**
 * @interface IAIService
 * @description Service interface for AI-powered advice operations
 */
class IAIService {
    /**
     * Get AI-generated meal planning advice
     * @param {IAIServiceRequest} request - AI service request
     * @returns {Promise<Array<string>>} Array of advice strings
     */
    async getAIAdvice(request) {
        throw new Error('Method must be implemented');
    }
}

/**
 * @interface IProgressController
 * @description Controller interface for progress tracking operations
 */
class IProgressController {
    /**
     * Save user progress
     * @param {Object} req - Express request
     * @param {Object} res - Express response
     */
    async saveProgress(req, res) {
        throw new Error('Method must be implemented');
    }

    /**
     * Get progress history
     * @param {Object} req - Express request
     * @param {Object} res - Express response
     */
    async getProgressHistory(req, res) {
        throw new Error('Method must be implemented');
    }

    /**
     * Get prediction and advice
     * @param {Object} req - Express request
     * @param {Object} res - Express response
     */
    async getPrediction(req, res) {
        throw new Error('Method must be implemented');
    }

    /**
     * Delete progress entry
     * @param {Object} req - Express request
     * @param {Object} res - Express response
     */
    async deleteProgress(req, res) {
        throw new Error('Method must be implemented');
    }

    /**
     * Delete all user progress
     * @param {Object} req - Express request
     * @param {Object} res - Express response
     */
    async deleteAllUserProgress(req, res) {
        throw new Error('Method must be implemented');
    }
}

/**
 * @interface IValidationSchema
 * @description Interface for validation schemas
 */
class IValidationSchema {
    /**
     * Validate input data
     * @param {Object} data - Data to validate
     * @returns {Object} Validation result
     */
    validate(data) {
        throw new Error('Method must be implemented');
    }
}

/**
 * @interface IApiResponse
 * @description Standard API response interface
 */
class IApiResponse {
    /**
     * @param {boolean} success - Success status
     * @param {string} message - Response message
     * @param {*} data - Response data
     * @param {number} status - HTTP status code
     */
    constructor(success, message, data, status) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.status = status;
    }
}

/**
 * @interface IErrorHandler
 * @description Error handler interface
 */
class IErrorHandler {
    /**
     * Handle errors globally
     * @param {Error} err - Error object
     * @param {Object} req - Express request
     * @param {Object} res - Express response
     * @param {Function} next - Express next function
     */
    static global(err, req, res, next) {
        throw new Error('Method must be implemented');
    }

    /**
     * Handle 404 errors
     * @param {Object} req - Express request
     * @param {Object} res - Express response
     * @param {Function} next - Express next function
     */
    static notFound(req, res, next) {
        throw new Error('Method must be implemented');
    }

    /**
     * Async error wrapper
     * @param {Function} fn - Async function to wrap
     * @returns {Function} Wrapped function
     */
    static asyncHandler(fn) {
        throw new Error('Method must be implemented');
    }
}

module.exports = {
    IProgressEntry,
    IWeightPrediction,
    IAIServiceRequest,
    IProgressService,
    IPredictionService,
    IAIService,
    IProgressController,
    IValidationSchema,
    IApiResponse,
    IErrorHandler
};
