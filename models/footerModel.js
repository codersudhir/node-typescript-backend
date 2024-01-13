'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Footer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
      
    }

    Footer.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: DataTypes.INTEGER,
          data: DataTypes.STRING,
	
       
    }, {
        sequelize,
        tableName: 'Footer',
        modelName: 'Footer',
     
    });
    return Footer;
};