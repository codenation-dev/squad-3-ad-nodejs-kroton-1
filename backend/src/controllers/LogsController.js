const { Log } = require('../models')
const { decodeToken } = require('../services/auth')
const yup = require('yup')

module.exports = {

  getByLevel: async (req, res) => {
    try {

      const { params: { level } } = req
      const { authorization } = req.headers;
      const { userId: { id } } = decodeToken(authorization)
      const logs = await Log.findAll({
        where: {
          UserId: id,
          level
        }
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
      const { authorization } = req.headers;
      const { userId: { id } } = decodeToken(authorization)
      const logs = await Log.findAll({
        where: {
          UserId: id,
          environment
        }
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

  getBySender: async (req, res) => {
    try {
      const { params: { sender_application } } = req
      const logs = await Log.findAll({
        where: { sender_application }
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
      const { authorization } = req.headers;
      const { userId: { id } } = decodeToken(authorization)
      const { body: { send_date } } = req
      const logData = req.body

      const schemaValidation = yup.object().shape({
        send_date: yup.date().required()
      })

      if (!(await schemaValidation.isValid({
        send_date
      }))) {
        return res.status(400).json({ error: 'Send date is not valid' });
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

  /*  updateStatusLog: async (req, res) => {
     try {
       const { authorization } = req.headers;
       const { userId: { id } } = decodeToken(authorization)
       const { params: { logid } } = req
       const { body: { status } } = req
       const existLog = await Log.findOne({
         where: {
           id: logid
         }
       })
       if (existLog) {
         const statusUpdated = await Log.update({ status }, { where: { id: logid, UserId: id } })
         res.status(200).json({ data: statusUpdated, message: 'Log updated!' })
       } else {
         return res.status(406).json({ message: 'Log not existis.' });
       }
 
     } catch (error) {
       console.log(error)
       res.status(500).json({ message: 'Internal Server Error' })
     }
   }, */

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
        res.status(200).json({ 'msg': 'Deleted successfully' })
      } else {
        return res.status(406).json({ message: 'Log not existis.' });
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  deleteAllLogsByUser: async (req, res) => {
    try {
      const { authorization } = req.headers;
      const { userId: { id } } = decodeToken(authorization)

      const logs = await Log.findAll({
        where: { UserId: id }
      })

      if (logs.length === 0) {
        res.status(406).json({ message: 'There is no logs to delete' })
      }

      await Log.destroy({
        where: { UserId: id },
      })
      res.status(200).json({ message: 'Deleted successfully' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },
}