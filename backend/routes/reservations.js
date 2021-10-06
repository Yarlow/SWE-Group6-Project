const express = require("express")
const Reservation = require("../models/reservation")

const router = express.Router()

router.post('', (req, res, next) => {
  let reservation = new Reservation({
    hotel: req.body.hotel,
    user: req.body.user,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    price: req.body.price
  })
})


module.exports = router
