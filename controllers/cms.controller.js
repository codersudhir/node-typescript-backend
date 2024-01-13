
var cards = require('../config/cards.json');
const jwt = require('jsonwebtoken');
const { User, UserProfile, UserBusinessProfile, Customer } = require('../models');
const ApiError = require('../errors/ApiError');
class cmsController {
    getHomeScreen = async (req, res, next) => {
        res.status(200).json({
            status: "success",

            data: cards.home
        });
    };


    updateMainHeading = async (req, res, next) => {
        var token = req.header('authorization')
        if (token) {
            const fs = require('fs');
            const fileName = '../config/cards.json';
            const file = require(fileName);
            const newheading = req.body.mainHeading;
            file.home.upper.mainHeading = newheading;

            fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
                if (err) return console.log(err);
                console.log(JSON.stringify(file));
                console.log('writing to ' + fileName);
            });
            res.status(200).json({
                status: "success",

                data: cards.home
            });
        } else {
            return next(ApiError.unAuthorized("invalid credentials"))
        }
    };

    updateSubHeading = async (req, res, next) => {
        var token = req.header('authorization')
        if (token) {
            const fs = require('fs');
            const fileName = '../config/cards.json';
            const file = require(fileName);
            const newheading = req.body.subHeading;
            file.home.upper.subHeading = newheading;

            fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
                if (err) return console.log(err);
                console.log(JSON.stringify(file));
                console.log('writing to ' + fileName);
            });
            res.status(200).json({
                status: "success",

                data: cards.home
            });
        } else {
            return next(ApiError.unAuthorized("invalid credentials"))
        }
    };

    updateButton = async (req, res, next) => {
        var token = req.header('authorization')
        if (token) {
            const fs = require('fs');
            const fileName = '../config/cards.json';
            const file = require(fileName);
            const newheading = req.body.button;
            file.home.upper.button = newheading;

            fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
                if (err) return console.log(err);
                console.log(JSON.stringify(file));
                console.log('writing to ' + fileName);
            });
            res.status(200).json({
                status: "success",

                data: cards.home
            });
        } else {
            return next(ApiError.unAuthorized("invalid credentials"))
        }
    };

    updateNavcard = async (req, res, next) => {
        var token = req.header('authorization')
        if (token) {
            const fs = require('fs');
            const fileName = '../config/cards.json';
            const file = require(fileName);
            const newheading = req.body.navcards;
            file.home.navcards = newheading;

            fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
                if (err) return console.log(err);
                console.log(JSON.stringify(file));
                console.log('writing to ' + fileName);
            });
            res.status(200).json({
                status: "success",

                data: cards.home
            });
        } else {
            return next(ApiError.unAuthorized("invalid credentials"))
        }
    };

    getUsercount = async (req, res, next) => {
        const count = await User.count();
        console.log(count);
        res.status(200).json({
            status: "success",
            count: count
        });
    }

    getUserProfile = async (req, res, next) => {
        const token = req.header('authorization');
        if (token) {
            const { id: _id } = req.query;
            // console.log(req.query,"prm");
            if (_id == undefined) {
                return next(ApiError.badRequest("id is missing"));
            }
            var payload = decodeToken(token);
            console.log(payload, "payload");
            if (payload.userType == "admin") {
                const result = await User.findOne({ where: { id: _id } });
                if (result == null) {
                    return next(ApiError.badRequest("user not found"));
                }
                var response = {
                    id: result['dataValues']['id'],
                    email: result['dataValues']['email'],
                    first_name: result['dataValues']['first_name'],
                    last_name: result['dataValues']['last_name'],
                    userType: result['dataValues']['userType'],
                    phone: result['dataValues']['phone'],
                    pincode: result['dataValues']['pincode'],
                    isverified: result['dataValues']['isverified'],
                };
                const userprof = await UserProfile.findOne({ where: { user_id: _id } });
                if (userprof != null) {
                    response['pan'] = userprof['dataValues']['pan'];
                    response['address'] = userprof['dataValues']['address'];
                    response['aadhar'] = userprof['dataValues']['aadhar'];
                    response['dob'] = userprof['dataValues']['dob'];
                    response['profile_pic'] = userprof['dataValues']['profile_pic'];
                    response['address'] = userprof['dataValues']['address'];
                    // response['city']=userprof['dataValues']['city'];
                    // response['state']=userprof['dataValues']['state'];
                    // response['country']=userprof['dataValues']['country'];
                }
                const businessProf = await UserBusinessProfile.findOne({ where: { user_id: _id } });
                if (businessProf != null) {
                    response['businessName'] = businessProf['dataValues']['businessName'];
                    response['bankAccountNo'] = businessProf['dataValues']['bankAccountNo'];
                    response['companyPanNo'] = businessProf['dataValues']['companyPanNo'];
                    response['companyTanNo'] = businessProf['dataValues']['companyTanNo'];
                    response['msmeNo'] = businessProf['dataValues']['msmeNo'];
                    response['gstNo'] = businessProf['dataValues']['gstNo'];
                    response['secondMob'] = businessProf['dataValues']['secondMob'];
                    response['secondEmail'] = businessProf['dataValues']['secondEmail'];
                    response['address'] = businessProf['dataValues']['address'];
                }
                res.status(200).json({
                    status: "success",
                    data: response
                });
            }
            else
                return next(ApiError.unAuthorized("invalid credentials"));

        }
        else
            return next(ApiError.unAuthorized("invalid credentials"))

    }

    createCustomer = async (req, res, next) => {
        const token = req.header('authorization');
        if (token) {
            try {
                var payload = decodeToken(token);
                var customer = new Customer(req.body);
                customer.userId = payload.id;
                customer.save().then((result) => {
                    res.status(200).json({
                        status: "success",
                        message: "customer created successfully",
                        data: result
                    });
                    // console.log(result);
                }).catch((err) => {

                    return next(ApiError.badRequest(err.message));

                });



            } catch (error) {
                return next(ApiError.badRequest(error.message));
            }
        } else {
            return next(ApiError.unAuthorized("invalid credentials"))
        }
    }
    updateCustomer = async (req, res, next) => {
        const token = req.header('authorization');
        console.log(req.body);
        if (token) {
            try {
                var payload = decodeToken(token);
                if(payload.id!=req.body.userId){
                    return next(ApiError.badRequest("invalid user"));
                }
                if(req.body.id==undefined){
                    return next(ApiError.badRequest("customer id is missing"));
                }
               Customer.findOne({
                    where: {
                        id: req.body.id
                    }
                }).then((customer) => {
                    if(customer==null){
                        return next(ApiError.badRequest("customer not found"));
                    }
                    customer.update(req.body).then((result) => {
                        res.status(200).json({
                            status: "success",
                            message: "customer updated successfully",
                            result: result
                        });}).catch((err) => {
    
                            return next(ApiError.badRequest(err.message));
                        });
                }).catch((err) => {
                        
                        return next(ApiError.badRequest(err.message));
    
                    });
                
           
           
            } catch (error) {
                console.log(error);
                return next(ApiError.badRequest(error.message));
            }
        } else {
            return next(ApiError.unAuthorized("invalid credentials"))
        }
    }
    getCustomerList = async (req, res, next) => {
        const token = req.header('authorization');
        if (token) {
            try {
                var payload = decodeToken(token);
                if(req.query.page== undefined){
                    req.query.page=0;}
                Customer.findAndCountAll({
                    limit: 10,
                    offset: req.query.page*10,
                    // attributes: ['id', 'email', 'first_name', 'last_name', 'phone', 'pincode', 'isverified', 'createdAt', 'updatedAt','userType'  ],
                    where: {
                        userId: payload.id
                    },
                }).then((result) => {
                    const response = getPagingData(result, req.query.page, 10);
                    return res.send(response);
                }).catch((err) => {
                    return next(ApiError.badRequest(err.message));
                });
                
            } catch (error) {
                return next(ApiError.badRequest(error.message));
            }
        } else {
            return next(ApiError.unAuthorized("invalid credentials"))
        }
    }
    getCustomerById = async (req, res, next) => {
        const token = req.header('authorization');
        if (token) {
            try {
                var payload = decodeToken(token);
                if(req.query.id== undefined){
                    return next(ApiError.badRequest("customer id is missing"));
                }
                Customer.findOne({
                    where: {
                        id: req.query.id
                    }
                }).then((result) => {
                    if(result==null){
                        return next(ApiError.badRequest("customer not found"));
                    }
                    return res.status(200).json({
                        status: "success",
                        data: result
                        });
                }
                ).catch((err) => {
                    return next(ApiError.badRequest(err.message));
                }
                );
            } catch (error) {
                return next(ApiError.badRequest(error.message));
            }
        } else {
            return next(ApiError.unAuthorized("invalid credentials"))
        }}

}
decodeToken = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const buff = new Buffer(base64, 'base64');
    const payloadinit = buff.toString('ascii');
    const payload = JSON.parse(payloadinit);
    return payload;
}
const getPagingData = (result, page, limit) => {
    const { count: totalItems, rows: data } = result;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, data, totalPages, currentPage };
  };
module.exports = new cmsController();