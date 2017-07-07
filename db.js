/**
 * Created by v.suos on 7/7/2017.
 */
var Sequelize = require('sequelize')
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/data/sven.sqlite'
})

var db = {}

db.user = sequelize.import(__dirname + '/model/user.js')

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db