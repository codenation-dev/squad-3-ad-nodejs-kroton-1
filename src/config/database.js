const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: process.env.DB_DIALECT,
  dialectOptions: { timezone: process.env.DB_TIMEZONE }
})

module.exports = { sequelize, Sequelize }
