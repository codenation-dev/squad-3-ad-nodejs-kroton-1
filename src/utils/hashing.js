const bcrypt = require('bcryptjs')

module.exports = {
  generateHashedPassword: async (password) => {
    try {
      const hash = await bcrypt.hash(password, 8)

      return hash
    } catch (error) {
      return error
    }
  },

  compareHash: async (password, hash) => {
    const comparedHash = await bcrypt.compare(password, hash)
    return comparedHash
  }
}
