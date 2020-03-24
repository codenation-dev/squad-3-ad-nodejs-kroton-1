const { User } = require('../models')
const { Log } = require('../models')
const { generateHashedPassword, compareHash } = require('../utils/hashing')
const { schemaValidationForUsers, schemaValidationForCheckPassword } = require('../utils/validators')
const { decodeToken } = require('../utils/auth')
const { updateByItem } = require('../utils/updateUserValidator')

module.exports = {

  getAllLogsFromUser: async (req, res) => {
    try {
      const id = req.locals
      const { dataValues: { Logs } } = await User.findOne({
        where: { id },
        include: Log
      })

      if (Logs.length === 0) {
        return res.status(406).json({ message: 'There is no logs recorded' })
      }

      return res.status(200).json({ total: Logs.length, Logs })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  create: async (req, res) => {
    try {
      const { body: { name, email, password } } = req

      const validation = (await schemaValidationForUsers().isValid({
        name,
        email,
        password
      }))

      if (!validation) {
        return res.status(406).json({ error: 'Data values are not valid' })
      }

      const existsEmail = await User.findOne({
        where: { email }
      })

      if (existsEmail) {
        return res.status(409).json({ message: 'User email already exists.' })
      }

      const { dataValues: { name: userName, email: userEmail, createdAt } } = await User.create({
        name,
        email,
        password: await generateHashedPassword(password)
      })

      return res.status(201).json({ message: 'User created successfully!', data: { userName, userEmail, createdAt } })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  update: async (req, res) => {
    try {
      const { body } = req
      const { authorization } = req.headers
      const { userId: { id } } = decodeToken(authorization)

      const dataToBeUpdated = []
      for (const obj in body) {
        if (dataToBeUpdated.indexOf(obj) === -1) {
          dataToBeUpdated.push(obj)
        }
      }

      const validation = (await schemaValidationForCheckPassword().isValid(body))
      if (!validation) {
        return res.status(406).json({ message: 'Data values are not valid' })
      }

      const user = await User.findOne({
        where: { id }
      })
      if (!user) {
        return res.status(400).json({ message: 'User not found' })
      }

      if (dataToBeUpdated.indexOf('oldPassword') !== -1) {
        if (!await compareHash(body.oldPassword, user.password)) {
          return res.status(401).json({ message: 'Password does not match' })
        }
        body.password = await generateHashedPassword(body.newPassword)
      }

      const responseOfUserValidator = await updateByItem(dataToBeUpdated.join(), body, id, user)
      res.status(responseOfUserValidator.status).json({ message: responseOfUserValidator.message })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.locals

      const userExists = await User.findOne({
        where: { id }
      })

      if (!userExists) {
        return res.status(406).json({ message: 'User not found!' })
      }

      await Log.destroy({
        where: { UserId: id }
      })

      await User.destroy({
        where: { id }
      })

      return res.status(200).json({ message: 'User deleted succesfully' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  hardDelete: async (req, res) => {
    try {
      const id = req.locals

      const userExists = await User.findOne({
        where: { id }
      })

      if (!userExists) {
        return res.status(406).json({ message: 'User not found!' })
      }

      await Log.destroy({
        where: { UserId: id }
      })

      await User.destroy({
        where: {
          id
        },
        force: true
      })

      return res.status(200).json({ message: 'User deleted forever, this cannot be undone.' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  restoreUser: async (req, res) => {
    const { locals: { token } } = req
    const { userId: { id } } = decodeToken(token)

    const user = await User.findOne({
      where: {
        id
      },
      paranoid: false
    })

    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    await User.restore({
      where: { id }
    })

    return res.status(200).json({ message: 'User restored successfully.' })
  }
}
