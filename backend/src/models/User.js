module.exports = (sequelize, Sequelize) =>
  sequelize.define('User', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'You must enter a name' }
      }
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'You must enter a email' }
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'You must enter a password' }
      }
    }
  },
  {
    timestamps: true,
    paranoid: true
  })
