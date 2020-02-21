const express = require('express');
const router = express.Router();
const usersRoute = require('./users');
const logsRoute = require('./logs');

router.get('/', (req, res) => {
    res.status(200).json({
        users: 'http://localhost:8080/users',
        logs: 'http://localhost:8080/logs'
    })
})

router.use('/users', usersRoute);
router.use('/logs', logsRoute);

module.exports = router;