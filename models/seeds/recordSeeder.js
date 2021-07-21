const db = require('../../config/mongoose')
const { recordSeeds } = require('./seed.json')
const Record = require('../Record')

db.once('open', () => {
  for (recordSeed of recordSeeds) {
    Record.create({
      name: recordSeed.name,
      detail: recordSeed.detail,
      category: recordSeed.category,
      date: recordSeed.date,
      amount: recordSeed.amount

    })
  }
  console.log('Record seed done')
})