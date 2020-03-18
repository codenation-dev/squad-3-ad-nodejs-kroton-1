const { sequelize } = require('../models')
console.log(process.env.NODE_ENV, "ESTA AQUIIIIII")
sequelize
  .sync({ alter: true })
  .then(() => console.log('Database synced on ' + process.env.NODE_ENV + ' mode'))