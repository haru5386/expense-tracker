const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const app = express()

const Record = require('./models/Record')
const Category = require('./models/Category')
require('./config/mongoose')

const port = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))

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
// 導向新增頁面
app.get('/records/new', (req, res) => {
  Category.find()
    .lean()
    .then((category) => {
      res.render('new', { category })
    })
    .catch(error => {
      console.log(error)
      res.render('index', { errMsg: error.message })
    })
})

app.delete('/records/:id', (req, res) => {
  const id = req.params.id
  console.log(id)
  Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      res.render('index', { errMsg: error.message })
    })
})


// 接住新增的資料
app.post('/records', (req, res) => {
  const { name, date, category, amount, detail } = req.body
  return Record.create({ name, date, category, amount, detail })
    .then(res.redirect('/'))
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