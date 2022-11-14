const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./database/database');
const categoriesController = require('./categories/CategoriesControllers');
const articlesController = require('./articles/ArticleControllers');
const Article = require('./articles/Article');
const Category = require('./categories/Category');
const app = express();
const port = 8080;

// view engine é onde fica o html
app.set('view engine', 'ejs');
// body parser serve para pegar os dados do formulário
app.use(bodyParser.urlencoded({extended: false}));
// body parser.json é para pegar os dados do json
app.use(bodyParser.json());
// static é para pegar os arquivos estáticos como css, js, imagens
app.use(express.static('public'));

//conexão com o banco de dados
connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com sucesso');
    }).catch((error) => {
        console.log(error);
    })
    
// rota para a página inicial    
app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        include: [{model: Category}]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', {articles: articles, categories: categories});
        });
    });
})


//rota para ler os artigos
app.get('/:slug', (req, res)=>{
    const slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        },
    }).then(article=>{
        if(article != undefined){
           Category.findAll().then(categories=>{
                res.render('article', {article: article, categories: categories});
           })
        }else{
            res.redirect('/');
        }
    }).catch(err=>{
        res.redirect('/');
    })
})

app.get('/category/:slug', (req, res)=>{
    const slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category=>{
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render('index', {articles: category.articles, categories: categories});
            });
        }else{
            res.redirect('/');
        }
    }).catch(err=>{
        res.redirect('/');
    })
})


// rota de categoria
app.use('/', categoriesController);
// rota de artigo
app.use('/', articlesController);

app.listen(port, ()=>{
    console.log(`Example app listening at http://localhost:${port}`);
})