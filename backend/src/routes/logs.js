const express = require('express');
const router = express.Router();
const controller = require('../controllers/LogsController')
const { authorize } = require('../middlewares/auth')

router.post('/', authorize, controller.create)

router.delete('/:id', authorize, controller.deleteById)

router.get('/', authorize, controller.getAll)

router.get('/level/:level', authorize, controller.getByLevel)
 
router.get('/sender/:sender_application', authorize, controller.getBySender)

module.exports = router;