const express = require('express')
const router = express.Router()

const Record = require('../../models/Record')
const Category = require('../../models/Category')
const { total, changeDateformat, isEmpty } = require('../../public/javacripts/helpfunction')

router.get('/', (req, res) => {
  const searchCategory = req.query.searchCategory
  Promise.all([Record.find().lean(), Category.find().lean()])
    .then(results => {
      const [records, categories] = results
      let searchRecord = []
      if (isEmpty(req.query) || searchCategory === 'all') {
        searchRecord = records
      } else if (searchCategory) {
        searchRecord = records.filter((record) => searchCategory === record.category)
      } else {
        let wrongWord = "您的搜尋不存在"
        return res.render('wrong', { wrongWord })
      }
      const totalAmount = total(searchRecord)
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

module.exports = router