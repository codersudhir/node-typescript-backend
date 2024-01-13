'use strict';
const {
    Model
} = require('sequelize');

var Sequelize=require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Sac extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        // static associate({User}) {
        //     this.belongsTo(User,{
               
        //         foreignKey: 'user_id',
        //         targetKey: 'id',
        //         onDelete: 'CASCADE',
        //         onUpdate: 'CASCADE'
        //     })
        // }
    }

    Sac.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        code: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
       
    }, {
        sequelize,
        tableName: 'sac',
        modelName: 'Sac',
     
    });
    return Sac;
};
