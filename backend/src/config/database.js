const path = require('path')
const Sequelize = require('sequelize');
const pathFileTest =  path.resolve('../../.env.test')
const pathFile =  path.resolve('.env')

require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? pathFileTest : '../../.env'});

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  dialectOptions: {
    timezone: process.env.DB_TIMEZONE
  },
  storage: process.env.DB_STORAGE
});

module.exports = sequelize;