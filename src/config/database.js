const Sequelize = require('sequelize')

require('dotenv').config('.env')
const database = process.env.DB_NAME
const username = process.env.DB_USERNAME
const password = process.env.DB_PASS

const sequelize = new Sequelize(database, username, password, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  dialectOptions: { timezone: process.env.DB_TIMEZONE }
})

module.exports = { sequelize, Sequelize }
