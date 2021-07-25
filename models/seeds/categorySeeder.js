const db = require('../../config/mongoose')
const { categorySeeds } = require('./seed.json')
const Category = require('../Category')

db.once('open', () => {
  Category.create(categorySeeds)
    .then(() => {
      console.log('Category Seed done')
      return db.close()
    })
    .catch((error) => {
      console.log(error)
    })
})