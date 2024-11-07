const { default: mongoose } = require('mongoose')
const Department = require('../models/Department')
const Room = require('../models/Room')

const createRoom = async (req, res) => {
  const { depId, name, size } = req.body
  console.log(depId);
  try {
    const [roomWithName, roomDep] = await Promise.all([
      Room.findOne({ name, depId }),
      Department.findById(depId)
    ])


    if (roomWithName) {
      // in one department we cant have two rooms with same name
      return res.status(409).json({ success: false, msg: 'room name already exists in this department' })
    }

    if (roomDep) {
      await Room.create({ name, depId, type: roomDep.type, size })
      res.json({ success: 'true', msg: 'Room was created successfully' })
      return
    }
    return res.status(400).send({ success: false, msg: 'client error' })

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}


const updateRoom = async (req, res) => {
  const { _id, name, size } = req.body
  try {
    // make sure no room with same name in the same department
    let room = await Room.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId.createFromHexString(String(_id)) }
      },
      {
        $lookup: {
          from: 'rooms',
          let: { roomDepId: '$depId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $ne: [mongoose.Types.ObjectId.createFromHexString(String(_id)), '$_id'] },
                    { $eq: ['$$roomDepId', '$depId'] },
                    { $eq: [name, '$name'] }
                  ]
                }
              }
            },
            {
              $count: 'count'
            }
          ],
          as: 'roomsWithNewName'
        },
      },
      {
        $set: {
          roomsWithNewName: { $arrayElemAt: ['$roomsWithNewName', 0] },
        }
      }
    ])
    room = room[0]
    console.log(room);

    if (room?.roomsWithNewName?.count > 0) {
      return res.status(409).json({ success: false, msg: 'room name already exists in same department' })
    }

    // cant set room size less than current occupied beds
    if (room?.occupied > size) {
      return res.status(409).json({ success: false, msg: 'room occupied space' })
    }

    await Room.findByIdAndUpdate(_id, { name, size })
    return res.json({ success: 'true', msg: 'Room was updated successfully' })

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}


const deleteRoom = async (req, res) => {
  const { roomId } = req.body
  try {
    // ** need logic checks
    await Room.deleteOne({ _id: roomId })
    return res.json({ success: 'true', msg: 'Room was deleted successfully' })

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}


const getAvailableRooms = async (req, res) => {
  try {
    const availableRooms = await Room.find({ type: 'private', status: 'ACTIVE', $expr: { $gt: ['$size', '$occupied'] } }).populate('depId')
    const availableDepartments = await Department.find({ type: 'private' })
    res.json({ availableRooms, availableDepartments })

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}





module.exports = { createRoom, updateRoom, deleteRoom, getAvailableRooms }