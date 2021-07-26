const express = require('express')
const router = express.Router()
const Record = require('../../models/Record')
const Category = require('../../models/Category')
const { changeDateformat } = require('../../public/javacripts/helpfunction')
const { check, validationResult } = require('express-validator')

// 導向新增頁面
router.get('/new', (req, res) => {
  Category.find()
    .lean()
    .then((Category) => {
      res.render('new', { Category })
    })
    .catch(error => {
      console.log(error)
      res.status(422).render('error', { errMsg: error.message })
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
      res.status(422).render('error', { errMsg: error.message })
    })
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      res.status(422).render('error', { errMsg: error.message })
    })
})


// 接住新增的資料
router.post('/', [
  check('name', '請輸入1~20的字位元')
    .isLength({ min: 1, max: 20 }),
  check('date', '請輸入日期')
    .not().isEmpty(),
  check('category', '請選擇分類')
    .not().isEmpty(),
  check('amount', '請輸金額')
    .isNumeric(),
  check('detail', '請輸入小於20字的描述')
    .not().isEmpty().isString().isLength({ max: 20 })
], (req, res) => {
  const { name, date, category, amount, detail } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const alert = errors.array()
    // console.log(alert)
    return res.render('new', { alert, name, date, category, amount, detail })
  }
  return Record.create({ name, date, category, amount, detail })
    .then(() => res.redirect('/'))
    .catch(error => {
      // console.log(error)
      res.status(422).render('error', { errMsg: error.message })
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
      res.status(422).render('error', { errMsg: error.message })
    })
})
module.exports = router
