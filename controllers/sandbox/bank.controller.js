const axios = require('axios');
const sandboxUtil = require('../../utils/sandbox.util')
const ApiError = require('../../errors/ApiError')

class BankController {
    getBankDetailsByIfsc = async (req, res, next) => {
        if (req.query.ifsc === undefined)
            return next(ApiError.badRequest("query parameter \'IFSC\' is missing"))

        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.get(`${process.env.SANDBOX_BASE_URL}/bank/${req.query.ifsc}`, { 
            headers: {
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            }
        }).then((result) => {
            if (result.status === 200) {
                return res.status(200).json({
                    status: "success",
                    bank: result.data
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

    verifyBankAccount = async (req, res, next) => {
        if (req.body.ifsc === undefined || req.body.accountNumber === undefined || req.body.name === undefined || req.body.mobile === undefined) {
            return next(ApiError.badRequest("JSON body format missing"))
        }

        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.get(`${process.env.SANDBOX_BASE_URL}/bank/${req.body.ifsc}/accounts/${req.body.accountNumber}/verify?name=${req.body.name}&mobile=${req.body.mobile}`, {
            headers: {
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            }
        }).then((result) => {
            if (result.status === 200) {
                return res.status(200).json({
                    status: "success",
                    bankResponse: result.data["data"]
                })
            } else {
                console.log(result)
                return next(ApiError.badRequest(result))
            }
        }).catch((error) => {
            console.log(error)
            if (error.response) {
                if (error.response.status !== 500) {
                    return next(ApiError.badRequest(error.response.data["message"] === undefined ? `Sandbox error ${error}` : error.response.data["message"]))
                }
            }
            return next(ApiError.internalServerError(`Sandbox error ${error}`))
        })

    }
}

module.exports = new BankController()