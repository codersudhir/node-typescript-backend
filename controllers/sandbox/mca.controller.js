const axios = require('axios');
const sandboxUtil = require('../../utils/sandbox.util')
const ApiError = require('../../errors/ApiError')
const {response} = require("express");

class McaController {
    getCompanyByCIN = async (req, res, next) => {
        if (req.query.cin === "")
            return next(ApiError.badRequest("query parameter \'cin\' is missing"))

        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.get(`${process.env.SANDBOX_BASE_URL}/mca/companies/${req.query.cin}`, {
            headers: {
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            }
        }).then((result) => {
            if (result.status === 200) {
                return res.status(200).json({
                    status: "success",
                    company: result.data["data"]
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

module.exports = new McaController()