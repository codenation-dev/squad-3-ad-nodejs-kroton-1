const Sequelize = require('sequelize');
const sequelizeConfig = require('../config/database');

const Log = sequelizeConfig.define('Log', {
  level: {
    type: Sequelize.ENUM,
    values: ['FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE', 'ALL', 'OFF'],
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  sender_application: {
    type: Sequelize.STRING,
    allowNull: false
  },
  send_date: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM,
    values: ['active', 'pending', 'deleted'],
    defaultValue: 'active',
    allowNull: false
  }

});

module.exports = { Log };