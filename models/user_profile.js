'use strict';
const {
    Model
} = require('sequelize');

var Sequelize=require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserProfile extends Model {
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

    UserProfile.init({
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
        pan: {
            type: DataTypes.STRING,
            allowNull: false
        },
        aadhar: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        dob: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false
        },
        profile_img: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        last_update: {
            type: Sequelize.DATE, 
  defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        sequelize,
        tableName: 'user_profiles',
        modelName: 'UserProfile',
        timestamps: false
    });
    return UserProfile;
};
