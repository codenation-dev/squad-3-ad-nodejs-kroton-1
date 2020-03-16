const jwt = require('jsonwebtoken');

module.exports = {
  generateToken: async (data) => {

    const token = jwt.sign({ data }, process.env.SECRET, {
      expiresIn: '1d'
    })
    console.log(token)

    return token;
  }

}