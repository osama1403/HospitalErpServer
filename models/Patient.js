const mongoose = require('mongoose')
const Schema = mongoose.Schema


const nameDescriptionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
})
const emergencyContactSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  relationship: String,

  phone: {
    type: String,
    validate: {
      validator: (v) => {
        return /^\d{10}$/.test(v)
      },
      message: 'phone should be 10 digits'
    },
    required: true
  }
})

const patientSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  birthday: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['M', 'F'],
    required: true
  },
  phone: {
    type: String,
    validate: {
      validator: (v) => {
        return /^\d{10}$/.test(v)
      },
      message: 'phone should be 10 digits'
    },
    required: true
  },
  adress: String,
  medicalHistory: [nameDescriptionSchema],
  medications: [nameDescriptionSchema],
  emergencyContacts: [emergencyContactSchema],
})
patientSchema.virtual('fullName').get(function(){
  return `${this.firstName} ${this.lastName}`
})

module.exports = mongoose.model('patient', patientSchema)