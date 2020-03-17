const Sequelize = require('sequelize')
const sequelizeConfig = require('../config/database'); // instancia de conexão com o banco de dados

const Log = sequelizeConfig.import('./Log.js')
const User = sequelizeConfig.import('./User.js')

User.hasMany(Log)
Log.belongsTo(User)

module.exports = { User, Log, sequelizeConfig }