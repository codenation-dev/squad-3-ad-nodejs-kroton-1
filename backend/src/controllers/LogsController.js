const { Log } = require('../models')
const { decodeToken } = require('../services/auth')
const yup = require('yup')

module.exports = {

  getByLevel: async (req, res) => {
    try {
      
      const { params: { level } } = req
      const token = req.body.token || req.query.token || req.headers['x-access-token'];
      const { userId: { id } } = decodeToken(token)
      const logs = await Log.findAll({
        where: {
          UserId: id,
          level
        }
       })
      
      if(logs.length === 0) {
      res.status(406).json({ message: 'Not acceptable' })
      }

      res.status(200).json(logs)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' } )
    }
  },

  getByEnvironment: async (req, res) => {
    try {
      const { params: { environment } } = req
      const token = req.headers.authorization;
      console.log(token)
      const { userId: { id } } = decodeToken(token)
      const logs = await Log.findAll({
        where: {
          UserId: id,
          environment
        }
       })

      if(logs.length === 0) {
      res.status(406).json({ message: 'Not acceptable' })
      }
      
      res.status(200).json(logs)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' } )
    }
  },

  getBySender: async (req, res) => {
    try {
      const { params: { sender_application } } = req
      const logs = await Log.findAll({
        where: { sender_application }
      })

      if(logs.length === 0) {
        res.status(406).json({ message: 'Not acceptable' })
        }

      res.status(200).json(logs)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' } )
    }
  },

  create: async (req, res) => {
    const { token } = req.body || req.query || req.headers['x-access-token'];
    const { userId: { id } } = decodeToken(token)

    const schemaValidation = yup.object().shape({
      send_date: yup.date().required()
    })
    
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
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' } )
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
      res.status(500).json({ message: 'Internal Server Error' } )
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
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' } )
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
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' } )
    }
  },
}