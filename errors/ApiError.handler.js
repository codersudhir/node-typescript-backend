const ApiError = require('./ApiError')

function apiErrorHandler(err, req, res, next) {
    if (err instanceof ApiError) {
        console.error(err.message)
        res.status(err.code).json({
            status: "failed",
            message: err.message
        })
        return
    }

    res.status(500).json({
        status: "server error",
        message: "something went wrong"
    })
}

module.exports = apiErrorHandler;