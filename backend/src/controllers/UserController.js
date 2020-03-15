const { User } = require('../models')

module.exports = {
  getById: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findOne({
        where: {
          id
        }
      })

      res.status(200).json({ user: user })
    } catch (error) {
      res.status(400).json({ message: error })
    }
  },

  create: async (req, res, next) => {
    const { body } = req
    try {
      const result = await User.create(body)
      res.status(200).json({ result })
    } catch (error) {
      res.status(400).json({ error })
    }
  }
}