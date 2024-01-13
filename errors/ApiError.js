class ApiError {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }

    static badRequest(message) {
        return new ApiError(400, message)
    }

    static unAuthorized(message) {
        return new ApiError(401, message)
    }

    static internalServerError(message) {
        return new ApiError(500, message === undefined ? "internal server error" : message)
    }

    static notFound(message) {
        return new ApiError(404, message)
    }

    static conflict(message) {
        return new ApiError(409, message)
    }
}

module.exports = ApiError