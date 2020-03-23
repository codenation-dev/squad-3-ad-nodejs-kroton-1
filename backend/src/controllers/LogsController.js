const { Log } = require('../models')
const { decodeToken } = require('../services/auth')
const { schemaValidationForLogs } = require('../utils/validators')

module.exports = {

  getBySender: async (req, res) => {
    try {
      const { params: { senderApplication } } = req
      const logs = await Log.findAll({
        where: { senderApplication }
      })

      if (logs.length === 0) {
        return res.status(406).json({
          message: 'Not acceptable',
          error: 'Nonexistent id'
        })
      }

      return res.status(200).json(logs)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  getByEnvironment: async (req, res) => {
    try {
      const { params: { environment } } = req
      const { authorization } = req.headers
      const { userId: { id } } = decodeToken(authorization)
      const logs = await Log.findAll({
        where: { UserId: id, environment }
      })

      if (logs.length === 0) {
        return res.status(406).json({ message: 'Not acceptable' })
      }

      return res.status(200).json(logs)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  getByLevel: async (req, res) => {
    try {
      const { params: { level } } = req
      const { authorization } = req.headers
      const { userId: { id } } = decodeToken(authorization)
      const logs = await Log.findAll({
        where: { UserId: id, level }
      })

      if (logs.length === 0) {
        return res.status(406).json({ message: 'Level does not exist' })
      }

      return res.status(200).json(logs)
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
  },

  create: async (req, res) => {
    try {
      const { authorization } = req.headers
      const logData = req.body
      const { userId: { id } } = decodeToken(authorization)

      const validatedModelLog = await schemaValidationForLogs(logData)

      if (!validatedModelLog) {
        return res.status(406).json({ error: 'Log body is not valid' })
      }

      const result = await Log.create({
        ...logData,
        UserId: id
      })

      return res.status(200).json({ result })
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  deleteByLogId: async (req, res) => {
    try {
      const { params: { id } } = req

      const logExist = await Log.findOne({
        where: { id }
      })

      if (!logExist) {
        return res.status(406).json({ message: 'Log not existis.' })
      }

      await Log.destroy({
        where: { id }
      })

      return res.status(200).json({ message: 'Deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  deleteAllLogsByUser: async (req, res) => {
    try {
      const { authorization } = req.headers
      const { userId: { id } } = decodeToken(authorization)

      const logs = await Log.findAll({
        where: { UserId: id }
      })

      if (logs.length === 0) {
        return res.status(406).json({ message: 'There is no logs to delete' })
      }

      await Log.destroy({
        where: { UserId: id }
      })

      return res.status(200).json({ message: 'Deleted successfully' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}
