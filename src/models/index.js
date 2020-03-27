const { sequelize, Sequelize } = require('../config/database')

const Log = require('./Log')(sequelize, Sequelize)
const User = require('./User')(sequelize, Sequelize)

User.hasMany(Log, {
  onDelete: 'restrict',
  onUpdate: 'restrict',
  foreignKey: {
    allowNull: false
  }
})
Log.belongsTo(User)

module.exports = { User, Log, sequelize }
