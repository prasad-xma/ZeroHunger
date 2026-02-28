const Joi = require('joi');

/**
 * Validation schemas for Weekly Meal Planner API endpoints
 */
const schemas = {
    weeklyMealPlan: Joi.object({
        userId: Joi.string().required().messages({
            'string.empty': 'User ID is required',
            'any.required': 'User ID is required'
        }),
        weekStartDate: Joi.date().iso().required().messages({
            'date.format': 'Week start date must be a valid ISO date',
            'any.required': 'Week start date is required'
        }),
        goal: Joi.string().optional().default('General')
    }),

    foodItem: Joi.object({
        day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required().messages({
            'any.only': 'Day must be a valid weekday (Monday-Sunday)',
            'any.required': 'Day is required'
        }),
        mealType: Joi.string().valid('breakfast', 'lunch', 'dinner').required().messages({
            'any.only': 'Meal type must be breakfast, lunch, or dinner',
            'any.required': 'Meal type is required'
        }),
        name: Joi.string().min(1).max(100).required().messages({
            'string.empty': 'Food name is required',
            'string.min': 'Food name must be at least 1 character',
            'string.max': 'Food name cannot exceed 100 characters',
            'any.required': 'Food name is required'
        }),
        grams: Joi.number().positive().max(10000).required().messages({
            'number.positive': 'Grams must be a positive number',
            'number.max': 'Grams cannot exceed 10000',
            'any.required': 'Grams is required'
        })
    }),

    foodUpdate: Joi.object({
        day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
        mealType: Joi.string().valid('breakfast', 'lunch', 'dinner').required(),
        foodIndex: Joi.number().integer().min(0).required().messages({
            'number.integer': 'Food index must be an integer',
            'number.min': 'Food index must be 0 or greater',
            'any.required': 'Food index is required'
        }),
        name: Joi.string().min(1).max(100).required(),
        grams: Joi.number().positive().max(10000).required()
    }),

    foodRemoval: Joi.object({
        day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
        mealType: Joi.string().valid('breakfast', 'lunch', 'dinner').required(),
        foodIndex: Joi.number().integer().min(0).required()
    }),

    mealCompletion: Joi.object({
        day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
        mealType: Joi.string().valid('breakfast', 'lunch', 'dinner').required(),
        isCompleted: Joi.boolean().required().messages({
            'boolean.base': 'isCompleted must be a boolean value',
            'any.required': 'isCompleted is required'
        })
    }),

    dayDeletion: Joi.object({
        day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required()
    }),

    mealTypeDeletion: Joi.object({
        day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
        mealType: Joi.string().valid('breakfast', 'lunch', 'dinner').required()
    }),

    mongoId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
            'string.pattern.base': 'Invalid ID format',
            'any.required': 'ID is required'
        }),

    userId: Joi.string().required().messages({
        'string.empty': 'User ID is required',
        'any.required': 'User ID is required'
    })
};

/**
 * Validation middleware factory
 */
const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[source], {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
                value: detail.context.value
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors,
                status: 400
            });
        }

        req[source] = value;
        next();
    };
};

module.exports = {
    schemas,
    validate
};
