const { User } = require('../models')
const { generateHashedPassword, compareHash } = require('../utils/hashing')


module.exports = {
  updateByItem: async (bodyItem, body, id, user) => {

    switch (bodyItem) {
      case 'name,email,oldPassword,newPassword,confirmPassword':
        if (!await compareHash(body.oldPassword, user.password)) {
          return { status: 401, message: 'Password does not match' }
        }
        await User.update({
          name: body.name,
          email: body.email,
          password: await generateHashedPassword(body.newPassword)
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
        if (!await compareHash(body.oldPassword, user.password)) {
          return { status: 401, message: 'Password does not match' }
        }
        await User.update({
          name: body.name,
          password: await generateHashedPassword(body.newPassword)
        }, { where: { id } })
        return { status: 200, message: 'Updated sucessfully!' }

      case 'name':
        await User.update({
          name: body.name
        }, { where: { id } })
        return { status: 200, message: 'Updated sucessfully!' }

      case 'email,oldPassword,newPassword,confirmPassword':
        if (!await compareHash(body.oldPassword, user.password)) {
          return { status: 401, message: 'Password does not match' }
        }
        await User.update({
          email: body.email,
          password: await generateHashedPassword(body.newPassword)
        }, { where: { id } })
        return { status: 200, message: 'Updated sucessfully!' }
      case 'email':
        await User.update({
          email: body.email
        }, { where: { id } })
        return { status: 200, message: 'Updated sucessfully!' }
      case 'oldPassword,newPassword,confirmPassword':
        if (!await compareHash(body.oldPassword, user.password)) {
          return { status: 401, message: 'Password does not match' }
        }
        await User.update({
          password: await generateHashedPassword(body.newPassword)
        }, { where: { id } })
        return { status: 200, message: 'Updated sucessfully!' }
      default:
        return { status: 406, message:  'Data values are not valid' }
    }
  }
}