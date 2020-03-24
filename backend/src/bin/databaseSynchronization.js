const { sequelize } = require('../models')

sequelize
  .sync({ alter: true })
  .then(() => console.log('Database synced'))
