const yup = require('yup');
const bcrypt = require("bcryptjs");

module.exports = {
  schemaValidation: () => {
    const schema = yup.object().shape({
        username: yup.string().required(),
        name: yup.string().required(),
        email: yup.string().required().email(),
        password: yup.string().required().min(6)
      })
    return schema;
  },

  generateHashedPassword: async (password) => {
    const hash = await bcrypt.hash(password, 8);
    return hash
  },

  compareHash: async (password, hash) => {
    const comparedHash = await bcrypt.compare(password, hash)
    return comparedHash
  }
}
