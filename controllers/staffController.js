const Staff = require("../models/Staff");

const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().populate('account', 'role')

    return res.json(staff)
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, msg: 'server error' })
  }
}

const getAllDoctors = async (req, res) => {
  try {
    const staff = await Staff.aggregate([
      {
        $lookup: {
          from: 'accounts',
          localField: 'account',
          foreignField: '_id',
          as: 'account'
        }
      },
      {
        $unwind: '$account'
      },
      {
        $match: { 'account.role': 'DOCTOR' }
      },
      {
        $project:{
          '_id':1,
          'name':1,
          'specialization':1
        }
      }
    ])

    return res.json(staff)
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, msg: 'server error' })
  }
}
module.exports = { getAllStaff, getAllDoctors }