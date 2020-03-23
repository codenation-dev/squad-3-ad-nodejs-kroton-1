const express = require('express')
const router = express.Router()
const controller = require('../controllers/LogsController')

router.get('/sender/:senderApplication', controller.getBySender)

router.get('/environment/:environment', controller.getByEnvironment)

router.get('/level/:level', controller.getByLevel)

router.post('/', controller.create)

router.delete('/id/:id', controller.deleteByLogId)

router.delete('/all', controller.deleteAllLogsByUser)

module.exports = router
