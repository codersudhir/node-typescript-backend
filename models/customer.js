'use strict';
const {
    Model
} = require('sequelize');

var Sequelize=require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Customer extends Model {
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

    Customer.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false
        },
        fname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dob: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pan: {
            type: DataTypes.STRING,
            allowNull: false
        },
        aadhar: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
      
        businessName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        website: {
            type: DataTypes.STRING,
            allowNull: true
        },
        businessEmail: {
            type: DataTypes.STRING,
            allowNull: false
        },
        businessMobile: {
            type: DataTypes.STRING,
            allowNull: false
        },
        businessAddress: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        bankName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ifsc: {
            type: DataTypes.STRING,
            allowNull: false
        },
        bankAccountNo: {
            type: DataTypes.STRING,
            allowNull: false
        },
       
    }, {
        sequelize,
        tableName: 'customer', 
        modelName: 'Customer',
     
    });
    return Customer;
};
