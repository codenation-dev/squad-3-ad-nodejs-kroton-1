// factory function para import do model na instância de conexão do sequelize
module.exports = (sequelizeConfig, Sequelize) =>
  sequelizeConfig.define('Log', {
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
    }
  });