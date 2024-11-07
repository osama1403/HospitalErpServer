const express = require('express')
const { getActiveAdmissions, getAdmission, addNote, addAdmission, changeRoom } = require('../controllers/admissionsController')
const admissionsRouter = express.Router()

admissionsRouter.get('/', getActiveAdmissions)
admissionsRouter.get('/:id', getAdmission)
admissionsRouter.post('/', addAdmission)
admissionsRouter.post('/update/add-note', addNote)
admissionsRouter.post('/update/change-room', changeRoom)

module.exports = admissionsRouter