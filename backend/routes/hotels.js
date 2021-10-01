const express = require("express")
const Hotel = require("../models/hotel")

const router = express.Router()

router.get('', (req, res, next) => {
  Hotel.find().then(documents => {
    res.status(200).json({
      message: "Got Hotels",
      hotels: documents
    })
  })
})

router.get('/new', (req, res, next) => {
  const hotel = new Hotel({
    name: 'No amenities Test Hotel',
    rooms: 20,
    price: {
      standard: 100,
      queen: 200,
      king: 300,
      weekendSurcharge: 0.15
    }
  })

  hotel.save().then(createdHotel => {
    res.status(201).json({
      message: "Made hotel",
      hotelId: createdHotel._id
    })
  })

})
module.exports = router
