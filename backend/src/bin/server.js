const path = require('path')
const appPath = path.resolve('src/app')
const { app } = require(appPath);

app.listen(8080, () => {
    console.log('Listening at port 8080')
})