const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Item extends Model {
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

    Item.init(
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
            description: {
                type: DataTypes.TEXT,
            },
            unit: {
                type: DataTypes.STRING,
            },
            salePrice: {
                type: DataTypes.DECIMAL,
            },
            purchasePrice: {
                type: DataTypes.DECIMAL,
            },
            taxExempted: {
                type: DataTypes.BOOLEAN,
            },
            openingStock: {
                type: DataTypes.INTEGER,
            },
            lowStock: {
                type: DataTypes.INTEGER,
            },
            hsnCode: {
                type: DataTypes.STRING,
            },
            gstPercentage: {
                type: DataTypes.DECIMAL,
            },
            userId: {
                type: DataTypes.UUID,
            },
        },
        {
            sequelize,
            // tableName: 'item',
            modelName: 'Item',
        }
    );

    return Item;
};
