// 'use strict';
// const {
//     Model
// } = require('sequelize');

// module.exports = (sequelize, DataTypes) => {
//     class Invoice extends Model {
//         /**
//          * Helper method for defining associations.
//          * This method is not a part of Sequelize lifecycle.
//          * The `models/index` file will call this method automatically.
//          */
//         static associate({User}) {
//             this.belongsTo(User,{

//                 foreignKey: 'user_id',
//                 targetKey: 'id',
//                 onDelete: 'CASCADE',
//                 onUpdate: 'CASCADE'
//             })
//         }
//     }

//     Invoice.init({
//         id: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true
//         },
//         serial_no: {
//             type: DataTypes.INTEGER,
//             unique: true,
//             allowNull: false
//         },
//         user_id: {
//             type: DataTypes.INTEGER,
//             // unique: true,
//             allowNull: false
//         },
//         seller_address: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         from_no: {
//             type: DataTypes.STRING,
//             allowNull: false,

//         },
//         tax_invoice: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         party_id: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         name: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         party_address: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         mobile: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         email_id: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         invoice_no: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         date: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         goods: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         hsn_code: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         quantity: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//         },
//         rate: {
//             type: DataTypes.DOUBLE,
//             allowNull: false,
//         },
//         ammount: {
//             type: DataTypes.DOUBLE,
//             allowNull: false,
//         },
//     }, {
//         sequelize,
//         tableName: 'invoice',
//         modelName: 'Invoice',

//     });
//     return Invoice;
// };

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Party extends Model {}
    Party.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            type: {
                type: DataTypes.STRING,
            },
            name: {
                type: DataTypes.STRING,
            },
            phoneNumber: {
                type: DataTypes.STRING,
            },
            gstin: {
                type: DataTypes.STRING,
            },
            userId: {
                type: DataTypes.UUID,
            },
        },
        {
            sequelize,
            // tableName: 'parties',
            modelName: 'Party',
        }
    );

    return Party;
};
