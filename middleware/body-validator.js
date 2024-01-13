const ApiError = require('../errors/ApiError')
module.exports = (req, res, next) => {
    try {
        if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
            return next(ApiError.badRequest("json body is missing"));
        }
        next();
    } catch (error) {
        return next(ApiError.internalServerError())
    }
};