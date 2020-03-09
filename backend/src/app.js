const path = require('path')
const routesPath = path.resolve('src/routes')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const routes = require(routesPath);

app.use(bodyParser.json());

app.use('/', routes)

module.exports = {
    app
}