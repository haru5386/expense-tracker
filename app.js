const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const hbshelpers = require('handlebars-helpers')
const multihelpers = hbshelpers()
const app = express()

const Record = require('./models/Record')
const Category = require('./models/Category')
require('./config/mongoose')

const port = 3000

app.engine('hbs', exphbs({ helpers: multihelpers, defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  const searchCategory = req.query.searchCategory
  Promise.all([Record.find().lean(), Category.find().lean()])
    .then(results => {
      const [records, categories] = results
      const totalAmount = total(records)
      let searchRecord = []
      if (isEmpty(req.query) || searchCategory === 'all') {
        searchRecord = records
      } else if (searchCategory) {
        searchRecord = records.filter((record) => searchCategory === record.category)
      } else { 
        let wrongWord = "您的搜尋不存在"
        return res.render('wrong', { wrongWord}) }
      records.forEach((record) => {
        categories.forEach((category) => {
          if (record.category === category.name) {
            record.iconClass = category.iconClass
          }
        })
        record.date = changeDateformat(record.date)
      })
      res.render('index', { records: searchRecord, totalAmount, categories })
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

// 導向編輯頁面
app.get('/records/:id/edit', (req, res) => {
  const id = req.params.id
  Promise.all([Record.findById(id).lean(), Category.find().lean()])
    .then(results => {
      const [record, categories] = results
      record.date = changeDateformat(record.date)
      res.render('edit', { record, categories })
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
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      res.render('index', { errMsg: error.message })
    })
})

// 修改新增的資料
app.put('/records/:id', (req, res) => {
  const id = req.params.id
  const { name, date, category, amount, detail } = req.body
  Record.findById(id)
    .then((record) => {
      record.name = name
      record.date = date
      record.category = category
      record.amount = amount
      record.detail = detail
      return record.save()
    })
    .then(() => res.redirect('/'))
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

// 判斷搜尋結果是否為空
function isEmpty(obj) {
  for (i in obj) {
    if (i) {
      return false
    }
  }
  return true
}
app.listen(port, () => {
  console.log(`It's running on http://localhost:${port}`)
})