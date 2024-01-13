const axios = require('axios');
const sandboxUtil = require('../../utils/sandbox.util')
const ApiError = require('../../errors/ApiError')
const  fetch = require("node-fetch2")
class AadharController {
    verifyAadhaar = async (req, res, next) => {
        if ( req.query.aadhar === "" || req.query.aadhar === undefined)
            return next(ApiError.badRequest("either query parameter aadhar is missing"))

            let token = await sandboxUtil.getSandboxAuthToken();
            const options = {
                method: 'POST',
                headers: {
                  accept: 'application/json',
                  Authorization: token,
                  'x-api-key': process.env.SANDBOX_KEY,
                  'x-api-version': process.env.SANDBOX_API_VERSION
                },
                body: {
                    aadhaar_number:req.query.aadhar
                }
              };

              fetch(`${process.env.SANDBOX_BASE_URL}/aadhaar/verify?consent=Y&reason=For%20KYC%20of%20User`, options)
              .then((result) => {
                if (result.status === 200) {
                    return res.status(200).json({
                        status: "success",
                        company: result.data["data"]["message"]
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





        // let token = await sandboxUtil.getSandboxAuthToken()
        // console.log(token)
        // await axios.post(`${process.env.SANDBOX_BASE_URL}/aadhaar/verify?consent=Y&reason=For%20KYC%20of%20User`, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'x-api-key': process.env.SANDBOX_KEY,
        //         'Authorization': token,
        //         'x-api-version': process.env.SANDBOX_API_VERSION,
        //     },
        //         data:{
        //         aadhaar_number: req.query.aadhar
        //     }
        // }).then((result) => {
        //     if (result.status === 200) {
        //         return res.status(200).json({
        //             status: "success",
        //             company: result.data["data"]["message"]
        //         })
        //     } else {
        //         console.log(result)
        //         return next(ApiError.badRequest(result))
        //     }
        // }).catch((error) => {
        //     console.log(error)
        //     if (error.response) {
        //         if (error.response.status !== 500) {
        //             return next(ApiError.badRequest(error.response.data["message"] === undefined ? `Sandbox error ${error}` : error.response.data["message"]))
        //         }
        //     }
        //     return next(ApiError.internalServerError(`Sandbox error ${error}`))
        // })
    }


}

module.exports = new AadharController();