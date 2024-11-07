const { differenceInYears } = require('date-fns')
const Admission = require('../models/Admission')
const Room = require('../models/Room')

const getAdmission = async (req, res) => {
  const { id } = req.params
  try {
    const admission = await Admission.findById(id).populate([
      {
        path: 'doctorId'
      }
      , {
        path: 'roomId',
        populate: {
          path: 'depId',
          select: 'name'
        },
        select: 'name depId'
      }]).sort({ notes: -1 })
    return res.json(admission)

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}


const getActiveAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find({ dischargeDate: { $exists: false } }).populate([
      {
        path: 'patientId'
      },
      {
        path: 'roomId',
        populate: {
          path: 'depId',
          select: 'name'
        },
        select: '_id name depId'
      }
    ]).lean()
    const admissionsTransformed = admissions.map(el => {
      const age = differenceInYears(new Date(), el.patientId.birthday)

      return {
        _id: el._id,
        date: el.date,
        age,
        patientId: el.patientId._id,
        name: el.patientId.firstName + ' ' + el.patientId.lastName,
        room: el.roomId.name,
        department: el.roomId.depId.name
      }
    })
    res.json(admissionsTransformed)
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}

const addNote = async (req, res) => {
  try {
    const { title, description, id } = req.body
    console.log(title);
    console.log(description);
    console.log(id);
    const n = await Admission.findByIdAndUpdate(id, {
      $push: { notes: { title, description, date: new Date() } }
    })
    res.json({ success: true, msg: 'note added successfully' })

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}

const addAdmission = async (req, res) => {
  try {
    const { patientId, cause, doctorId, roomId } = req.body
    const selectedRoom = await Room.findById(roomId)
    if (selectedRoom?.size === selectedRoom.occupied) {
      return res.status(409).json({ success: false, msg: 'room is full' })
    }
    const date = new Date()
    await Promise.all([
      Admission.create({ patientId, date, roomId, doctorId, notes: [{ title: 'Patient Admitted', description: cause, date }] }),
      Room.findByIdAndUpdate(roomId, { $inc: { occupied: 1 } })
    ])
    res.json({ success: true, msg: 'patient admitted successfully' })

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}



const changeRoom = async (req, res) => {
  try {
    const { id, roomId } = req.body
    const room = await Room.findById(roomId)
    if (room.size === room.occupied) {
      return res.status(409).json({ success: false, msg: 'room is full' })
    }
    const admission = await Admission.findById(id)



    await Promise.all([
      Admission.findByIdAndUpdate(id, { $set: { roomId } }),
      Room.bulkWrite([
        {
          updateOne: {
            filter: { _id: String(admission.roomId) },
            update: {
              $inc: { occupied: -1 },
            }
          }
        },
        {
          updateOne: {
            filter: { _id: roomId },
            update: {
              $inc: { occupied: 1 },
            }
          }
        }
      ])
    ])

    res.json({ success: true, msg: 'room changed successfully' })

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }

}


module.exports = { getAdmission, getActiveAdmissions, addNote, addAdmission, changeRoom }