const express = require('express')
const { createDepartment, updateDepartment, deleteDepartment, getDepsWithRooms } = require('../controllers/departmentsController')
const departmentsRouter = express.Router()

departmentsRouter.post('/', createDepartment)
departmentsRouter.post('/update', updateDepartment)
departmentsRouter.post('/delete', deleteDepartment)

departmentsRouter.get('/wrooms', getDepsWithRooms)



module.exports = departmentsRouter