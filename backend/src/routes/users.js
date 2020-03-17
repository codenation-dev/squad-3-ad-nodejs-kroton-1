const express = require('express')
const router = express.Router()
const controller = require('../controllers/UserController')
const { authenticate, authorize } = require('../middlewares/auth');

router.post('/signup', controller.create)

router.post('/signin', authenticate)

router.patch('/', authorize, controller.update)

router.delete('/:id', authorize, controller.deleteById)

module.exports = router;