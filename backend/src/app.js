const path = require('path')
const routes = require(path.resolve('src/routes'))
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.use('/', routes)

module.exports = {
    app
}
