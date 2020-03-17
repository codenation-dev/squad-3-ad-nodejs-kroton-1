const jwt = require('jsonwebtoken');

module.exports = {
  generateToken: (userId) => {

    const token = jwt.sign({ userId }, process.env.SECRET, {
      expiresIn: '1d'
    })
    return token;
  },
  decodeToken: (token) => {
    return jwt.verify(token, process.env.SECRET)
  }
}