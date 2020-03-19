const yup = require('yup')
const bcrypt = require('bcryptjs')

module.exports = {

  generateHashedPassword: async (password) => {
    const hash = await bcrypt.hash(password, 8)

    return hash
  },

  compareHash: async (password, hash) => {
    const comparedHash = await bcrypt.compare(password, hash)

    return comparedHash
  },
  schemaValidation: () => {
    const schema =
      yup.object().shape({
        name: yup.string().required(),
        email: yup.string().required().email(),
        password: yup.string().required().min(6)
      })
    return schema
  },

  schemaValidationForCheckPassword: () => {
    const schema = yup.object().shape({
      name: yup.string(),
      email: yup.string().email(),
      oldPassword: yup.string().min(6),
      newPassword: yup.string().min(6).when('oldPassword', (oldPassword, field) => {
        return oldPassword ? field.required() : field
      }),
      confirmPassword: yup.string().when('newPassword', (password, field) => {
        return password ? field.required().oneOf([yup.ref('newPassword')]) : field
      })
    })
    return schema
  },

  schemaValidationForLogs: async (logData) => {
    const schema = yup.object().shape({
      level: yup.string().required(),
      description: yup.string().required(),
      senderApplication: yup.string().required(),
      sendDate: yup.string().required(),
      environment: yup.string().required()
    })

    if (!(await schema.isValid(logData))) {
      return false
    }

    const { _nodes } = schema
    for (const obj in logData) {
      if (_nodes.indexOf(obj) === -1) {
        return false
      }
    }
    return schema
  }
}
