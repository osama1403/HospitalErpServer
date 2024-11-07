const express = require('express');
const mongoose = require('mongoose')
const connectDB = require('./db');
const apiRouter = require('./routers/api')
const cors = require('cors')
const app = express();
require('dotenv').config();


app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
connectDB()

app.use('/api', express.json(), apiRouter)


mongoose.connection.once('open', () => {
  console.log("DB connected");
  const server = app.listen(5000, () => { console.log('server is up on port 5000'); })
})

module.exports = app