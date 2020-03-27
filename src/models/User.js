module.exports = (sequelize, Sequelize) =>
  sequelize.define('User', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Password cannot be null' }
      }
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'Password cannot be null' }
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'Password cannot be null' }
      }
    }
  },
  {
    timestamps: true,
    paranoid: true
  })
