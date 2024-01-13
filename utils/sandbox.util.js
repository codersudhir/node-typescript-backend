const axios = require('axios');
const {Config} = require('../models');
const jwt = require('jsonwebtoken');

exports.getSandboxAuthToken = async () => {
    let token = await fetchTokenFromDB();
    console.log(isTokenExpired(token),"token");
    if (token===null||isTokenExpired(token)) {
        await generateNewSandboxToken()
        token = fetchTokenFromDB()
    }
    return token
}

isTokenExpired = (token) => {
    let decoded = jwt.decode(token, {complete: true});
    let currentTimeStamp = Date.now() / 1000
    return decoded["payload"]["exp"] < currentTimeStamp;
}

generateNewSandboxToken = async () => {
    console.log("Generating new auth token...")
    await axios.post(`${process.env.SANDBOX_BASE_URL}/authenticate`, {}, {
        headers: {
            'x-api-key': process.env.SANDBOX_KEY,
            'x-api-secret': process.env.SANDBOX_SECRET,
            'x-api-version': process.env.SANDBOX_API_VERSION,
        }
    }).then(async (response) => {
        console.log(response,"generate token log");
        if (response.status === 200) {

            return await saveSandboxAuthToken(response.data["access_token"])
        } else {
            return response.data["message"];
        }
    }).catch((error) => {
        return "api_error";
    })
}

fetchTokenFromDB = async () => {
    return await Config.findOne({
        where: {
            key: process.env.SANDBOX_DB_CONFIG_KEY
        },
        attributes: ["key", "value"]
    }).then((config) => {
        if(config){
        return config["dataValues"]["value"];
        } else{
            return null;
        }
    })
}

saveSandboxAuthToken = async (token) => {
    
    return await Config.update({
        value: token
    }, {
        where: {
            key: process.env.SANDBOX_DB_CONFIG_KEY
        }
    })
}