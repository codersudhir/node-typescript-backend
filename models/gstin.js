'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class GSTIN extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({User}) {
            this.belongsTo(User,{
                as: 'user',
                foreignKey: 'userId',
                targetKey: 'id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
        }
    }

    GSTIN.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUID4,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        number: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false
        },
        sessionExpiry: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        tokenExpiry: {
            type: DataTypes.BIGINT,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'gstins',
        modelName: 'GSTIN',
        timestamps: false
    });
    return GSTIN;
};