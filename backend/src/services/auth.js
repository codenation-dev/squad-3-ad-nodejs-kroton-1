const jwt = require('jsonwebtoken');

module.exports = {
  generateToken: (username) => {
    const token = jwt.sign({ username }, process.env.SECRET, {
      expiresIn: '1d'
    })
    return token;
  },
  decodeToken: (token) => {
    return jwt.verify(token, process.env.SECRET)
  }
}