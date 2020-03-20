const bcrypt = require('bcryptjs')

module.exports = {
  generateHashedPassword: async (password) => {
    const hash = await bcrypt.hash(password, 8)

    return hash
  },

  compareHash: async (password, hash) => {
    const comparedHash = await bcrypt.compare(password, hash)

    return comparedHash
  }
}
