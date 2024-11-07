const express = require('express')
const { getAllStaff,getAllDoctors } = require('../controllers/staffController')
const staffRouter = express.Router()

staffRouter.get('/', getAllStaff)
staffRouter.get('/doctors', getAllDoctors)

module.exports = staffRouter