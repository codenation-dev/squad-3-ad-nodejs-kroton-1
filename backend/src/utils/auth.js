const jwt = require('jsonwebtoken')

module.exports = {
  generateToken: (userId) => {
    const token = jwt.sign({ userId }, process.env.SECRET, {
      expiresIn: '1d'
    })
    return token
  },
  decodeToken: (token) => {
    try {
      const [bearer, tokenSplited] = token.split(' ')
      console.log('**', bearer, tokenSplited)
      if (!bearer || !tokenSplited) {
        return { status: 401, message: 'Invalid token' }
      }
      return jwt.verify(tokenSplited, process.env.SECRET)
    } catch (error) {
      console.log(error)
      return { status: 500, message: 'Internal Server Error' }
    }
  }
}
