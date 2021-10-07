const express = require("express")
const Reservation = require("../models/reservation")
const Hotel = require("../models/hotel")
const User = require("../models/user")

const router = express.Router()

router.post('', (req, res, next) => {
  let reservation = new Reservation({
    hotel: req.body.hotel,
    user: req.body.user,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    price: req.body.price
  })

  reservation.save().then(createdRes => {
    let user = User.findById(req.body.user).then(user => {
      console.log(user)
      user.reservations.push(createdRes._id)
      user.save().then(updatedUser => {
        console.log(updatedUser)
      })
    })

    createdRes.populate('hotel').then(populatedRes => {
      // console.log(populatedRes.hotel.name)
      // console.log(populatedRes)
      res.status(201).json({
        message: 'Was it made right?'
      })

    })
  })

})


module.exports = router
