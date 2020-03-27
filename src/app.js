const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const routes = require('./routes')

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', routes)

module.exports = {
  app
}
