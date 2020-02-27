const Sequelize = require('sequelize');
const { dialect, host, username, password, database, storage } = require('../config/database');

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: dialect,
  storage: storage
});

module.exports = sequelize;