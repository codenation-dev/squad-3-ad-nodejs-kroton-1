const path = require('path')
const databaseConfig = path.resolve('src/config/database')
const Sequelize = require('sequelize');
const sequelizeConfig = require(databaseConfig);

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