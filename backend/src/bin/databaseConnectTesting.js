const path = require('path')
const database = path.resolve('src/config/database.js')
const sequelize = require(database);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });