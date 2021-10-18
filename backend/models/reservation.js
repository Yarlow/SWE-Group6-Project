const mongoose = require("mongoose")

const reservationSchema = mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  bedChoice: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Reservation', reservationSchema)
