const { Log } = require('../models')
const { schemaValidationForLogs } = require('../utils/validators')

module.exports = {

  getBySender: async (req, res) => {
    try {
      const UserId = req.locals
      const { params: { senderApplication } } = req
      const logs = await Log.findAll({
        where: { UserId, senderApplication }
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
      const UserId = req.locals
      const { params: { environment } } = req
      const logs = await Log.findAll({
        where: { UserId, environment }
      })

      if (logs.length === 0) {
        return res.status(406).json({ message: 'Invalid environment' })
      }

      return res.status(200).json(logs)
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
  },

  getByLevel: async (req, res) => {
    try {
      const UserId = req.locals
      const { params: { level } } = req
      const logs = await Log.findAll({
        where: { UserId, level }
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
      const UserId = req.locals
      const logData = req.body
      const validatedModelLog = await schemaValidationForLogs(logData)

      if (!validatedModelLog) {
        return res.status(406).json({ error: 'Log body is not valid' })
      }

      const result = await Log.create({
        ...logData,
        UserId
      })

      return res.status(200).json({ result })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  deleteByLogId: async (req, res) => {
    try {
      const UserId = req.locals
      const { params: { id } } = req

      const logExist = await Log.findOne({
        where: { UserId, id }
      })

      if (!logExist) {
        return res.status(406).json({ message: 'Log not existis.' })
      }

      await Log.destroy({
        where: { id }
      })

      return res.status(200).json({ message: 'Deleted successfully' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  hardDeleteById: async (req, res) => {
    try {
      const { params: { id } } = req

      const logExist = await Log.findOne({
        where: { id }
      })

      if (!logExist) {
        return res.status(406).json({ message: 'Log not existis.' })
      }

      await Log.destroy({
        where: { id },
        force: true
      })

      return res.status(200).json({ message: 'Log deleted forever, this cannot be undone.' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  deleteAllLogsByUser: async (req, res) => {
    try {
      const UserId = req.locals
      const logs = await Log.findAll({
        where: { UserId }
      })

      if (logs.length === 0) {
        return res.status(406).json({ message: 'There is no logs to delete' })
      }

      await Log.destroy({
        where: { UserId }
      })

      return res.status(200).json({ message: 'Deleted successfully' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  hardDeleteAll: async (req, res) => {
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
        where: { UserId: id },
        force: true
      })
      return res.status(200).json({ message: 'All logs deleted forever, this cannot be undone.' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  restoreLogById: async (req, res) => {
    const { params: { id } } = req
    console.log(id, 'ID AQUIIIIIIIIIIIIIIIIIIII')
    const logs = await Log.findOne({
      where: {
        id
      },
      paranoid: false
    })

    if (!logs) {
      return res.status(400).json({ message: 'There is no logs to restore' })
    }

    await Log.restore()

    return res.status(200).json({ message: 'All logs restored successfully.' })
  },

  restoreAllLogs: async (req, res) => {
    const { authorization } = req.headers
    const { userId: { id } } = decodeToken(authorization)

    const logs = await Log.findAll({
      where: { UserId: id },
      paranoid: false
    })

    if (logs.length === 0) {
      return res.status(400).json({ message: 'There is no logs to restore' })
    }

    await Log.restore({
      where: { UserId: id }
    })

    return res.status(200).json({ message: 'All logs restored successfully.' })
  }
}
