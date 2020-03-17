const Sequelize = require('sequelize');
const sequelizeConfig = require('../config/database');

const User = sequelizeConfig.define('User', {
  username: {
    primaryKey: true,
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [5, 10]
    }
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = { User };