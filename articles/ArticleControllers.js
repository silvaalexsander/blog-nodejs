const express = require('express');
const router = require('express').Router();
const Category = require('../categories/Category');
const Article = require('./Article')
const slugify = require('slugify');

//rota para exibir todos os artigos
router.get('/articles', (req, res)=>{
    Article.findAll({
        include: [{model: Category}]
    }).then(articles=>{
        res.render('admin/articles', {articles: articles});
    })
});


//rota para exibir o formulário de criação de artigos
router.get('/admin/articles/new', (req, res)=>{
    Category.findAll().then(categories=>{
        res.render('admin/articles/new', {categories: categories});
    })
});

//rota para salvar o artigo no banco de dados
router.post('/articles/save', (req, res)=>{
    const body = req.body.body
    const category = req.body.category
    const title = req.body.title

    if((body != '' && body != undefined) && (category != '' && category != undefined) && (title != '' && title != undefined)){
        Article.create({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: category
        }).then(()=>{
            res.redirect('/articles');
        })}else{
            res.redirect('/admin/articles/new');
        }
})

//rota para deletar um artigo
router.post('/admin/article/delete', (req, res)=>{
    const id = req.body.id
    if(id != undefined && !isNaN(id)){
        Article.destroy({
            where: {
                id: id
            }
        }).then(()=>{
            res.redirect('/articles');
        })
    }else{
        res.redirect('/articles');
    }
})

//rota para editar um artigo
router.get('/articles/edit/:id', (req, res) =>{
    const id = req.params.id
    Article.findByPk(id).then(article=>{
        if(article != undefined){
            Category.findAll().then(categories=>{
                res.render('admin/articles/edit', {categories: categories, article: article});
            })
        }else{
            res.redirect('/articles');
        }
    }).catch(erro=>{
        res.redirect('/articles');
    })
})

//rota para atualizar um artigo no banco de dados
router.post('/articles/update', (req, res)=>{
    const id = req.body.id
    const title = req.body.title
    const body = req.body.body
    const category = req.body.category

    if((title != undefined && title != '') && (body != undefined && body != '') && (category != undefined && category != '')){
        Article.update({title: title, body: body, slug: slugify(title), categoryId: category}, {
            where: {
                id: id
            }
        }).then(()=>{
            res.redirect('/articles');
        }).catch(erro=>{
            res.redirect('/articles');
        })
    }else{
        res.redirect('/articles/edit/' + id);
    }
})



router.get('/admin/articles', (req, res)=>{
    Article.findAll({
        include: [{model: Category}],
        order: [['id', 'DESC']]
    }).then(article=>{
        res.render('admin/articles/adminarticles', {articles: article});
    })
})

router.post('/admin/articles/delete', (req, res)=>{
    const id = req.body.id
    if(id != undefined && !isNaN(id)){
        Article.destroy({
            where: {
                id: id
            }
        }).then(()=>{
            res.redirect('/admin/articles');
        })}else{
            res.redirect('/admin/articles');
        }
})

router.get('/articles/page/:num', (req, res) =>{
    const page = req.params.num
    if(isNaN(page) || page == 1){
        offset = 0
    }else{
        offset = (parseInt(page)) * 2
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
    }).then(articles=>{
        if(offset + 4 >= articles.count){
            next = false
        }else{
            next = true
        }
        const result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }
        res.json(result)
    })
})

module.exports = router;