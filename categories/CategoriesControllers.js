const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');

//Rota para criar uma nova categoria
router.get('/admin/categories/new', (req, res)=>{
    res.render('admin/categories/new');
})

//Rota para salvar uma nova categoria
router.post('/categories/save', (req, res)=>{
    const title = req.body.title;
    if(title != undefined && title != ""){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(()=>{
            res.redirect('/admin/categories');
        })
    }
    else{
       res.redirect('/admin/categories/new');
    }
})


//Rota para editar as categorias
router.get('/admin/categories/edit/:id',(req, res)=>{
    const id = req.params.id
       if(isNaN(id)){
        res.redirect('/admin/categories');
    }
    Category.findByPk(id).then(category=>{
        if(category != undefined){
            res.render('admin/categories/edit', {category: category});
        }else{
            res.redirect('/admin/categories');
        }
    }).catch(erro=>{
        res.redirect('/admin/categories');
    })
})

//Rota que atualiza as categorias
router.post('/categories/update', (req, res)=>{
    const id = req.body.id
    const title = req.body.title

    Category.update({title: title, slug: slugify(title)}, {
        where: {
            id: id,
        }
    }).then(()=>{
        res.redirect('/admin/categories');
    })
})

//Exibir categorias cadastradas
router.get('/admin/categories', (req, res)=>{
    Category.findAll().then(categories=>{
        res.render('admin/categories/index', {categories: categories});
    })
})


//Rota para deletar uma categoria
router.post('/admin/categories/delete', (req, res)=>{
    const id = req.body.id

    if(id != undefined && !isNaN(id)){
        Category.destroy({
            where: {
                id: id
            }
        }).then(()=>{
            res.redirect('/admin/categories');
        })
    }else{
        res.redirect('/admin/categories');
    }
})

module.exports = router;