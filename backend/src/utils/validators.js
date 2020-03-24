const yup = require('yup')

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
  }
}
