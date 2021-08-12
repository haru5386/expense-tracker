const express = require('express')
const router = express.Router()

const Record = require('../../models/Record')
const Category = require('../../models/Category')
const { total, changeDateformat, isEmpty } = require('../../public/javacripts/helpfunction')

router.get('/', (req, res) => {
  const userId = req.user._id
  const searchMonth = req.query.searchMonth
  const searchCategory = req.query.searchCategory
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
      if (isEmpty(req.query)) {
        searchRecord = records
      } else if (searchCategory === 'all' || ' ') {
        records.filter((record) => {
          if (searchMonth === record.date.slice(0, 7)) {
            searchRecord.push(record)
          }
        })
      } else if (searchCategory || searchMonth) {
        records.filter((record) => {
          if (searchCategory === record.category) {
            if (searchMonth === record.date.slice(0, 7)) {
              searchRecord.push(record)
            }
          }
        })
      } else {
        let errMsg = "您的搜尋不存在"
        return res.status(422).render('error', { errMsg })
      }
      const totalAmount = total(searchRecord)
      res.render('index', { records: searchRecord, totalAmount, categories, nowMonth, minMonth, searchCategory })
    })
    .catch(error => {
      console.log(error)
      res.status(422).render('error', { errMsg: error.message })
    })
})

module.exports = router