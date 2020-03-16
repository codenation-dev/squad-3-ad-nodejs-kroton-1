const jwt = require('jsonwebtoken');

require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? envPath + '/.env.test' : envPath + '/.env'});

module.exports = {
  generateToken: async (data) => {

    const token = jwt.sign({ data }, process.env.SECRET, {
      expiresIn: '1d'
    })
    return token;
  }

}