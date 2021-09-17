const mongoose = require("mongoose")

const hotelSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    require: true
  },
  priceWeekday: {
    type: Number, // will a decimal work here?
    required: true
  },
  priceWeekend: {
    type: Number, // will a decimal work here?
    required: true
  },
  amenities: {
    type: [String],
    required: true
  },
  numRooms: {
    type: number, // should this be available rooms or total rooms? or a separate field for available rooms and one for total rooms
    required: true
  }
})

module.exports = mongoose.model('Hotel', hotelSchema)
