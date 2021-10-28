const express = require("express")
const Reservation = require("../models/reservation")
const Hotel = require("../models/hotel")
const User = require("../models/user")

const router = express.Router()


/*
 * every reservation has a user, so iterate through reservations and match up user objects ids
 */
//create a reservation and insert into the database
router.post('', (req, res, next) => {
  //create new reservation with data sent in request
  let reservation = new Reservation({
    hotel: req.body.hotel,
    user: req.body.user,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    price: req.body.price,
    bedChoice: req.body.bedChoice
  })

  console.log("START" + reservation.startDate)
  console.log("END" + reservation.endDate)

  //put the created reservation into the DB
  reservation.save().then(createdRes => {
    // let user = User.findById(req.body.user).then(user => {
    //   console.log(user)
    //   user.reservations.push(createdRes._id)
    //   user.save().then(updatedUser => {
    //     console.log(updatedUser)
    //   })
    // })

    createdRes.populate('hotel').then(populatedRes => {
      // console.log(populatedRes.hotel.name)
      // console.log(populatedRes)
      res.status(201).json({
        message: 'Was it made right?'
      })

    })
  })

})

 /*
 * Delete a Reservation in the database. Added some error checking.
 * Response 404 indicates server cant find requested resource.
 */
router.delete('/:id', (req, res, next) => {
  console.log("res being passed in: " + req.params.id)
  Reservation.findByIdAndRemove(req.params.id).then(FoundReservation => {
    console.log("what was saved into variable: " + FoundReservation)
    //if reservation is not in the db
    if (FoundReservation == null) {
      res.status(404).json({
        error: "reservation does not exist "
      })
    }
    //if res has been found and deleted
    else {
      res.status(200).json({
        reservation: FoundReservation,
        action: "deleted"
      })
    }
  })

})

//this method will get all of the reservations for a specific user. The user id is accepted as a parameter via the url
router.get('/user/:id', (req, res, next) => {

  // console.log("finding reservations for user " + req.params.id)

  // User.findById(req.params.id).then(foundUser => {
  //
  //   console.log(foundUser.reservations[0])
  //   console.log(foundUser.reservations[1])
  //   console.log(foundUser.reservations[2])
  //
  //   res.status(200).json({
  //     message: "success"
  //   })
  //
  // })

  Reservation.find({user: req.params.id}).populate('hotel').then(foundReservations => {
    // console.log(foundReservations)
    // let populatedRes = []
    // for (reservation of foundReservations){
    //   reservation.populate("hotel").then(populatedReservation => {
    //     populatedRes.push(populatedReservation)
    //     console.log(populatedReservation)
    //   })
    // }
    console.log(foundReservations)
    // foundReservations.populate("hotel").then(populatedReservations => {
      // console.log(populatedReservations)
      res.status(200).json({
        message: "success",
        reservations: foundReservations
      })
    // })
  })

})

//This method will update a reservation in the database
router.patch('/:id', (req, res, next) => {
  Reservation.findByIdAndUpdate(req.params.id, req.body).then(foundReservation => {
    console.log("found reservation with id " + foundReservation._id)
    //change the reservations end date
    console.log("this reservation ends " + foundReservation.endDate)
    res.status(200).json({
      message: "found reservation",
      id: req.body._id
    })
  })
})
  //tried doing differently to add some error checking but no dice...
  /*
  var foundUser = User.findById(req.params.id)

  if (foundUser == null) {
    console.log("This user does not exist")
    res.status(400).json({
      message: "failure"
    })
  }
  else {
    console.log("getting reservations for user " + req.params.id + "....")
    res.status(200).json({
      message: "success"
    })
  }
  */


module.exports = router
