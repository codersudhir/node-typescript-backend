const axios = require('axios');
const sandboxUtil = require('../../utils/sandbox.util')
const ApiError = require('../../errors/ApiError')

class TaxController {
    cashItcBalance = async (req, res, next) => {
        
        if ( req.query.gstin === "" || req.query.gstin === undefined  || req.query.year === undefined || req.query.year === "" || req.query.month === undefined || req.query.month === "")
        return next(ApiError.badRequest(" query parameter  is missing"))
        
        let token = await sandboxUtil.getSandboxAuthToken()
        await axios.get(`${process.env.SANDBOX_BASE_URL}/gsp/tax-payer/${req.query.gstin}/ledgers/bal/${req.query.year}/${req.query.month}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            }
        }).then((result) => {
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
    }





    cashLedger = async (req, res, next) => {

        if (req.query.gstin === undefined || req.query.gstin === "")
            return next(ApiError.badRequest("query parameter is missing"))
         
        let token = await sandboxUtil.getSandboxAuthToken()
        console.log(token)
        await axios.get(`${process.env.SANDBOX_BASE_URL}/gsp/tax-payer/${req.query.gstin}/ledgers/cash`, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            },
            params: {
                   from: req.query.from,
                   to: req.query.to
            }
        }).then((result) => {
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
    }




    itcLedgers =async (req, res, next) => {
        if ( req.query.gstin === "" || req.query.gstin === undefined || req.query.from === undefined || req.query.from === "" || req.query.to === undefined || req.query.to ==="")
            return next(ApiError.badRequest(" query parameter  is missing"))

        let token = await sandboxUtil.getSandboxAuthToken()
        console.log(token)
        await axios.get(`${process.env.SANDBOX_BASE_URL}/gsp/tax-payer/${req.query.gstin}/ledgers/itc`, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.SANDBOX_KEY,
                'Authorization': token,
                'x-api-version': process.env.SANDBOX_API_VERSION,
            },
            params:{
                from:req.query.from,
                to:req.query.to ,
            }
        }).then((result) => {
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
    }

    tax_liability_ledger = async(req,res,next)=>{


        if ( req.query.gstin === "" || req.query.gstin === undefined || req.query.month === undefined || req.query.month === "" || req.query.year === undefined || req.query.year ==="")
        return next(ApiError.badRequest(" query parameter  is missing"))

    let token = await sandboxUtil.getSandboxAuthToken()
    console.log(token)
    await axios.get(`${process.env.SANDBOX_BASE_URL}/gsp/tax-payer/${req.query.gstin}/ledgers/tax/${req.query.year}/${req.query.month}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.SANDBOX_KEY,
            'Authorization': token,
            'x-api-version': process.env.SANDBOX_API_VERSION,
        }
    }).then((result) => {
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



    }


    other_Ledger = async(req,res,next)=>{

        
        if (req.query.gstin === "" || req.query.gstin === undefined || req.query.from === undefined || req.query.from === "" || req.query.to === undefined || req.query.to ==="" )
        return next(ApiError.badRequest(" query parameter  is missing"))

    let token = await sandboxUtil.getSandboxAuthToken()
    console.log(token)
    await axios.get(`${process.env.SANDBOX_BASE_URL}/gsp/tax-payer/${req.query.gstin}/ledgers/other`, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.SANDBOX_KEY,
            'Authorization': token,
            'x-api-version': process.env.SANDBOX_API_VERSION,
        },
        params:{
            from:req.query.from,
            to:req.query.to ,
        }
    }).then((result) => {
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

    }


     return_related_liability_balance  = async(req,res,next)=>{


        
        if ( req.query.gstin === "" || req.query.gstin === undefined || req.query.month === undefined || req.query.month === "" || req.query.year === undefined || req.query.year ==="" || req.query.gstr === "" || req.query.gstr === undefined )
        return next(ApiError.badRequest(" query parameter  is missing"))

    let token = await sandboxUtil.getSandboxAuthToken()
    console.log(token)
    await axios.get(`${process.env.SANDBOX_BASE_URL}/gsp/tax-payer/${req.query.gstin}/ledgers/${req.query.gstr}/liability/${req.query.year}/${req.query.month}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.SANDBOX_KEY,
            'Authorization': token,
            'x-api-version': process.env.SANDBOX_API_VERSION,
        }
    }).then((result) => {
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



     }
}
module.exports = new TaxController();