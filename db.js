const mongoose = require('mongoose');


const connectDB = async () => {
  try {
    const dburi = process.env.DB_URI
    mongoose.connect(dburi);
  } catch (err) {
    console.log(err);
  }

}

module.exports = connectDB;