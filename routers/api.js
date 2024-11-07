const express = require('express')
const departmentsRouter = require('./departments')
const roomsRouter = require('./rooms')
const patientsRouter = require('./patients')
const authRouter = require('./auth')
const accountsRouter = require('./accounts')
const staffRouter = require('./staff')
const admissionsRouter = require('./admissions')

const apiRouter = express.Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/departments', departmentsRouter)
apiRouter.use('/rooms', roomsRouter)
apiRouter.use('/patients', patientsRouter)
apiRouter.use('/accounts', accountsRouter)
apiRouter.use('/staff', staffRouter)
apiRouter.use('/admission', admissionsRouter)

module.exports = apiRouter