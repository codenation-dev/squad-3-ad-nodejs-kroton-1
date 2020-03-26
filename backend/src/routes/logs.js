const express = require('express')
const router = express.Router()
const controller = require('../controllers/LogsController')

router.get('/sender/:senderApplication', controller.getBySender)

router.get('/environment/:environment', controller.getByEnvironment)

router.get('/level/:level', controller.getByLevel)

router.post('/', controller.create)

router.post('/restore/id/:id', controller.restoreById)

router.post('/restore/all', controller.restoreAllByUser)

router.delete('/id/:id', controller.deleteById)

router.delete('/all', controller.deleteAllByUser)

router.delete('/hard/:id', controller.hardDeleteById)

router.delete('/all/hard', controller.hardDeleteAllByUser)

module.exports = router
