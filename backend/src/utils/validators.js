const yup = require('yup')
const { User } = require('../models')

module.exports = {

  schemaValidationForUsers: () => {
    const schema =
      yup.object().shape({
        name: yup.string().required(),
        email: yup.string().required().email(),
        password: yup.string().required().min(6)
      })
    return schema
  },

  schemaValidationForUpdateUser: () => {
    const schema = yup.object().shape({
      name: yup.string(),
      email: yup.string().email(),
      oldPassword: yup.string().min(6),
      newPassword: yup.string().min(6).when('oldPassword', (oldPassword, field) => {
        return oldPassword ? field.required() : field
      }),
      confirmPassword: yup.string().when('newPassword', (newPassword, field) => {
        return newPassword ? field.required().oneOf([yup.ref('newPassword')]) : field
      })
    })
    return schema
  },

  schemaValidationForLogs: async (logData) => {
    const schema = yup.object().shape({
      level: yup.string().required(),
      description: yup.string().required(),
      senderApplication: yup.string().required(),
      sendDate: yup.date().required(),
      environment: yup.string().required()
    })

    const isSchemaValid = await schema.isValid(logData)
    if (!isSchemaValid) {
      return false
    }
    return schema
  },

  schemaValidationForAuthenticate: async () => {
    const schema = yup.object().shape({
      email: yup.string().required().email(),
      password: yup.string().required().min(6)
    })
    return schema
  },
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
        return { status: 406, message: 'Invalid data' }
    }
  }
}
