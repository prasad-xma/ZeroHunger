const Joi = require('joi');

/**
 * Validation schemas for Progress Tracking API endpoints
 */
const schemas = {
    progressEntry: Joi.object({
        userId: Joi.string().required().messages({
            'string.empty': 'User ID is required',
            'any.required': 'User ID is required'
        }),
        weekStartDate: Joi.date().iso().required().messages({
            'date.format': 'Week start date must be a valid ISO date',
            'any.required': 'Week start date is required'
        }),
        weight: Joi.number().positive().max(1000).required().messages({
            'number.positive': 'Weight must be a positive number',
            'number.max': 'Weight cannot exceed 1000 kg',
            'any.required': 'Weight is required'
        })
    }),

    mongoId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
            'string.pattern.base': 'Invalid ID format',
            'any.required': 'ID is required'
        }),

    userId: Joi.string().required().messages({
        'string.empty': 'User ID is required',
        'any.required': 'User ID is required'
    }),

    goal: Joi.string().required().messages({
        'string.empty': 'Goal is required',
        'any.required': 'Goal is required'
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
