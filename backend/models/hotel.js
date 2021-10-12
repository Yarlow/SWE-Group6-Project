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
  },
  managerPassword: {
    type: String,
    required: true
  }
  // reservations: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Reservation'
  // }
  // availability: {
  //   date: {
  //     type: Date,
  //     required: true
  //   },
  //   booked: {
  //     type: Boolean,
  //     required: true,
  //     default: false
  //   }
  // }
})

module.exports = mongoose.model('Hotel', hotelSchema)
