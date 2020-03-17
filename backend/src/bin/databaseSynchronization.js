const { sequelizeConfig } = require('../models')

sequelizeConfig
  .sync({ alter: true })
  .then(() => console.log('Database synced on ' + process.env.NODE_ENV + ' mode'))