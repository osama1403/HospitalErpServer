const Account = require("../models/Account");
const bcrypt = require('bcrypt');
const Staff = require("../models/Staff");
const { default: mongoose } = require("mongoose");


const addAccount = async (req, res) => {
  try {
    const { userName, role, email, password } = req.body
    const existingUserName = await Account.exists({ userName })
    if (existingUserName) {
      return res.status(409).json({ success: false, msg: 'username already exists' })
    }
    const encPassword = await bcrypt.hash(password, 4)

    const account = await Account.create({ userName, role, email, password: encPassword })
    if (role === 'DOCTOR' || role === 'NURSE') {
      const { name, specialization } = req.body.staff
      await Staff.create({ name, specialization, account: account._id })
    }
    return res.json({ success: true, msg: 'account created successfully' })

  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, msg: 'server error' })
  }
}

const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.aggregate([
      {
        $lookup: {
          from: 'staffs',
          localField: '_id',
          foreignField: 'account',
          as: 'staffAccount',
        }
      },
      {
        $project: {
          '_id': 1,
          'userName': 1,
          'email': 1,
          'role': 1,
          'staffAccount._id': 1
        }
      }
    ])

    return res.json(accounts)
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, msg: 'server error' })
  }
}


const updateAccount = async (req, res) => {
  try {
    const { _id, userName, email } = req.body
    const existingUserName = await Account.exists({ userName })
    if (existingUserName) {
      return res.status(409).json({ success: false, msg: 'username already exists' })
    }
    await Account.findByIdAndUpdate(_id, { userName, email })
    return res.json({ success: true, msg: 'account updated successfully' })
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, msg: 'server error' })
  }
}



module.exports = { addAccount, getAccounts, updateAccount }