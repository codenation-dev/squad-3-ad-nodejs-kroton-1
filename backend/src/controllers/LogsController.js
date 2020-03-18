const { Log } = require('../models')
const { decodeToken } = require('../services/auth')

module.exports = {

  getByLevel: async (req, res, next) => {
    try {
      const { level } = req.params
      const token = req.body.token || req.query.token || req.headers['x-access-token'];
      const { userId: { id } } = decodeToken(token)
      const data = await Log.findAll({
        where: {
          UserId: id,
          level
        }
       })
      res.status(201).json(data)
    } catch (error) {
      res.status(400).json({ error })
      console.log(error)
    }
  },

  getByEnvironment: async (req, res, next) => {
    try {
      const { environment } = req.params
      const token = req.body.token || req.query.token || req.headers['x-access-token'];
      const { userId: { id } } = decodeToken(token)
      const data = await Log.findAll({
        where: {
          UserId: id,
          environment
        }
       })
      res.status(201).json(data)
    } catch (error) {
      res.status(400).json({ error })
      console.log(error)
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
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    const { userId: { id } } = decodeToken(token)
    const logData = req.body
    try {
      const result = await Log.create({
        ...logData,
        UserId: id
      })
      res.status(200).json({ result })
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  deleteByLogId: async (req, res, next) => {
    const { id } = req.params || req.body
    try {
      await Log.destroy({
        where: { id }
      })
      res.status(200).json({ 'msg': 'Deleted successfully' })
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  deleteAllLogsByUser: async (req, res, next) => {
    try {
      const token = req.body.token || req.query.token || req.headers['x-access-token'];
      const { userId: { id } } = decodeToken(token)
      await Log.destroy({
        where: { UserId: id },
      })
      res.status(200).json({ 'msg': 'Deleted successfully' })
    } catch (error) {
      res.status(400).json({ error })
    }
  },
}