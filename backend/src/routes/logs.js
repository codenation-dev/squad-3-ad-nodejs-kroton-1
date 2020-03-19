const express = require('express')
const router = express.Router()
const controller = require('../controllers/LogsController')
const { authorize } = require('../middlewares/auth')

router.get('/sender/:senderApplication', authorize, controller.getBySender)

router.get('/environment/:environment', authorize, controller.getByEnvironment)

router.get('/level/:level', authorize, controller.getByLevel)

router.post('/', authorize, controller.create)

router.delete('/:id', authorize, controller.deleteByLogId)

router.delete('/all', authorize, controller.deleteAllLogsByUser)

module.exports = router
