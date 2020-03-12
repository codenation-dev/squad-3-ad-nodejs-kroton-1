const { User } = require('./User');
const { Log } = require('./Log');

User.hasMany(Log)
Log.belongsTo(User)

module.exports = { User, Log }