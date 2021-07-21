const db = require('../../config/mongoose')
const { categorySeeds } = require('./seed.json')
const Category = require('../Category')

db.once('open', () => {
  for (categorySeed of categorySeeds) {
    Category.create({
      name: categorySeed.name,
      iconClass: categorySeed.iconClass
    })
  }
  console.log('Category Seed done')
})