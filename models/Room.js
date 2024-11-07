const mongoose = require('mongoose')
const Schema = mongoose.Schema


const roomSchema = new Schema({
  depId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'department'
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['operational', 'private'],
    required: true
  },
  size: {
    type: Number,
    default: 1
  },
  occupied: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'MAINTAINANCE'],
    default: 'ACTIVE'
  }
})

module.exports = mongoose.model('room', roomSchema)