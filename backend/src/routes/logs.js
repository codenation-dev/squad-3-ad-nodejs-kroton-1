const express = require('express');
const router = express.Router();
const controller = require('../controllers/LogsController')

router.get('/', controller.getAll)

router.get('/level/:level', controller.getByLevel)

router.get('/sender/:sender_application', controller.getBySender)

router.post('/', controller.create)

router.delete('/:id', controller.deleteById)

module.exports = router;