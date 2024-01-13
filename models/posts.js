// 'use strict';
// const {
//   Model,
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Posts extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
      
//     }
//   }
//   Posts.init({
//     title: DataTypes.STRING,
//     content: DataTypes.TEXT,
//     imageUrl: DataTypes.STRING,
//     user_Id: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'Posts',
//   });
//   return Posts;
// };

'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
      
    }

    Post.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: DataTypes.INTEGER,
        title: DataTypes.STRING,
        content: DataTypes.TEXT,
        imageUrl: DataTypes.STRING
	
       
    }, {
        sequelize,
        tableName: 'Post',
        modelName: 'Post',
     
    });
    return Post;
};
