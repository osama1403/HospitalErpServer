const mongoose = require('mongoose')
const Schema = mongoose.Schema

admissionNote = new Schema({
  title: {
    type: String,
    required: true
  },

  description: String,

  date: {
    type: Date,
    required: true
  },
  importance: {
    type: Number,
    enum: [1, 2, 3],
    default: 1
  }
})


const admissionSchema = new Schema({
  patientId: {
    type: Schema.ObjectId,
    required: true,
    ref:'patient'
  },
  date: {
    type: Date,
    required: true
  },
  roomId:{
    type: Schema.ObjectId,
    required: true,
    ref:'room'
  },

  dischargeDate: Date,

  expectedDischarge: {
    type: String,
    default: '-'
  },
  doctorId: {
    type: Schema.ObjectId,
    required:true,
    ref: 'staff'
  },
  notes: [admissionNote]
})

module.exports = mongoose.model('admission', admissionSchema)