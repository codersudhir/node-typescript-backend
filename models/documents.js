'use strict';
const {
    Model
} = require('sequelize');

var Sequelize=require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserDocuments extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({User}) {
            this.belongsTo(User,{
               
                foreignKey: 'user_id',
                targetKey: 'id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
        }
    }

    UserDocuments.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        },
        fileName: {
            type: DataTypes.STRING,
            allowNull: false
        },
       
    }, {
        sequelize,
        tableName: 'user_profiles',
        modelName: 'UserDocuments',
     
    });
    return UserDocuments;
};
