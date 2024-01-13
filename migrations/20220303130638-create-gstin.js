'use strict';
const {Model} = require("sequelize");
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('gstins', {
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
                type: DataTypes.UUID,
                unique: false,
                allowNull: false,
                references:{
                    model:'users',
                    key:'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            sessionExpiry: {
                type: DataTypes.BIGINT,
                allowNull: true
            },
            tokenExpiry: {
                type: DataTypes.BIGINT,
                allowNull: true
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('gstins');
    }
};