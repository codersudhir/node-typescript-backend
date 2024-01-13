const axios = require('axios');
const sandboxUtil = require('../../utils/sandbox.util')
const ApiError = require('../../errors/ApiError')

class CalculatorController {
    incomeTaxNewRegime = async (req, res, next) => {
        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.post(`${process.env.SANDBOX_BASE_URL}/calculators/income-tax/new`, req.body, {
            headers: {
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            }
        }).then((result) => {
            if (result.status === 200) {
                return res.status(200).json({
                    status: "success",
                    calculated_tax: result.data["data"]
                })
            } else {
                console.log(result)
                return next(ApiError.badRequest(result))
            }
        }).catch((error) => {
            console.log(error)
            if (error.response) {
                if (error.response.status !== 500) {
                    return next(ApiError.badRequest(error.response.data === undefined ? `Sandbox error ${error}` : error.response.data))
                }
            }
            return next(ApiError.internalServerError(`Sandbox error ${error}`))
        })
    }

    incomeTaxOldRegime = async (req, res, next) => {
        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.post(`${process.env.SANDBOX_BASE_URL}/calculators/income-tax/old`, req.body, {
            headers: {
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            }
        }).then((result) => {
            if (result.status === 200) {
                return res.status(200).json({
                    status: "success",
                    calculated_tax: result.data["data"]
                })
            } else {
                console.log(result)
                return next(ApiError.badRequest(result.data))
            }
        }).catch((error) => {
            console.log(error)
            if (error.response) {
                if (error.response.status !== 500) {
                    return next(ApiError.badRequest(error.response.data === undefined ? `Sandbox error ${error}` : error.response.data))
                }
            }
            return next(ApiError.internalServerError(`Sandbox error ${error}`))
        })
    }

    advanceIncomeTaxOldRegime = async (req, res, next) => {
        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.post(`${process.env.SANDBOX_BASE_URL}/calculators/income-tax/advance-tax/old`, req.body, {
            headers: {
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            }
        }).then((result) => {
            if (result.status === 200) {
                return res.status(200).json({
                    status: "success",
                    calculated_tax: result.data["data"]
                })
            } else {
                console.log(result)
                return next(ApiError.badRequest(result.data))
            }
        }).catch((error) => {
            console.log(error)
            if (error.response) {
                if (error.response.status !== 500) {
                    return next(ApiError.badRequest(error.response.data === undefined ? `Sandbox error ${error}` : error.response.data))
                }
            }
            return next(ApiError.internalServerError(`Sandbox error ${error}`))
        })
    }


    advanceIncomeTaxNewRegime = async (req, res, next) => {
        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.post(`${process.env.SANDBOX_BASE_URL}/calculators/income-tax/advance-tax/new`, req.body, {
            headers: {
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            }
        }).then((result) => {
            if (result.status === 200) {
                return res.status(200).json({
                    status: "success",
                    calculated_tax: result.data["data"]
                })
            } else {
                console.log(result)
                return next(ApiError.badRequest(result.data))
            }
        }).catch((error) => {
            console.log(error)
            if (error.response) {
                if (error.response.status !== 500) {
                    return next(ApiError.badRequest(error.response.data === undefined ? `Sandbox error ${error}` : error.response.data))
                }
            }
            return next(ApiError.internalServerError(`Sandbox error ${error}`))
        })
    }

    calculateTDS = async (req, res, next) => {
        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.post(`${process.env.SANDBOX_BASE_URL}/calculators/tds`, req.body, {
            headers: {
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            }
        }).then((result) => {
            if (result.status === 200) {
                return res.status(200).json({
                    status: "success",
                    calculated_tds: result.data["data"]
                })
            } else {
                console.log(result)
                return next(ApiError.badRequest(result.data))
            }
        }).catch((error) => {
            console.log(error)
            if (error.response) {
                if (error.response.status !== 500) {
                    return next(ApiError.badRequest(error.response.data === undefined ? `Sandbox error ${error}` : error.response.data))
                }
            }
            return next(ApiError.internalServerError(`Sandbox error ${error}`))
        })
    }
}

module.exports = new CalculatorController()