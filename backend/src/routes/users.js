const express = require('express')
const router = express.Router()
const controller = require('../controllers/UserController')
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/:id/logs', authorize, controller.getAllLogsFromUser)

router.post('/signup', controller.create)

router.post('/signin', authenticate)

router.patch('/:id', authorize, controller.update)

router.delete('/:id', authorize, controller.deleteById)

module.exports = router;