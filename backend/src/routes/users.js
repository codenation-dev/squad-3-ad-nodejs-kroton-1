const express = require('express')
const router = express.Router()
const controller = require('../controllers/UserController')
const { authenticate, authenticateForRestoreUser, authorizeForRestoreUser, authorize } = require('../middlewares/auth')
const { getIdByToken } = require('../middlewares/auth')

router.get('/logs', getIdByToken, authorize, controller.getAllLogs)

router.post('/signup', controller.create)

router.post('/signin', authenticate)

router.post('/restore', authenticateForRestoreUser, authorizeForRestoreUser, controller.restore)

router.patch('/', authorize, controller.update)

router.delete('/', getIdByToken, authorize, controller.delete)

router.delete('/hard', getIdByToken, authorize, controller.hardDelete)

module.exports = router
