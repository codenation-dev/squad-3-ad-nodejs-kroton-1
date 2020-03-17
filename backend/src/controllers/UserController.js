const { User } = require('../models')
const { Log } = require('../models')
const { schemaValidation, generateHashedPassword } = require('../utils/helpers')

module.exports = {
  create: async (req, res, next) => {
    const { body: { username, name, email, password } } = req

    if (!(await schemaValidation().isValid({
      username,
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
        username,
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
    const { username } = req.params
    const { body } = req
    const token = req.body.token || req.query.token || req.headers['x-access-token']

    try {
      await User.update(
        body, {
        where: { username }
      })

      res.status(200).json({ message: 'user updated!' })
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  deleteById: async (req, res, next) => {
    const { username } = req.params
    try {
      await User.destroy({
        where: { username }
      })
      res.status(200).json({ message: 'user deleted succesfully' })
    } catch (error) {
      res.status(400).json({ error })
    }
  }
}