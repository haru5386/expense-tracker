const express = require('express')
const router = express.Router()
const Record = require('../../models/Record')
const Category = require('../../models/Category')
const { changeDateformat } = require('../../public/javacripts/helpfunction')
const { check, validationResult } = require('express-validator')

// 導向新增頁面
router.get('/new', (req, res, next) => {
  Category.find()
    .lean()
    .then((Category) => {
      res.render('new', { Category })
    })
    .catch(err => next(err))
})

// 導向編輯頁面
router.get('/:id/edit', (req, res, next) => {
  const userId = req.user._id
  const _id = req.params.id
  Promise.all([Record.findOne({ _id, userId }).lean(), Category.find().lean()])
    .then(results => {
      const [record, categories] = results
      record.date = changeDateformat(record.date)
      res.render('edit', { record, categories })
    })
    .catch(err => next(err))
})

router.delete('/:id', (req, res, next) => {
  const userId = req.user._id
  const _id = req.params.id
  Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(err => next(err))
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
], (req, res, next) => {
  const userId = req.user._id
  const { name, date, category, amount, detail, merchant } = req.body
  const errors = validationResult(req)
  Category.find()
    .lean()
    .then(Category => {
      if (!errors.isEmpty()) {
        const alert = errors.array()
        // console.log(alert)
        return res.render('new', { alert, name, date, Category, category, amount, detail, merchant })
      } else {
        Record.create({ name, date, category, amount, detail, merchant, userId })
        res.redirect('/')
      }
    })
    .catch(err => next(err))
})

// 修改新增的資料
router.put('/:id', (req, res, next) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, date, category, amount, detail, merchant } = req.body
  Record.findOne({ _id, userId })
    .then((record) => {
      record.name = name
      record.date = date
      record.category = category
      record.amount = amount
      record.detail = detail
      record.merchant = merchant
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(err => next(err))
})
module.exports = router
