const express = require('express')
const { getAllStaff } = require('../controllers/staffController')
const staffRouter = express.Router()

staffRouter.get('/', getAllStaff)
staffRouter.get('/doctors', getAllStaff)

module.exports = staffRouter