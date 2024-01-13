'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUID4,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate:{
          isEmail: {
            msg: "please enter valid email address"
          },
          notNull:{
            msg: "please enter email address"
          }
        }
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true,
        validate: {
          isAlphanumeric: true,
          notNull:{
            msg: "please enter username"
          }
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      profileImage: {
        type: DataTypes.STRING(1234),
        allowNull: true,
        defaultValue: "https://i.imgur.com/U1dxgda.png"
      },
      notificationToken: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      userType: {
        type: DataTypes.ENUM('Normal'),
        defaultValue: 'Normal',
        allowNull: false
      },
      socialID: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
      },
      loginVia: {
        type: DataTypes.ENUM('Email', 'Google', 'Facebook'),
        defaultValue: 'Email',
        allowNull: false
      },
      createdAt: {
        type: DataTypes.BIGINT,
        allowNull: false,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};