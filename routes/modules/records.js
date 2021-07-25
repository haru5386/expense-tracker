const express = require('express')
const router = express.Router()
const Record = require('../../models/Record')
const Category = require('../../models/Category')
const { changeDateformat } = require('../../public/javacripts/helpfunction')

// 導向新增頁面
router.get('/new', (req, res) => {
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
router.get('/:id/edit', (req, res) => {
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

router.delete('/:id', (req, res) => {
  const id = req.params.id
  Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      res.render('index', { errMsg: error.message })
    })
})


// 接住新增的資料
router.post('/', (req, res) => {
  const { name, date, category, amount, detail } = req.body
  return Record.create({ name, date, category, amount, detail })
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      res.render('index', { errMsg: error.message })
    })
})

// 修改新增的資料
router.put('/:id', (req, res) => {
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
module.exports = router
