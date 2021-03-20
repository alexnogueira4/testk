const { StatusCodes } = require('http-status-codes');

module.exports = (errors, req, res, next) => {
    errors = Array.isArray(errors) ? errors : [errors];

    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status_code: StatusCodes.UNPROCESSABLE_ENTITY,
        errors
    });
};