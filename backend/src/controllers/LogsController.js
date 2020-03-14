const { Log } = require('../models')

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const data = await Log.findAll()

      res.status(200).json({
        data
      })
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  getByLevel: async (req, res, next) => {
    const { level } = req.params
    try {
      const data = await Log.findAll({
        where: { level }
      })
      res.status(201).json(data)
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  getBySender: async (req, res, next) => {
    const { sender_application } = req.params
    try {
      const data = await Log.findAll({
        where: { sender_application }
      })
      res.status(201).json(data)
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  create: async (req, res, next) => {
    const logData = req.body
    try {
      const result = await Log.create(logData)
      res.status(200).json({ result })
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  deleteById: async (req, res, next) => {
    const { id } = req.params
    try {
      await Log.destroy({
        where: { id }
      })
      res.status(200).json({ 'msg': 'Deleted successfully' })
    } catch (error) {
      res.status(400).json({ error })
    }
  }

}