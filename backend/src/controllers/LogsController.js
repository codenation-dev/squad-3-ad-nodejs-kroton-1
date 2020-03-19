const { Log } = require('../models')
const { decodeToken } = require('../services/auth')
const { schemaValidationForLogs } = require('../utils/helpers')

module.exports = {

  getBySender: async (req, res) => {
    try {
      const { params: { senderApplication } } = req
      const logs = await Log.findAll({
        where: { senderApplication }
      })

      if (logs.length === 0) {
        res.status(406).json({ message: 'Not acceptable' })
      }

      res.status(200).json(logs)
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
        res.status(406).json({ message: 'Not acceptable' })
      }

      res.status(200).json(logs)
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
        res.status(406).json({ message: 'Not acceptable' })
      }

      res.status(200).json(logs)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  create: async (req, res) => {
    try {
      const { authorization } = req.headers
      const logData = req.body
      const { userId: { id } } = decodeToken(authorization)

      const validatedModelLog = await schemaValidationForLogs(logData)

      if (!(validatedModelLog)) {
        return res.status(400).json({ error: 'Log body is not valid' })
      }

      const result = await Log.create({
        ...logData,
        UserId: id
      })
      res.status(200).json({ result })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  deleteByLogId: async (req, res) => {
    try {
      const { params: { id } } = req

      const existLog = await Log.findOne({
        where: {
          id
        }
      })
      if (existLog) {
        await Log.destroy({
          where: { id }
        })
        res.status(200).json({ msg: 'Deleted successfully' })
      } else {
        return res.status(406).json({ message: 'Log not existis.' })
      }
    } catch (error) {
      console.log(error)
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
        res.status(406).json({ message: 'There is no logs to delete' })
      }

      await Log.destroy({
        where: { UserId: id }
      })
      res.status(200).json({ message: 'Deleted successfully' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}
