const mongoose = require("mongoose")

const hotelSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rooms: {
    type: Number,
    require: true
  },
  price: {
    standard: Number,
    queen: Number,
    king: Number,
    weekendSurcharge: Number
  },
  amenities: {
    type: [String],
    required: true
  }
})

module.exports = mongoose.model('Hotel', hotelSchema)
