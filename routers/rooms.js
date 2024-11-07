const express = require('express')
const { createRoom, updateRoom, deleteRoom, getAvailableRooms } = require('../controllers/roomsController')
const roomsRouter = express.Router()

roomsRouter.post('/', createRoom)
roomsRouter.post('/update', updateRoom)
roomsRouter.post('/delete', deleteRoom)

roomsRouter.get('/available', getAvailableRooms)


module.exports = roomsRouter