var express = require('express');
var app = express()
var _ = require('underscore')
var bodyParser = require('body-parser')
var bcrypt = require('bcrypt')
var db = require('./db')
var middleware = require('./midlleware.js')(db)
var PORT = process.env.PORT || 3000

app.use(bodyParser.json())

app.get('/user/home', middleware.requireAuthentication, function (req, res) {
    res.send('home')
})

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
        res.json({
            data: user.toPublicJSON(),
            access_token: token
        })
    }, function () {
        res.status(401).send()
    })
})

db.sequelize.sync({force: true}).then(function () {
    console.log('DATABASE SYNCED')
})

app.listen(PORT, function () {
    console.log('START SERVER AT PORT: ' + PORT)
})


