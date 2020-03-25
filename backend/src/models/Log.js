module.exports = (sequelize, Sequelize) =>
  sequelize.define('Log', {
    level: {
      type: Sequelize.ENUM,
      values: ['FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE', 'ALL', 'OFF'],
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    },
    senderApplication: {
      type: Sequelize.STRING,
      allowNull: false
    },
    sendDate: {
      type: Sequelize.STRING,
      allowNull: false
    },
    environment: {
      type: Sequelize.ENUM,
      values: ['production', 'homologation', 'development'],
      allowNull: false
    }
  },
  {
    timestamps: true,
    paranoid: true
  })
