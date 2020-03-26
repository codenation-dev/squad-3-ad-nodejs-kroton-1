const express = require('express')
const router = express.Router()
const controller = require('../controllers/UserController')
const { authenticate, authenticateForRestoreUser, authorizeForRestoreUser, authorize } = require('../middlewares/auth')

router.get('/logs', authorize, controller.getAllLogs)

router.post('/signup', controller.create)

router.post('/signin', authenticate)

router.post('/restore', authenticateForRestoreUser, authorizeForRestoreUser, controller.restore) // juliano

router.patch('/', authorize, controller.update)

router.delete('/', authorize, controller.delete)

router.delete('/hard', authorize, controller.hardDelete)

module.exports = router
