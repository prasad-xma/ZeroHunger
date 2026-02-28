/**
 * Error handling middleware for Progress Tracking
 */
class ErrorHandler {
    /**
     * Handle 404 errors
     */
    static notFound(req, res, next) {
        const error = new Error(`Not Found - ${req.originalUrl}`);
        res.status(404);
        next(error);
    }

    /**
     * Global error handler
     */
    static global(err, req, res, next) {
        let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        let message = err.message;

        // Mongoose validation error
        if (err.name === 'ValidationError') {
            statusCode = 400;
            message = Object.values(err.errors).map(val => val.message).join(', ');
        }

        // Mongoose duplicate key error
        if (err.code === 11000) {
            statusCode = 409;
            message = 'Resource already exists';
        }

        // Mongoose cast error
        if (err.name === 'CastError') {
            statusCode = 400;
            message = 'Invalid ID format';
        }

        // Log error for debugging
        console.error('Error:', {
            message: err.message,
            stack: err.stack,
            url: req.originalUrl,
            method: req.method,
            body: req.body,
            params: req.params,
            query: req.query
        });

        res.status(statusCode).json({
            success: false,
            message,
            status: statusCode,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    /**
     * Async error wrapper
     */
    static asyncHandler(fn) {
        return (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };
    }
}

module.exports = ErrorHandler;
