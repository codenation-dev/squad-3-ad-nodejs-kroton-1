const express = require('express')
const router = express.Router()
const controller = require('../controllers/UserController')

router.get('/:id', controller.getById)

router.get('/logs/:id', controller.getAllLogsFromUser)

router.post('/signup', controller.create)

router.patch('/:id', controller.update)

module.exports = router;