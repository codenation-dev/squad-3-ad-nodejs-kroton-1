const path = require('path')
const usersRoutePath = path.resolve('src/routes/users')
const logsRoutePath = path.resolve('src/routes/logs')
const express = require('express');
const router = express.Router();
const usersRoute = require(usersRoutePath);
const logsRoute = require(logsRoutePath);

router.get('/', (req, res) => {
    res.status(200).json({
        users: 'http://localhost:8080/users',
        logs: 'http://localhost:8080/logs'
    })
})

router.use('/users', usersRoute);
router.use('/logs', logsRoute);

module.exports = router;