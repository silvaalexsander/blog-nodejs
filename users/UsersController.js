const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');

// router.get('/admin/users', (req, res) => {
//     res.send('Listagem de usuários');
// })

//rota para criar um usuario
router.get('/admin/users/create', (req, res) =>{
    res.render('admin/user/create');
})

//rota para salvar um usuario
router.post('/users/create', (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({where: {email: email}}).then(user => {
        if(user == undefined){
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            User.create({
            email: email,
            password: hash,
            }).then(() => {
                res.redirect('/user/login');
            })
        }else{
            res.redirect('/admin/users/create');
        }
    })
    
})

//rota para criar login
router.get('/user/login', (req, res) => {
    res.render('admin/user/login');
})

//rota para salvar login
router.post('/authenticate', (req, res) =>{
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({where: {email: email}}).then(user => {
        if(user != undefined){
            const correct = bcrypt.compareSync(password, user.password);
            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect('/admin/articles');
            }
        }else{
            res.redirect('/user/login');
        }
    })
})


//Exibe os usuarios
router.get('/admin/users', (req, res) =>{
    User.findAll().then(users => {
        res.render('admin/user/users', {users: users});
    });
})

//rota paa logout
router.get('/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/');
})

module.exports = router;