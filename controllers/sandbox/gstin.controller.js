const axios = require('axios');
const sandboxUtil = require('../../utils/sandbox.util')
const ApiError = require('../../errors/ApiError')
const { GSTIN, GSTSearch } = require('../../models');
const uuid = require("uuid");
const { token } = require('morgan');
const fetch = require("node-fetch2");

// const sdk = require('api')('@sandbox-docs/v2.0#axga842wkycr2fnc');


class GstinController {
    searchDetailsByGSTINNumber = async (req, res, next) => {
        if (req.query.gstin === "")
            return next(ApiError.badRequest("query parameter \'GSTIN\' is missing"))

        let token = await sandboxUtil.getSandboxAuthToken()
        console.log("token:", token);
        await axios.get(`${process.env.SANDBOX_BASE_URL}/gsp/public/gstin/${req.query.gstin}`, {
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
                // console.log(result)
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

    searchGSTINNumberByPan = async (req, res, next) => {
        if (req.query.pan === "")
            return next(ApiError.badRequest("query parameter \'pan\' is missing"))

        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.get(`${process.env.SANDBOX_BASE_URL}/gsp/public/pan/${req.query.pan}?state_code=${req.query.gst_state_code}`, {
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
                return next(ApiError.badRequest(result.data))
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

    trackGSTReturn = async (req, res, next) => {
        if (req.body.gstin === "" || req.body.financialYear === "" || req.body.gstin === undefined || req.body.financialYear === undefined) {
            return next(ApiError.badRequest("JSON body format missing"))
        }

        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.get(`${process.env.SANDBOX_BASE_URL}/gsp/public/gstr?gstin=${req.body.gstin}&financial_year=${req.body.financialYear}`, {
            headers: {
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            }
        }).then((result) => {
            if (result.status === 200) {
                if (result.data["data"]["message"] !== undefined) {
                    if (result.data["data"]["error_code"] === "RET13510") {
                        return next(ApiError.notFound(result.data["data"]["message"]))
                    }
                    return next(ApiError.badRequest(result.data["data"]["message"]))
                }

                return res.status(200).json({
                    status: "success",
                    company: {
                        "gstin": req.body.gstin,
                        "EFiledlist": result.data["data"]["EFiledlist"]
                    }
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

    registerForGST = async (req, res, next) => {
        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.get(`${process.env.SANDBOX_BASE_URL}/gsp/tax-payer/registration`, {
            headers: {
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            }
        }).then((result) => {
            if (result.status === 200) {
                return res.status(200).json({
                    status: "success",
                    response_gst_portal: result.data["data"]
                })
            } else {
                return next(ApiError.badRequest(result.data["data"]))
            }
        }).catch((error) => {
            console.log(error)
            if (error.response) {
                if (error.response.status !== 500) {
                    return next(ApiError.internalServerError(error.response.data["message"] === undefined ? `Sandbox error ${error}` : error.response.data["message"]))
                }
            }
            return next(ApiError.internalServerError(`Sandbox error ${error}`))
        })
    }

    generateOTP = async (req, res, next) => {
        let token = await sandboxUtil.getSandboxAuthToken();
        const options = {
            method: 'POST',
            headers: {
              accept: 'application/json',
              Authorization: token,
              'x-api-key': process.env.SANDBOX_KEY,
              'x-api-version': process.env.SANDBOX_API_VERSION
            }
          };
          
          fetch(`${process.env.SANDBOX_BASE_URL}/gsp/tax-payer/${req.body.gstin}/otp?username=${req.body.gst_portal_username}`, options)
            .then(response => response.json())
            .then(response => res.status(200).json(response))
            .catch(err => {
                console.log("catch eeror:",error.response)
                if (error.response) {
                    if (error.response.status !== 500) {
                        return next(ApiError.internalServerError(error.response.data["message"] === undefined ? `Sandbox error ${error}` : error.response.data["message"]))
                    }
                }
                return next(ApiError.internalServerError(`Sandbox error ${error}`))
            });
                                                                
//         let token = await sandboxUtil.getSandboxAuthToken()
//         console.log(token);
//         const link=`${process.env.SANDBOX_BASE_URL}/gsp/tax-payer/${req.body.gstin}/otp?username=${req.body.gst_portal_username}`
//        const headers={
//         'x-api-key': process.env.SANDBOX_KEY,
// //   "Authorization": "eyJhbGciOiJIUzUxMiJ9.eyJhdWQiOiJBUEkiLCJyZWZyZXNoX3Rva2VuIjoiZXlKaGJHY2lPaUpJVXpVeE1pSjkuZXlKaGRXUWlPaUpCVUVraUxDSnpkV0lpT2lKcGRHRjRaV0Z6ZVRFNVFHZHRZV2xzTG1OdmJTSXNJbUZ3YVY5clpYa2lPaUpyWlhsZmJHbDJaVjlFUjJONGIwVklWRTFWTVd4eFNVbFdkMnhtVFcxUU0yUnlaMjlUUlc5RE9DSXNJbWx6Y3lJNkltRndhUzV6WVc1a1ltOTRMbU52TG1sdUlpd2laWGh3SWpveE56QTFOVGd4TVRrMExDSnBiblJsYm5RaU9pSlNSVVpTUlZOSVgxUlBTMFZPSWl3aWFXRjBJam94TmpjME1EUTFNVGswZlEuWTVEQzllQkZTZ0tHdExfcGEyZ3dJOTRmYWU5R3dpUE5RZU96SGxYeEhYcUxreXoyQWRuZDJrNjA4enc5TjY2T09pQW5tencyRi1UWDJBMFFEa2pNNmciLCJzdWIiOiJpdGF4ZWFzeTE5QGdtYWlsLmNvbSIsImFwaV9rZXkiOiJrZXlfbGl2ZV9ER2N4b0VIVE1VMWxxSUlWd2xmTW1QM2RyZ29TRW9DOCIsImlzcyI6ImFwaS5zYW5kYm94LmNvLmluIiwiZXhwIjoxNjc0MTMxNTk0LCJpbnRlbnQiOiJBQ0NFU1NfVE9LRU4iLCJpYXQiOjE2NzQwNDUxOTR9.JSPqnR5-jgKyJlHegfPRxh1Fe2tuc8IVqNrn5n7FgFfwZfTU0KczmQHgEkKV0wtCNUNokyvGJuQ_i9T4qoFgiw",
//         'x-api-version': process.env.SANDBOX_API_VERSION,
//         // 'accept': 'application/json'
//     };
//         console.log("link",link)
//         console.log("headers",headers)
//         await axios.post(link, {
//             headers: headers,
//             // params:{
//             //     username: req.query.gst_portal_username,
//             // }
        // }).then((result) => {
        //     if (result.status === 200) {
        //         return res.status(200).json({
        //             status: "success",
        //             message: result.data["data"]["message"]
        //         })
        //     } else {
        //         return next(ApiError.badRequest(result.data["data"]))
        //     }
        // }).catch((error) => {
        //     console.log("catch eeror:",error.response)
        //     if (error.response) {
        //         if (error.response.status !== 500) {
        //             return next(ApiError.internalServerError(error.response.data["message"] === undefined ? `Sandbox error ${error}` : error.response.data["message"]))
        //         }
        //     }
        //     return next(ApiError.internalServerError(`Sandbox error ${error}`))
        // })
    }

    verifyOTP = async (req, res, next) => {

        // let token = await sandboxUtil.getSandboxAuthToken();
        // const options = {
        //     method: 'POST',
        //     headers: {
        //       accept: 'application/json',
        //       Authorization: token,
        //       'x-api-key': process.env.SANDBOX_KEY,
        //       'x-api-version': process.env.SANDBOX_API_VERSION
        //     }
        //   };

        //   fetch(`${process.env.SANDBOX_BASE_URL}/gsp/tax-payer/${req.body.gstin}/otp/verify?username=${req.body.username}&otp=${req.body.otp}`, options)
        //   .then(async (result) => {
        //     if (result.status === 200) {
        //         // await GSTIN.create({
        //         //     id: uuid.v4(),
        //         //     number: req.body.gstin,
        //         //     userId:req.user.id,
        //         //     sessionExpiry: result.data["data"]["session_expiry"]
        //         // })
        //         return res.status(200).json(result.data,{
        //             status: "success",
        //             message: `GSTIN: ${req.body.gstin} authenticated successfully!`
        //         })
        //     } else {
        //         return next(ApiError.badRequest(result.data["data"]))
        //     }
        // }).catch((error) => {
        //     console.log(error)
        //     if (error.response) {
        //         if (error.response.status !== 500) {
        //             return next(ApiError.internalServerError(error.response.data["message"] === undefined ? `Sandbox error ${error}` : error.response.data["message"]))
        //         }
        //     }
        //     return next(ApiError.internalServerError(`Sandbox error ${error}`))
        // })


        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.post(`${process.env.SANDBOX_BASE_URL}/gsp/tax-payer/${req.body.gstin}/otp/verify?username=${req.body.gst_portal_username}&otp=${req.body.otp}`, {}, {
            headers: {
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            }
        }).then(async (result) => {
            if (result.status.code === 200) {
                
                // await GSTIN.create({
                //     id: uuid.v4(),
                //     number: req.body.gstin,
                //     userId: req.user.id,
                //     sessionExpiry: result.data["data"]["session_expiry"]
                // })
                return res.status(200).json(result.data,{
                    status: "success",
                    message: `GSTIN: ${req.body.gstin} authenticated successfully!`
                })
            } else {
                console.log(`this is result ${result}`)
                return next(ApiError.badRequest(result.data["data"]))
            }
        }).catch((error) => {
            console.log(error)
            if (error.response) {
                if (error.response.status !== 500) {
                    return next(ApiError.internalServerError(error.response.data["message"] === undefined ? `Sandbox error ${error}` : error.response.data["message"]))
                }
            }
            return next(ApiError.internalServerError(`Sandbox error ${error}`))
        })
    }

    uploadGSTR4 = async (req, res, next) => {
        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.post(`${process.env.SANDBOX_BASE_URL}/gsp/tax-payer/${req.body.gstin}/gstrs/gstr-4/${req.body.year}/${req.body.month}`, req.body.payload, {
            headers: {
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            }
        }).then((result) => {
            if (result.status === 200) {
                return res.status(200).json({
                    status: "success",
                    message: result.data
                })
            } else {
                return next(ApiError.badRequest(result.data["message"]))
            }
        }).catch((error) => {
            if (error.response) {
                if (error.response.status !== 500) {
                    return next(ApiError.internalServerError(error.response.data["message"] === undefined ? `Sandbox error ${error}` : error.response.data["message"]))
                }
            }
            return next(ApiError.internalServerError(`Sandbox error ${error}`))
        })
    }

    getGstr3bSummary = async (req, res, next) => {
        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.get(`${process.env.SANDBOX_BASE_URL}/gsp/tax-payer/${req.query.gstin}/gstrs/gstr-3b/${req.query.year}/${req.query.month}`, {
            headers: {
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            }
        }).then((result) => {
            if (result.status === 200) {
                return res.status(200).json({
                    status: "success",
                    message: result.data
                })
            } else {
                return next(ApiError.badRequest(result.data["message"]))
            }
        }).catch((error) => {
            if (error.response) {
                if (error.response.status !== 500) {
                    return next(ApiError.internalServerError(error.response.data["message"] === undefined ? `Sandbox error ${error}` : error.response.data["message"]))
                }
            }
            return next(ApiError.internalServerError(`Sandbox error ${error}`))
        })
    }

    uploadGstr3b = async (req, res, next) => {
        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.post(`${process.env.SANDBOX_BASE_URL}/gsp/tax-payer/${req.query.gstin}/gstrs/gstr-3b/${req.query.year}/${req.query.month}`, req.body.payload, {
            headers: {
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            }
        }).then((result) => {
            if (result.status === 200) {
                return res.status(200).json({
                    status: "success",
                    message: result.data["data"]
                })
            } else {
                return next(ApiError.badRequest(result.data["message"]))
            }
        }).catch((error) => {
            if (error.response) {
                if (error.response.status !== 500) {
                    return next(ApiError.internalServerError(error.response.data["message"] === undefined ? `Sandbox error ${error}` : error.response.data["message"]))
                }
            }
            return next(ApiError.internalServerError(`Sandbox error ${error}`))
        })
    }

    submitGstr3b = async (req, res, next) => {
        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.post(`${process.env.SANDBOX_BASE_URL}/gsp/tax-payer/${req.query.gstin}/gstrs/gstr-3b/${req.query.year}/${req.query.month}/submit`, req.body.payload, {
            headers: {
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            }
        }).then((result) => {
            if (result.status === 200) {
                return res.status(200).json({
                    status: "success",
                    message: result.data["data"]
                })
            } else {
                return next(ApiError.badRequest(result.data["message"]))
            }
        }).catch((error) => {
            if (error.response) {
                if (error.response.status !== 500) {
                    return next(ApiError.internalServerError(error.response.data["message"] === undefined ? `Sandbox error ${error}` : error.response.data["message"]))
                }
            }
            return next(ApiError.internalServerError(`Sandbox error ${error}`))
        })
    }

    gstr2aB2B = async (req, res, next) => {
        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.get(`${process.env.SANDBOX_BASE_URL}/gsp/tax-payer/${req.query.gstin}/gstrs/gstr-2a/b2b/${req.query.year}/${req.query.month}?ctin=${req.query.ctin}`, {
            headers: {
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            }
        }).then((result) => {
            if (result.status === 200) {
                return res.status(200).json({
                    status: "success",
                    message: result.data["data"]
                })
            } else {
                return next(ApiError.badRequest(result.data["message"]))
            }
        }).catch((error) => {
            console.log(error.response.data)
            if (error.response) {
                if (error.response.status !== 500) {
                    return next(ApiError.internalServerError(error.response.data["message"] === undefined ? `Sandbox error ${error.response.data["message"]}` : error.response.data["message"]))
                } else
                    return next(ApiError.internalServerError(`Sandbox error ${error.response.data["message"]}`))
            }
            return next(ApiError.internalServerError(`Sandbox error ${error}`))
        })
    }

    gstr2aB2BA = async (req, res, next) => {
        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.get(`${process.env.SANDBOX_BASE_URL}/gsp/tax-payer/${req.query.gstin}/gstrs/gstr-2a/b2ba/${req.query.year}/${req.query.month}?ctin=${req.query.ctin}`, {
            headers: {
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            }
        }).then((result) => {
            if (result.status === 200) {
                return res.status(200).json({
                    status: "success",
                    message: result.data["data"]
                })
            } else {
                return next(ApiError.badRequest(result.data["message"]))
            }
        }).catch((error) => {
            console.log(error.response.data)
            if (error.response) {
                if (error.response.status !== 500) {
                    return next(ApiError.internalServerError(error.response.data["message"] === undefined ? `Sandbox error ${error.response.data["message"]}` : error.response.data["message"]))
                } else
                    return next(ApiError.internalServerError(`Sandbox error ${error.response.data["message"]}`))
            }
            return next(ApiError.internalServerError(`Sandbox error ${error}`))
        })
    }

    gstr2aCDN = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-2a/cdn/${req.query.year}/${req.query.month}?ctin=${req.query.ctin}`)
    gstr2aCDNA = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-2a/cdna/${req.query.year}/${req.query.month}?ctin=${req.query.ctin}`)
    gstr2aISD = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-2a/isd/${req.query.year}/${req.query.month}?ctin=${req.query.ctin}`)
    gstr2a = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-2a/${req.query.year}/${req.query.month}`)

    gstr1AT = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-1/at/${req.query.year}/${req.query.month}`)
    gstr1ATA = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-1/ata/${req.query.year}/${req.query.month}`)
    gstr1B2B = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-1/b2b/${req.query.year}/${req.query.month}?ctin=${req.query.ctin}&action_required=${req.query.filter}&from=${req.query.from}`)
    gstr1B2BA = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-1/b2ba/${req.query.year}/${req.query.month}?ctin=${req.query.ctin}&action_required=${req.query.filter}&from=${req.query.from}`)
    gstr1B2CL = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-1/b2cl/${req.query.year}/${req.query.month}?state_code=${req.query.state_code}`)
    gstr1B2CLA = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-1/b2cla/${req.query.year}/${req.query.month}?state_code=${req.query.state_code}`)
    gstr1B2CS = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-1/b2cs/${req.query.year}/${req.query.month}`)
    gstr1B2CSA = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-1/b2csa/${req.query.year}/${req.query.month}`)
    gstr1CDNR = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-1/cdnr/${req.query.year}/${req.query.month}?action_required=${req.query.filter}&from=${req.query.from}`)
    gstr1CDNRA = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-1/cdnra/${req.query.year}/${req.query.month}?action_required=${req.query.filter}&from=${req.query.from}`)
    gstr1CDNUR = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-1/cdnur/${req.query.year}/${req.query.month}`)
    gstr1CDNURA = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-1/cdnura/${req.query.year}/${req.query.month}`)
    gstr1DocIssue = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-1/doc-issue/${req.query.year}/${req.query.month}`)
    gstr1Exp = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-1/exp/${req.query.year}/${req.query.month}`)
    gstr1Expa = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-1/expa/${req.query.year}/${req.query.month}`)
    gstr1Summary = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-1/${req.query.year}/${req.query.month}`)
    gstr1HSN = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-1/hsn/${req.query.year}/${req.query.month}`)
    gstr1NIL = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/gstrs/gstr-1/nil/${req.query.year}/${req.query.month}`)
    gstr1GenerateEvc = (req, res, next) => invokeAPICCall(req, res, next, `gsp/tax-payer/${req.query.gstin}/GSTR-1/evc/otp?pan=${req.query.authorized_signatory_pan}`)

    uploadGSTR1 = async (req, res, next) => {
        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.post(`${process.env.SANDBOX_BASE_URL}/gsp/tax-payer/${req.body.gstin}/gstrs/gstr-1/${req.body.year}/${req.body.month}`, req.body.payload, {
            headers: {
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            }
        }).then((result) => {
            if (result.status === 200) {
                return res.status(200).json({
                    status: "success",
                    message: result.data["data"]
                })
            } else {
                return next(ApiError.badRequest(result.data["message"]))
            }
        }).catch((error) => {
            console.log(error.response.data)
            if (error.response) {
                if (error.response.status !== 500) {
                    return next(ApiError.internalServerError(error.response.data["message"] === undefined ? `Sandbox error ${error.response.data["message"]}` : error.response.data["message"]))
                } else
                    return next(ApiError.internalServerError(`Sandbox error ${error.response.data["message"]}`))
            }
            return next(ApiError.internalServerError(`Sandbox error ${error}`))
        })
    }

    submitGSTR1 = async (req, res, next) => {
        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.post(`${process.env.SANDBOX_BASE_URL}/gsp/tax-payer/${req.body.gstin}/gstrs/gstr-1/${req.body.year}/${req.body.month}/submit`, req.body.payload, {
            headers: {
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            }
        }).then((result) => {
            if (result.status === 200) {
                return res.status(200).json({
                    status: "success",
                    message: result.data["data"]
                })
            } else {
                return next(ApiError.badRequest(result.data["message"]))
            }
        }).catch((error) => {
            console.log(error.response.data)
            if (error.response) {
                if (error.response.status !== 500) {
                    return next(ApiError.internalServerError(error.response.data["message"] === undefined ? `Sandbox error ${error.response.data["message"]}` : error.response.data["message"]))
                } else
                    return next(ApiError.internalServerError(`Sandbox error ${error.response.data["message"]}`))
            }
            return next(ApiError.internalServerError(`Sandbox error ${error}`))
        })
    }


    fileGSTR1 = async (req, res, next) => {
        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.post(`${process.env.SANDBOX_BASE_URL}/gsp/tax-payer/${req.body.gstin}/gstrs/gstr-1/${req.body.year}/${req.body.month}/file?pan=${req.body.authorized_signatory_pan}&otp=${req.body.otp}`, req.body.payload, {
            headers: {
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            }
        }).then((result) => {
            if (result.status === 200) {
                return res.status(200).json({
                    status: "success",
                    message: result.data["data"]
                })
            } else {
                return next(ApiError.badRequest(result.data["message"]))
            }
        }).catch((error) => {
            console.log(error.response.data)
            if (error.response) {
                if (error.response.status !== 500) {
                    return next(ApiError.internalServerError(error.response.data["message"] === undefined ? `Sandbox error ${error.response.data["message"]}` : error.response.data["message"]))
                } else
                    return next(ApiError.internalServerError(`Sandbox error ${error.response.data["message"]}`))
            }
            return next(ApiError.internalServerError(`Sandbox error ${error}`))
        })
    }
    saveGstSearch = async (req, res, next) => {
        var token = req.header('authorization')
        if (!token) {
            var result = new GSTSearch(req.body);
            result.save().then((result) => {
                if (result) {
                    return res.status(200).json({
                        status: "success",
                        message: "GSTIN saved successfully"
                    })
                } else {
                    return next(ApiError.internalServerError("Error while saving GSTIN"))
                }
            }).catch((error) => {
                if (error.parent.code == "ER_DUP_ENTRY") {
                    return res.status(200).json({
                        status: "success",
                        message: "GSTIN saved successfully",
                        data: error.parent.code
                    })
                }
                return next(ApiError.internalServerError(error))
            })

        } else {
            return ApiError.unAuthorized("Invalid token");
        }



    }
}

invokeAPICCall = async (req, res, next, endPoint) => {
    let token = await sandboxUtil.getSandboxAuthToken()
    await axios.get(`${process.env.SANDBOX_BASE_URL}/${endPoint}`, {
        headers: {
            accept: 'application/json',
            'x-api-key': process.env.SANDBOX_KEY,
            'Authorization': token,
            'x-api-version': process.env.SANDBOX_API_VERSION,
        }
    }).then((result) => {
        console.log("result::::", result);
        if (result.status === 200) {
            return res.status(200).json({
                status: "success",
                message: result.data["data"]
            })
        } else {
            return next(ApiError.badRequest(result.data["message"]))
        }
    }).catch((error) => {
        console.log("catch error:", error)
        if (error.response) {
            if (error.response.status !== 500) {
                return next(ApiError.internalServerError(error.response.data["message"] === undefined ? `Sandbox error ${error.response.data["message"]}` : error.response.data["message"]))
            } else
                return next(ApiError.internalServerError(`Sandbox error ${error.response.data["message"]}`))
        }
        return next(ApiError.internalServerError(`Sandbox error ${error}`))
    })
}

module.exports = new GstinController();