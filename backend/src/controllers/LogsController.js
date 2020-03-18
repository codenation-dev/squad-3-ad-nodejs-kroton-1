const { Log } = require('../models')
const { decodeToken } = require('../services/auth')
const yup = require('yup')

module.exports = {

  getByLevel: async (req, res) => {
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

  getByEnvironment: async (req, res) => {
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

  getBySender: async (req, res) => {
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

  create: async (req, res) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    const { userId: { id } } = decodeToken(token)

    const schemaValidation = yup.object().shape({
      send_date: yup.date().required()
    })
    console.log(req.body.send_date)
    if (!(await schemaValidation.isValid({
      send_date: req.body.send_date
    }))) {
      return res.status(400).json({ error: 'Send date is not valid' });
    }

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

  updateEnvironmentLog: async (req, res) => {
    try {
      const token = req.body.token || req.query.token || req.headers['x-access-token'];
      const { userId: { id } } = decodeToken(token)
      const { logid } = req.params
      const { body: { environment } } = req
      
      const environmentUpdated = await Log.update({ environment }, { where: { id: logid, UserId: id } })

      res.status(200).json({ data: environmentUpdated, message: 'Log updated!' })
    } catch (error) {
      console.log(error)
      res.status(400).json({ error })
    }
  },

  deleteByLogId: async (req, res) => {
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

  deleteAllLogsByUser: async (req, res) => {
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