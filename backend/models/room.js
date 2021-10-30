const mongoose = require("mongoose")

const roomSchema = mongoose.Schema({
  hotel:{
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  },
  roomType: {
    type: String
  },
  bookedOn: {
    type: [Date],
    default: ["alex"]
  }
})

module.exports = mongoose.model('Room', roomSchema)
