/**
 * Standardized response utility for Weekly Meal Planner API
 */
class ApiResponseUtil {
    /**
     * Send success response
     */
    static success(res, data = null, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            status: statusCode
        });
    }

    /**
     * Send created response
     */
    static created(res, data, message = 'Resource created successfully') {
        return this.success(res, data, message, 201);
    }

    /**
     * Send no content response
     */
    static noContent(res, message = 'Resource deleted successfully') {
        return res.status(204).json({
            success: true,
            message,
            status: 204
        });
    }

    /**
     * Send bad request response
     */
    static badRequest(res, message = 'Bad request', error = null) {
        return res.status(400).json({
            success: false,
            message,
            error,
            status: 400
        });
    }

    /**
     * Send unauthorized response
     */
    static unauthorized(res, message = 'Unauthorized') {
        return res.status(401).json({
            success: false,
            message,
            status: 401
        });
    }

    /**
     * Send forbidden response
     */
    static forbidden(res, message = 'Forbidden') {
        return res.status(403).json({
            success: false,
            message,
            status: 403
        });
    }

    /**
     * Send not found response
     */
    static notFound(res, message = 'Resource not found') {
        return res.status(404).json({
            success: false,
            message,
            status: 404
        });
    }

    /**
     * Send conflict response
     */
    static conflict(res, message = 'Resource already exists') {
        return res.status(409).json({
            success: false,
            message,
            status: 409
        });
    }

    /**
     * Send unprocessable entity response
     */
    static unprocessableEntity(res, message = 'Validation failed', errors = []) {
        return res.status(422).json({
            success: false,
            message,
            errors,
            status: 422
        });
    }

    /**
     * Send internal server error response
     */
    static internalError(res, message = 'Internal server error', error = null) {
        return res.status(500).json({
            success: false,
            message,
            error,
            status: 500
        });
    }

    /**
     * Send service unavailable response
     */
    static serviceUnavailable(res, message = 'Service temporarily unavailable') {
        return res.status(503).json({
            success: false,
            message,
            status: 503
        });
    }
}

module.exports = ApiResponseUtil;
