'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OTP extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
      
    }

    OTP.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        otp: DataTypes.STRING,
		expiration_time: DataTypes.DATE,
		verified: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: true
		},
       
    }, {
        sequelize,
        tableName: 'otp',
        modelName: 'OTP',
     
    });
    return OTP;
};
