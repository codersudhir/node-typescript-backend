const ApiError = require('../errors/ApiError')
module.exports = (req, res, next) => {
    try {
        if (req.query.constructor === Object && Object.keys(req.query).length === 0) {
            return next(ApiError.badRequest("query parameter is missing"));
        }
        next();
    } catch (error) {
        return next(ApiError.internalServerError())
    }
};