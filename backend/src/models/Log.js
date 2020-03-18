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
    sender_application: {
      type: Sequelize.STRING,
      allowNull: false
    },
    send_date: {
      type: Sequelize.STRING,
      allowNull: false
    },
    environment: {
      type: Sequelize.ENUM,
      values: ['production', 'homologation', 'development'],
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM,
      defaultValue: 'active',
      values: ['active', 'archived'],
      allowNull: false
    }
  },
  {
    timestamps: true,
    paranoid: true
  });
  