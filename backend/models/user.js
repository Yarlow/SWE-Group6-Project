const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // reservations: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Reservation'
  // }],
  managerOf: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  }],

  role: {
    type: String,
    required: true,
    default: 'user'
  }
})


module.exports = mongoose.model('User', userSchema)
