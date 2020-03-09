const path = require('path')
const modelUser = path.resolve('src/models/User')
const modelLog = path.resolve('src/models/Log')
const { User } = require(modelUser);
const { Log } = require(modelLog);

const models = [User, /* Log */];

for(let i = 0; i < models.length; i++) {
  models[i].sync({ alter: true })
    .then(() => console.log('Database synced on ' + process.env.NODE_ENV + ' mode'))
}