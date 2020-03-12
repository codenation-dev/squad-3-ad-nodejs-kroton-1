require('module-alias/register')
const { app } = require('@app');

app.listen(8080, () => {
    console.log('Listening at port 8080')
})