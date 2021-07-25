const db = require('../../config/mongoose')
const { recordSeeds } = require('./seed.json')
const Record = require('../Record')

db.once('open', () => {
  Record.create(recordSeeds)
    .then(() => {
      console.log('Record Seed done')
      return db.close()
    })
    .catch((error) => {
      console.log(error)
    })
})