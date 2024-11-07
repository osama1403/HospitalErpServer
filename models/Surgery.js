const mongoose = require('mongoose')
const Schema = mongoose.Schema


const surgerySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  expEnd: {
    type: Date,
    required: true
  },
  staff: {
    type:[Schema.Types.ObjectId],
    ref:'staff'
  }

})

module.exports = mongoose.model('surgery', surgerySchema)