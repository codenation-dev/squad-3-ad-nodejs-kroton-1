const { User } = require('../models')
const { Log } = require('../models')
const { generateHashedPassword, compareHash } = require('../utils/hashing')
const { schemaValidationForUsers, schemaValidationForCheckPassword } = require('../utils/validators')
const { decodeToken } = require('../services/auth')

module.exports = {

  getAllLogsFromUser: async (req, res) => {
    try {
      const { authorization } = req.headers
      const { userId: { id } } = decodeToken(authorization)

      const { dataValues: { Logs } } = await User.findOne({
        where: { id },
        include: Log
      })

      if (Logs.length === 0) {
        return res.status(406).json({ message: 'There is no logs recorded' })
      }

      return res.status(200).json({ Logs })
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
      const { body: { name, email, oldPassword, newPassword, confirmPassword } } = req

      const { authorization } = req.headers
      const { userId: { id } } = decodeToken(authorization)

      const validation = (await schemaValidationForCheckPassword().isValid({
        name,
        email,
        oldPassword,
        newPassword,
        confirmPassword
      }))

      if (!validation) {
        return res.status(406).json({ error: 'Data values are not valid' })
      }

      const user = await User.findOne({
        where: { id }
      })

      if (!user) {
        return res.status(400).json({ message: 'User not found' })
      }

      const passwordMatch = await compareHash(oldPassword, user.password)
      if (oldPassword && !passwordMatch) {
        return res.status(401).json({ error: 'Password does not match' })
      }

      if (newPassword !== undefined) {
        await User.update({
          name,
          email,
          password: await generateHashedPassword(newPassword)
        }, {
          where: { id },
          returning: true,
          plain: true
        })

        const { dataValues: { name: updatedName, email: updatedEmail } } = await User.findOne({
          where: { id }
        })
        return res.status(200).json({ updatedName, updatedEmail, message: 'Updated sucessfully!' })
      }

      await User.update({ name, email }, {
        where: { id }
      })

      const { dataValues: { name: updatedName, email: updatedEmail } } = await User.findOne({
        where: { id }
      })

      return res.status(200).json({ updatedName, updatedEmail, message: 'Updated sucessfully!' })
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  deleteById: async (req, res) => {
    try {
      const { authorization } = req.headers
      const { userId: { id } } = decodeToken(authorization)

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
  }
}
