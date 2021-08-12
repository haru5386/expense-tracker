const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const { recordSeeds } = require('./seed.json')
const Record = require('../Record')
const User = require('../user')

const SEED_USER = [{
  name: 'User1',
  email: 'user1@example.com',
  password: '12345678',
}]

db.once('open', () => {
  Promise.all(Array.from(SEED_USER, (SEED_USER, i) => {
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(SEED_USER.password, salt))
      .then(hash => User.create({ name: SEED_USER.name, email: SEED_USER.email, password: hash }))
      .then(user => {
        const userId = user._id
        recordSeeds.forEach(record => record.userId = userId)
        return Record.create(recordSeeds)
      })
  }))
    .then(() => {
      console.log('User Record Seed done')
      process.exit()
    })
    .catch(error => console.log(error))
})