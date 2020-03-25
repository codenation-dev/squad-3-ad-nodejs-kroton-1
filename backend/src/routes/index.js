const express = require('express')
const router = express.Router()
const usersRoute = require('./users')
const logsRoute = require('./logs')
const { authorize } = require('../middlewares/auth')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

router.use('/api-docs', swaggerUi.serve)
router.get('/api-docs', swaggerUi.setup(swaggerDocument))

router.get('/', (req, res) => {
  res.status(200).json({
    users: 'http://localhost:8080/users',
    logs: 'http://localhost:8080/logs'
  })
})

router.use('/users', usersRoute)
router.use('/logs', authorize, logsRoute)

module.exports = router
