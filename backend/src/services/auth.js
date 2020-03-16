const jwt = require('jsonwebtoken');

module.exports = {
  generateToken: (userId) => {

    const token = jwt.sign({ userId }, process.env.SECRET, {
      expiresIn: '1d'
    })
    return token;
  },
  decodeToken: (token) => {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ "error":'Invalid token'})
      } else {
        next()
      }
    })
  }
}