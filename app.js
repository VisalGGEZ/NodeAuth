var express = require('express');
var app = express()
var _ = require('underscore')
var bodyParser = require('body-parser')
var bcrypt = require('bcrypt')
var db = require('./db')
var PORT = process.env.PORT || 3000

app.use(bodyParser.json())

app.post('/user', function (req, res) {
    var body = _.pick(req.body, 'email', 'password')

    db.user.create(body)
        .then(function (user) {
            res.json(user.toPublicJSON())
        }, function (e) {
            res.json({
                message: e,
                result: 'fail'
            })
        })
})

app.post('/user/login', function (req, res) {
    var body = _.create(req.body, 'email', 'password')

    db.user.authenticate(body).then(function (user) {
        var token = user.generateToken('authentication')

        res.header('Auth', token).json(user.toPublicJSON())
    }, function () {
        res.status(401).send()
    })

    // db.user.findOne({
    //     where: {'email': body.email}
    // }).then(function (user) {
    //     if(!user || !bcrypt.compareSync(body.password, user.get('password_hash'))){
    //         return res.status(400).json({
    //             message: 'Password miss matched.'
    //         })
    //     }
    //
    //     res.status(200).json(user.toPublicJSON())
    // })
})

db.sequelize.sync({force: true}).then(function () {
    console.log('DATABASE SYNCED')
})

app.listen(PORT, function () {
    console.log('START SERVER AT PORT: ' + PORT)
})


