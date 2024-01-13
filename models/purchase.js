'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Purchase extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.GSTIN, {
                foreignKey: 'PurchaseId',
                // as: 'GSTIN'
            })

        }
    }

    Purchase.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        supplier: {
            type: DataTypes.STRING,
            // unique: true,
            allowNull: false,
            // validate: {
            //     isEmail: {
            //         msg: "please enter valid email address"
            //     },
            //     notNull: {
            //         msg: "please enter email address"
            //     }
            // }
        },
        branch: {
            type: DataTypes.STRING,
            allowNull: false,
            // unique: false,
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false,
            // validate: {
            //     isAlphanumeric: true,
            //     notNull: {
            //         msg: "please enter Purchasename"
            //     }
            // }
        },
        shippingAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        referenceNo: {
            type: DataTypes.STRING(1234),
            allowNull: false,
        },
        lcNo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cnfAgent: {
            type: DataTypes.STRING,
            allowNull: false
        },
        discount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        discountType: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'percent'
        },
        product: {
            type: DataTypes.STRING,

            allowNull: false
        },
        paymentType: {
            type: DataTypes.STRING,
     
            allowNull: false
        },
        ammount: {
            type: DataTypes.DOUBLE,
            
            allowNull: false
        },
        //         created_at: {
        //             type: Sequelize.DATE, 
        //   defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        //         }
    }, {
        sequelize,
        tableName: 'Purchases',
        modelName: 'Purchase',

    });
    return Purchase;
};