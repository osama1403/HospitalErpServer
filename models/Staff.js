const mongoose = require('mongoose')
const Schema = mongoose.Schema


const staffSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  account: {
    type: Schema.Types.ObjectId,
    required: true,
    ref:'account'
  }

})

module.exports = mongoose.model('staff', staffSchema)