const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()

const Record = require('./models/Record')
const Category = require('./models/Category')
require('./config/mongoose')

const port = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req, res) => {
  Promise.all([Record.find().lean(), Category.find().lean()])
    .then(results => {
      const [records, categories] = results
      const totalAmount = total(records)
      records.forEach((record) => {
        categories.forEach((category) => {
          if (record.category === category.name) {
            record.iconClass = category.iconClass
          }
        })
        record.date = changeDateformat(record.date)
      })
      res.render('index', { records, totalAmount })
    })
    .catch(error => {
      console.log(error)
      res.render('index', { errMsg: error.message })
    })
})

// 總和
function total(Record) {
  let total = 0
  Record.forEach((record) => {
    total += Number(record.amount)
  })
  return total
}

// 轉換日期格式
function changeDateformat(date) {
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = date.getDate()
  d = d < 10 ? '0' + d : d
  return y + '-' + m + '-' + d
}
app.listen(port, () => {
  console.log(`It's running on http://localhost:${port}`)
})