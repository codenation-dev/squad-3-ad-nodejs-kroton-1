const { User } = require('../models')

module.exports = {
  updateByItem: async (bodyItem, body, id) => {
    switch (bodyItem) {
      case 'name,email,oldPassword,newPassword,confirmPassword':
        await User.update({
          name: body.name,
          email: body.email,
          password: body.password
        }, { where: { id } })
        return { status: 200, message: 'Updated sucessfully!' }

      case 'name,email':
        await User.update({
          name: body.name,
          email: body.email
        }, {
          where: { id }
        })
        return { status: 200, message: 'Updated sucessfully!' }

      case 'name,oldPassword,newPassword,confirmPassword':
        await User.update({
          name: body.name,
          password: body.password
        }, { where: { id } })
        return { status: 200, message: 'Updated sucessfully!' }

      case 'name':
        await User.update({
          name: body.name
        }, { where: { id } })
        return { status: 200, message: 'Updated sucessfully!' }

      case 'email,oldPassword,newPassword,confirmPassword':
        await User.update({
          email: body.email,
          password: body.password
        }, { where: { id } })
        return { status: 200, message: 'Updated sucessfully!' }

      case 'email':
        await User.update({
          email: body.email
        }, { where: { id } })
        return { status: 200, message: 'Updated sucessfully!' }

      case 'oldPassword,newPassword,confirmPassword':
        await User.update({
          password: body.password
        }, { where: { id } })
        return { status: 200, message: 'Updated sucessfully!' }

      default:
        return { status: 406, message: 'Data values are not valid for body' }
    }
  }
}
