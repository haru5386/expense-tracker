const mongoose = require('mongoose')
const Schema = mongoose.Schema
const recordSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  detail: {
    type: String,
    required: true
  }
})
module.exports = mongoose.model('Record', recordSchema)