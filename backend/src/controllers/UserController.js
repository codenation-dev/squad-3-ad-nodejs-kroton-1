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

      const user = await User.findOne({
        where: { id }
      })
      if (!user) {
        return res.status(400).json({ message: 'User not found' })
      }

      const validation = (await schemaValidationForCheckPassword().isValid(body))
      if (!validation) {
        return res.status(406).json({ error: 'Data values are not valid' })
      }

      async function updateByItem(bodyItem, body, id) {

        switch (bodyItem) {
          case 'name,email,oldPassword,newPassword,confirmPassword':
            if (!await compareHash(body.oldPassword, user.password)) {
              return res.status(401).json({ error: 'Password does not match' })
            }
            await User.update({
              name: body.name,
              email: body.email,
              password: await generateHashedPassword(body.newPassword)
            }, { where: { id } })
            return res.status(200).json({ message: 'Updated sucessfully!' })

          case 'name,email':
            await User.update({
              name: body.name,
              email: body.email
            }, {
              where: { id }
            })
            return res.status(200).json({ message: 'Updated sucessfully!' })

          case 'name,oldPassword,newPassword,confirmPassword':
            if (!await compareHash(body.oldPassword, user.password)) {
              return res.status(401).json({ error: 'Password does not match' })
            }
            await User.update({
              name: body.name,
              password: await generateHashedPassword(body.newPassword)
            }, { where: { id } })
            return res.status(200).json({ message: 'Updated sucessfully!' })

          case 'name':
            await User.update({
              name: body.name
            }, { where: { id } })
            return res.status(200).json({ message: 'Updated sucessfully!' })

          case 'email,oldPassword,newPassword,confirmPassword':
            if (!await compareHash(body.oldPassword, user.password)) {
              return res.status(401).json({ error: 'Password does not match' })
            }
            await User.update({
              email: body.email,
              password: await generateHashedPassword(body.newPassword)
            }, { where: { id } })
            return res.status(200).json({ message: 'Updated sucessfully!' })
          case 'email':
            await User.update({
              email: body.email
            }, { where: { id } })
            return res.status(200).json({ message: 'Updated sucessfully!' })
          case 'oldPassword,newPassword,confirmPassword':
            if (!await compareHash(body.oldPassword, user.password)) {
              return res.status(401).json({ error: 'Password does not match' })
            }
            await User.update({
              password: await generateHashedPassword(body.newPassword)
            }, { where: { id } })
            return res.status(200).json({ message: 'Updated sucessfully!' })
          default:
            return res.status(406).json({ error: 'Data values are not valid' })
        }
      }

      for (const obj in body) {
        if (dataToBeUpdated.indexOf(obj) === -1) {
          dataToBeUpdated.push(obj)
        }
      }
      console.log(dataToBeUpdated)
      updateByItem(dataToBeUpdated.join(), body, id)
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
