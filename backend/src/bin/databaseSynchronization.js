const models = require('../models')

for(key in  models) {
  models[key].sync({ alter: true })
    .then(() => console.log('Database synced on ' + process.env.NODE_ENV + ' mode'))
}