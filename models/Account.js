const mongoose = require('mongoose')
const Schema = mongoose.Schema


const accountSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    validate: {
      validator: (v) => {
        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v)
      },
      message: 'not valid email'
    },
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['ADMIN', 'DOCTOR', 'NURSE', 'STAFF'],
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('account', accountSchema)