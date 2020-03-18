// factory function para import do model na instância de conexão do sequelize
module.exports = (sequelize, Sequelize) =>
  sequelize.define('User', {
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
  },
  {
    timestamps: true,
    paranoid: true
  });