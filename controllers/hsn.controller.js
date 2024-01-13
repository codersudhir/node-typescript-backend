const { Hsn } = require('../models');
const { Sac } = require('../models');
const uuid = require('uuid');
const bCrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { Op } = require("sequelize");
const ApiError = require('../errors/ApiError');

class HsnController {
  getHsnCode = async (req, res, next) => {
   
    Hsn.findOne({
        

        
            where: { id: req.body.id }
        
    }).then((result) => {
      
        if (result) {
            return res.status(200).json({
                status: true,
                message: "hsn code",
                data: result
            })
        } else {
            return next(ApiError.badRequest("failed to get hsn code"))
        }
    }).catch((error) => {
        console.log(`catch block ${error}`)
        if (error)
            return next(ApiError.conflict(error));
        else
            return next(ApiError.internalServerError(error))
    });
 }

 getSacCode = async (req, res, next) => {
    
    Sac.findOne({
        

        
            where: { id: req.body.id }
        
    }).then((result) => {
       
        if (result) {
            return res.status(200).json({
                status: true,
                message: "Sac code",
                data: result
            })
        } else {
            return next(ApiError.badRequest("failed to get hsn code"))
        }
    }).catch((error) => {
        console.log(`catch block ${error}`)
        if (error)
            return next(ApiError.conflict(error));
        else
            return next(ApiError.internalServerError(error))
    });
 }

 getHsnAll = async (req, res, next) => {
   
    Hsn.findAll({
        

        
            //where: { id: req.body.id }
        
    }).then((result) => {
      
        if (result) {
            return res.status(200).json({
                status: true,
                message: "hsn code",
                data: result
            })
        } else {
            return next(ApiError.badRequest("failed to get hsn code"))
        }
    }).catch((error) => {
        console.log(`catch block ${error}`)
        if (error)
            return next(ApiError.conflict(error));
        else
            return next(ApiError.internalServerError(error))
    });
 }

 getSacAll = async (req, res, next) => {
    
    Sac.findAll({
        

        
           // where: { id: req.body.id }
        
    }).then((result) => {
       
        if (result) {
            return res.status(200).json({
                status: true,
                message: "Sac code",
                data: result
            })
        } else {
            return next(ApiError.badRequest("failed to get hsn code"))
        }
    }).catch((error) => {
        console.log(`catch block ${error}`)
        if (error)
            return next(ApiError.conflict(error));
        else
            return next(ApiError.internalServerError(error))
    });
 }

}


module.exports = new HsnController();