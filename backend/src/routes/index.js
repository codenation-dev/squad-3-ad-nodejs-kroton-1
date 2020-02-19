const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        users: 'http://localhost:8080/users'
    })
})

module.exports = {
    router
}