const express = require('express')
const router = express.Router()
const controller = require('../controllers/LogsController')

router.get('/sender/:senderApplication', controller.getBySender) // juliano

router.get('/environment/:environment', controller.getByEnvironment) // luane

router.get('/level/:level', controller.getByLevel) // gui

router.post('/', controller.create)

router.post('/restore/id/:id', controller.restoreById) // julaino

router.post('/restore/all', controller.restoreAllByUser) // luane

router.delete('/id/:id', controller.deleteById) // gui

router.delete('/all', controller.deleteAllByUser)

router.delete('/hard/:id', controller.hardDeleteById) // juliano

router.delete('/all/hard', controller.hardDeleteAllByUser) //  luane

module.exports = router
