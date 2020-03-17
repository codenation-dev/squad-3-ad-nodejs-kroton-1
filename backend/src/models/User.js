// factory function para import do model na instância de conexão do sequelize
module.exports = (sequelizeConfig, Sequelize) =>
  sequelizeConfig.define('User', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });