'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('config', {
      key: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      value: {
        type: DataTypes.TEXT,
        unique: false,
        allowNull: true,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('config');
  }
};