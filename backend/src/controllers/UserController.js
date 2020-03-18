const { User } = require('../models')
const { Log } = require('../models')
const { schemaValidation, generateHashedPassword } = require('../utils/helpers')
const { decodeToken } = require('../services/auth')

module.exports = {

  getAllLogsFromUser: async (req, res, next) => {
    try {
      const { id: idSent } = req.params
      const token = req.body.token || req.query.token || req.headers['x-access-token'];
      const { userId: { id } } = decodeToken(token)
      if (id == idSent) {
        const allLogsFromUser = await User.findOne(
          {
            where: { id },
            include: Log
          })
        res.status(200).json({ logs: allLogsFromUser.Logs })
      } else {
        res.status(401).json({ error: 'token invalid' })
      }
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  create: async (req, res, next) => {
    const { body: { name, email, password } } = req

    if (!(await schemaValidation().isValid({
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

    if (existsEmail) {
      return res.status(400).json({ message: 'User email already existis.' });
    }

    try {

      const user = await User.create({
        name,
        email,
        password: await generateHashedPassword(password)
      })

      res.status(200).json({ user })

    } catch (error) {
      res.status(400).json({ error })
    }
  },

  update: async (req, res, next) => {
    const { id } = req.params
    const { body } = req
    const token = req.body.token || req.query.token || req.headers['x-access-token']

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