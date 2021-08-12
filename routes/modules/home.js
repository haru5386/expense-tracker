const express = require('express')
const router = express.Router()

const Record = require('../../models/Record')
const Category = require('../../models/Category')
const { total, changeDateformat, isEmpty } = require('../../public/javacripts/helpfunction')

router.get('/', (req, res, next) => {
  const userId = req.user._id
  const searchMonth = req.query.searchMonth
  const searchCategory = req.query.searchCategory
  const searchArray = ['searchCategory', 'searchMonth']
  Promise.all([Record.find({ userId }).lean(), Category.find().lean()])
    .then(results => {
      let [records, categories] = results
      let searchRecord = []
      // 加上icon 轉換日期
      records.forEach((record) => {
        categories.forEach((category) => {
          if (record.category === category.name) {
            record.iconClass = category.iconClass
          }
        })
        record.date = changeDateformat(record.date)
      })
      // 按日期排序
      records = records.sort((a, b) => {
        return a.date < b.date ? 1 : -1
      })
      // 前台目前、最小月數
      let nowMonth = searchMonth ? searchMonth : records[0].date.slice(0, 7)
      const minMonth = records[records.length - 1].date.slice(0, 7)
      // 篩選條件
      // 沒有req.query
      if (isEmpty(req.query)) {
        searchRecord = records

      } else if (JSON.stringify(Object.keys(req.query)) !== JSON.stringify(searchArray)) {
        // req.query不是'searchCategory', 'searchMonth'
        let message = "您的搜尋不存在"
        return res.status(422).render('error', { message })
      } else if (searchCategory === 'all') {
        // 篩選月份
        records.filter((record) => {
          if (searchMonth === record.date.slice(0, 7)) {
            searchRecord.push(record)
          }
        })
      } else {
        // 篩選月份+類別
        records.filter((record) => {
          if (searchCategory === record.category) {
            if (searchMonth === record.date.slice(0, 7)) {
              searchRecord.push(record)
            }
          }
        })
      }
      const totalAmount = total(searchRecord)
      res.render('index', { records: searchRecord, totalAmount, categories, nowMonth, minMonth, searchCategory })
    })
    .catch(err => next(err))
})

module.exports = router