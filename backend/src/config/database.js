const Sequelize = require('sequelize')

/* ---- Teste!
const path = require('path')
path.resolve(__dirname, '../../.env' */

process.env.NODE_ENV === 'development' ? require('dotenv').config('.env') : console.log('server started in production environment')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  dialectOptions: {
    timezone: process.env.DB_TIMEZONE
  }
})

module.exports = { sequelize, Sequelize }
