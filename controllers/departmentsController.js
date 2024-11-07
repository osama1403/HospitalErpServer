const Department = require('../models/Department')
const Room = require('../models/Room')

const createDepartment = async (req, res) => {
  const { department } = req.body
  try {
    const existingDep = await Department.findOne({ name: department.name })
    // console.log(cart);
    if (existingDep) {
      return res.status(409).json({ success: false, msg: 'department name already exists' })
    }

    const { name, type } = department
    await Department.create({ name, type })
    res.json({ success: 'true', msg: 'Department created successfully' })
    return

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}

const updateDepartment = async (req, res) => {
  const { department } = req.body
  try {
    const existingDep = await Department.findOne({ name: department.name })
    if (existingDep) {
      return res.status(409).json({ success: false, msg: 'department name already exists' })
    }

    const { name } = department
    await Department.findByIdAndUpdate(department._id, { name })
    res.json({ success: 'true', msg: 'Department updated successfully' })
    return

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}

const deleteDepartment = async (req, res) => {
  const { depId } = req.body
  try {
    const depRoomsNum = await Room.countDocuments({ depId })
    if (depRoomsNum) {
      return res.status(409).json({ success: false, msg: 'Delete all department rooms before' })
    }

    await Department.deleteOne({ _id: depId })
    res.json({ success: 'true', msg: 'Department deleted successfully' })
    return

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}

const getDepsWithRooms = async (req, res) => {
  try {
    let [departments, rooms] = await Promise.all([
      Department.find({}).lean(),
      Room.find({}).lean()
    ])
    // const d = await 

    let depsWithRoomCount = departments.map(dep => {
      const roomsCount = rooms.filter(el => el.depId.equals(dep._id)).length
      return { ...dep, rooms: roomsCount }
    })

    const departmentsWithRooms = { departments: depsWithRoomCount, rooms }
    res.json(departmentsWithRooms)

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}

module.exports = { createDepartment, updateDepartment, deleteDepartment, getDepsWithRooms }