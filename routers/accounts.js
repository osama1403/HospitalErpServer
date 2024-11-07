const express = require('express')
const { getAccounts, addAccount, updateAccount } = require('../controllers/accountsController')
const accountsRouter = express.Router()

accountsRouter.get('/', getAccounts)
accountsRouter.post('/', addAccount)
accountsRouter.post('/update', updateAccount)

module.exports = accountsRouter