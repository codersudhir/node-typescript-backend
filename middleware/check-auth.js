const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { User} = require('../models');
dotenv.config();

module.exports = (req, res, next) => {
    try {
        var token = req.header('authorization')
        var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const buff = new Buffer(base64, 'base64');
    const payloadinit = buff.toString('ascii');
    const payload = JSON.parse(payloadinit);
    const user=User.findByPk(payload.id);
    if(!user){
        return res.status(401).json({
            status: "failed",
            message: 'invalid auth token user'
        });
    }
        // const token = req.headers.authorization.split(" ")[1];
        // req.user = jwt.verify(token, process.env.JWT_KEY);
        // if (req.user.environment !== process.env.NODE_ENV){
        //     return res.status(401).json({
        //         status: "failed",
        //         message: 'invalid auth token environment'
        //     });
        // }
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            status: "failed",
            message: 'invalid auth token',
            error: error
        });
    }
};
