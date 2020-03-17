const { sequelize } = require('../models')

sequelize
  .sync({ alter: true })
  .then(() => console.log('Database synced on ' + process.env.NODE_ENV + ' mode'))