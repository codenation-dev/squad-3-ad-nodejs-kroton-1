const express = require('express')
const router = express.Router()
const controller = require('../controllers/UserController')
const { authenticate, authorize } = require('../middlewares/auth')
const { checkBody } = require('../middlewares/checkUpdate')

router.get('/logs', authorize, controller.getAllLogsFromUser)

router.post('/signup', controller.create)

router.post('/signin', authenticate)

router.patch('/', authorize, checkBody, controller.update)

router.delete('/', authorize, controller.deleteById)

module.exports = router
