const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const app = express()

const Record = require('./models/Record')
const Category = require('./models/Category')
const routes = require('./routes')
require('./config/mongoose')

const port = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(routes)



app.listen(port, () => {
  console.log(`It's running on http://localhost:${port}`)
})