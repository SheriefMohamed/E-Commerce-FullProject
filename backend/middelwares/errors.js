const ErrorHandler = require('../utils/error_handler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === "DEVELOPMENT") {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
    if (process.env.NODE_ENV === "PRODUCTION") {
        let error = {...err};
        error.message = err.message;

        //wrong mongoose object id
        if (err.name === 'CastError') {
            const message = `Resource Not Found. Invalid: ${err.path}`
            error = new ErrorHandler(message, 400)
        }

        //handling mongoose validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 400);
        }

        // Handling Mongoose duplicate key errors
        if (err.code === 11000) {
            // const message = `Duplicate ${Object.keys(err.keyValue)} entered`
            const message = 'This Email Is Already Used';
            error = new ErrorHandler(message, 400)
        }

        // Handling wrong JWT error
        if (err.name === 'JsonWebTokenError') {
            const message = 'JSON Web Token is invalid. Try Again!!!'
            error = new ErrorHandler(message, 400)
        }

        // Handling Expired JWT error
        if (err.name === 'TokenExpiredError') {
            const message = 'JSON Web Token is expired. Try Again!!!'
            error = new ErrorHandler(message, 400)
        }

        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error',
        })
    }
}