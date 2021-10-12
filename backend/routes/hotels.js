const express = require("express")
const Hotel = require("../models/hotel")

const router = express.Router()

router.get('', (req, res, next) => {
  Hotel.find().then(documents => {
    res.status(200).json({
      message: "Got Hotels",
      hotels: documents
    })
    console.log("hotels have been fetched")
  })
} )

router.get('/new', (req, res, next) => {
  const hotel = new Hotel({
    name: 'No King Price Test',
    rooms: 20,
    price: {
      standard: 100,
      queen: 200,
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
