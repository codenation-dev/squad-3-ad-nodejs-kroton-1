const yup = require('yup');

module.exports = {
  schemaValidation: () => {
    const schema =
    yup.object().shape({
    name: yup.string().required(),
    email: yup.string().required().email(),
    password: yup.string().required().min(6)
  })
  return schema;
  }
}
