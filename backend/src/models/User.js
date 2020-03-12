const Sequelize = require('sequelize');
const sequelizeConfig = require('../config/database');

const User = sequelizeConfig.define('User', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password_hash: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = { User };