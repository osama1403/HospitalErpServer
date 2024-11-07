const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');

const handleLogin = async (req, res) => {
  const { userName, password } = req.body

  try {
    const user = await Account.findOne({ userName });

    if (user) {
      const verified = await bcrypt.compare(password, user.password);
      if (verified) {
        const userData = {
          name: user.firstName + ' ' + user.lastName,
          role: user.role
        }

        const JWT = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: `${60 * 60 * 24}s` })

        res.cookie('Token', JWT, { httpOnly: true, secure: 'true', sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 })
        return res.status(200).json(userData)
      }
    }

    return res.status(400).json({ success: false, msg: 'invalid credentials' })

  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, msg: 'server error' })
  }
}



const handleLogout = async (req, res) => {
  const Token = req.cookies?.Token
  if (Token) {
    res.clearCookie('Token', { httpOnly: true, secure: true, sameSite: 'none' })
    res.send('logged out')
  }
  res.send('not logged in')
}



module.exports = { handleLogin, handleLogout }