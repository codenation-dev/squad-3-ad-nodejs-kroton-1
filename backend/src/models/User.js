const Sequelize = require('sequelize');
const sequelizeConfig = require('../config/database');

const User = sequelizeConfig.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    allowNull: false
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password_hash: Sequelize.STRING
});

module.exports = { User };