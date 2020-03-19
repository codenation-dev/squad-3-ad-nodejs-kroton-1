const { User } = require('../models')
const { generateToken, decodeToken } = require('../services/auth')
const { compareHash } = require('../utils/helpers')

module.exports = {

  authenticate: async (req, res) => {
    try {
      if (Object.keys(req.body).length > 2) {
        return res.status(406).json({ message: 'You are input more data then necessary' })
      } else if (typeof req.body.password !== 'string') {
        return res.status(406).json({ message: 'Password must be a string.' })
      }
      const { body: { email, password } } = req

      const user = await User.findOne({
        where: { email }
      })

      if (user) {
        if (user.email === email && await compareHash(password, user.password)) {
          const token = generateToken({
            id: user.id
          })
          res.status(200).json({
            token
          })
        } else {
          res.status(401).json({
            message: 'Incorrect password.'
          })
        }
      } else {
        res.status(400).json({
          message: 'User not found'
        })
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ error })
    }
  },

  authorize: async (req, res, next) => {
    try {
      const { authorization } = req.headers

      if (!authorization) {
        return res.status(401).json({ error: 'Token not provided' })
      }

      const validatedToken = decodeToken(authorization)
      if (validatedToken) {
        next()
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ error })
    }
  }
}
