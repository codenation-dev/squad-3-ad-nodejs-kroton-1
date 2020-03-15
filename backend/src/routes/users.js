const express = require('express')
const router = express.Router()
const controller = require('../controllers/UserController')

router.get('/:id', controller.getById)

router.post('/signup', controller.create)

module.exports = router;