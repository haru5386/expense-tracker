const mongoose = require('mongoose')
const Schema = mongoose.Schema
const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  iconClass: {
    type: String,
    required: true
  }
})
module.exports = mongoose.model('Category', categorySchema)