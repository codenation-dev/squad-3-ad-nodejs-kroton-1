const Sequelize = require('sequelize');
const sequelizeConfig = require('../config/database');

const Log = sequelizeConfig.define('Log', {
  log: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = { Log };