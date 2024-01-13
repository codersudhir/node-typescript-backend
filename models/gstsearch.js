'use strict';
const {
    Model
} = require('sequelize');

var Sequelize=require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class GSTSearch extends Model {
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

    GSTSearch.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        GSTNo: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        },
        search_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
        },
       
    }, {
        sequelize,
        tableName: 'GSTSearch', 
        modelName: 'GSTSearch',
     
    });
    return GSTSearch;
};
