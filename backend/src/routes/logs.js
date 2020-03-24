const express = require('express')
const router = express.Router()
const controller = require('../controllers/LogsController')

router.get('/sender/:senderApplication', controller.getBySender)

router.get('/environment/:environment', controller.getByEnvironment)

router.get('/level/:level', controller.getByLevel)

router.post('/', controller.create)

router.post('/restore', controller.restoreAllLogs)

router.post('/restore/:id', controller.restoreLogById)

router.delete('/id/:id', controller.deleteByLogId)

router.delete('/all', controller.deleteAllLogsByUser)

router.delete('/hard/:id', controller.hardDeleteById)

router.delete('/all/hard', controller.hardDeleteAll)

module.exports = router
