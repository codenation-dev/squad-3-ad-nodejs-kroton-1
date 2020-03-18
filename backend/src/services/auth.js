const jwt = require('jsonwebtoken');

module.exports = {
  generateToken: (userId) => {

    const token = jwt.sign({ userId }, process.env.SECRET, {
      expiresIn: '1d'
    })
    return token;
  },
  decodeToken: (token) => {
    const [, tokenSplited] = token.split(' '); 
    return jwt.verify(tokenSplited, process.env.SECRET)
  }
}