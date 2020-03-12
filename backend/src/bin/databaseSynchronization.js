require('module-alias/register')
const { User } = require('@models/User.js');
//const { Log } = require('../models/Log');

const models = [User, /* Log */];

for(let i = 0; i < models.length; i++) {
  models[i].sync({ alter: true })
    .then(() => console.log('Database synced on ' + process.env.NODE_ENV + ' mode'))
}