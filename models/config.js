'use strict';
const {
    Model
} = require('sequelize');
const {config} = require("dotenv");
module.exports = (sequelize, DataTypes) => {
    class Config extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    Config.init({
        key: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        value: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: true,
        }
    }, {
        sequelize,
        tableName: 'config',
        modelName: 'Config',
        timestamps: false
    });
    return Config;
};