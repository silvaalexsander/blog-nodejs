const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category');

const Article = connection.define('articles', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    }, slug:{
        type: Sequelize.STRING,
        allowNull: false
    }, body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
})


//Criando um relacionamento 1-N entre Category e Article
Category.hasMany(Article);

//Criando um relacionamento 1-1 entre Article e Category
Article.belongsTo(Category);
//Article.sync({force: false})


module.exports = Article;