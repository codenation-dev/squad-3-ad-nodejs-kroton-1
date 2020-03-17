const { User } = require('../models')
const { Log } = require('../models')
const { schemaValidation } = require('../utils/helpers')

module.exports = {
  getById: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findOne({
        where: {
          id
        }
      })

      res.status(200).json({ user })
    } catch (error) {
      res.status(400).json({ message: error })
    }
  },

  getAllLogsFromUser: async (req, res, next) => {
    const { id } = req.params
    try {
      const allLogsFromUser = await User.findOne(
        {
          where: { id },
          include: Log
        })

      res.status(200).json({ logs: allLogsFromUser.Logs })
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  create: async (req, res, next) => {
    const { body: {name, email, password} } = req

    if(!(await schemaValidation().isValid({
      name,
      email,
      password
    }))) {
      return res.status(400).json({ error: 'Email or name not valid' });
    }

    const existsEmail = await User.findOne({
      where:
        {
            email
        }
    });

    if(existsEmail) {
      return res.status(400).json({ message: 'User email already existis.' });
    }

    try {

      const user = await User.create(body)

      res.status(200).json({ user })

    } catch (error) {
      res.status(400).json({ error })
    }
  },

  update: async (req, res, next) => {
    const { id } = req.params
    const { body } = req
    try {
      await User.update(
        body, {
        where: { id }
      })

      res.status(200).json({ message: 'user updated!' })
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  deleteById: async (req, res, next) => {
    const { id } = req.params
    try {
      await User.destroy({
        where: { id }
      })
      res.status(200).json({ message: 'user deleted succesfully' })
    } catch (error) {
      res.status(400).json({ error })
    }
  }
}