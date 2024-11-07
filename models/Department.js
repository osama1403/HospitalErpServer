const mongoose = require('mongoose')
const Schema = mongoose.Schema


const departmentsSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['operational', 'private'],
    required: true
  },
})

module.exports = mongoose.model('department', departmentsSchema)