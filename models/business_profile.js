'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserBusinessProfile extends Model {
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

    UserBusinessProfile.init({
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
        // contactNo: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
            
        // },
        businessName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bankAccountNo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        companyPanNo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        companyTanNo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        msmeNo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gstNo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bandDetails: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        incorporateCertificate: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        tableName: 'business_profiles',
        modelName: 'UserBusinessProfile',
       
    });
    return UserBusinessProfile;
};