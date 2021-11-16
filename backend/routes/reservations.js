const express = require("express")
const Reservation = require("../models/reservation")
const Hotel = require("../models/hotel")
const User = require("../models/user")
const reservation = require("../models/reservation")
const Room = require("../models/room")
const days = 1000 * 60 * 60 * 24
const reqDays = []
var ObjectId = require('mongoose').Types.ObjectId;

const router = express.Router()


router.post('', (req, res, next) => {

  //save user request information into variables
  const days = 1000 * 60 * 60 * 24

  //create array to save requested days into
  const reqDays = []

  //convert start and end dates to date objects
  var start = new Date(req.body.startDate)
  var end = new Date(req.body.endDate)

  //calculate the number of days requested by the user
  var difference = end - start
  const numOfDays = Math.floor(difference / days) + 1
  console.log("Number of days requested by user: " + numOfDays)

  //iterate through dates and add them to the requested dates array
  while (difference != 0) {
    reqDays.push(new Date(start))
    difference = end - start
    start.setDate(start.getDate() + 1)
  }

  /* findOne function is used to find a room that is available. breakdown of query passed as its arguement:
   * bookedOn: { $nin: reqDays } --> return a room that does not have any of these array values in it's bookedOn array
   * hotel: req.body.hotel --> room hotel id field must match that of the request
   * roomType: req.body.bedChoice --> room roomType field must match that of the request
   */

  Room.findOne({ bookedOn: { $nin: reqDays }, hotel: new ObjectId(req.body.hotel), roomType: req.body.bedChoice }, function (err, foundRoom) {
    //If a room was not found
    console.log(err)
    console.log(foundRoom)
    if (foundRoom == null) {
      console.log("dates unavailable")
      //respond
      res.status(400).json({
        message: "reservation is not available."
      })
    }
    //if a room is found
    else {
      //add the requested dates to the rooms bookedOn array
      for (i = 0; i <= numOfDays; i++) {
        foundRoom.bookedOn.push(reqDays[i])
      }

      //set the reservations room id equal to the found rooms id
      // reservation.Room = foundRoom._id

      //save the new reservation document and save the changes made to the existing room
      // console.log(reservation)
      let reservation = new Reservation({
        hotel: req.body.hotel,
        user: req.body.user,
        room: foundRoom._id,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        price: req.body.price,
        bedChoice: req.body.bedChoice
      })

      reservation.save()
      foundRoom.save()
      //respond
      res.status(200).json({
        message: "Reservation created and room bookedOn updated"
      })
    }
  })
})


/*Get reservations by room id*/
router.get('/:RoomId', (req, res, next) => {

  console.log('Room id passed in as a parameter: ' + req.params.RoomId)
  Room.findById(req.params.RoomId).then(foundRoom => {
    var start = new Date();
    console.log("desired start date: " + req.body.startDate)
    res.status(200).json({
      message: "ok",
      "room found": foundRoom
    })
  })
})

 /*
 * Delete a Reservation in the database. Added some error checking.
 * Response 404 indicates server cant find requested resource.
 */
 router.delete('/:id', (req, res, next) => {
  console.log("res being passed in: " + req.params.id)
  Reservation.findByIdAndRemove(req.params.id).populate('room').then(FoundReservation => {
    console.log("what was saved into variable: " + FoundReservation)
    //convert start and end dates to date objects
    var start = new Date(FoundReservation.startDate)
    var end = new Date(FoundReservation.endDate)

    //calculate the number of days requested by the user
    var difference = end - start
    const numOfDays = Math.floor(difference / days) + 1
    console.log("Number of days requested by user: " + numOfDays)

    //iterate through dates and add them to the requested dates array
    while (difference != 0) {
      reqDays.push(new Date(start))
      difference = end - start
      start.setDate(start.getDate() + 1)
    }

    let room = FoundReservation.room
    console.log("BEFORE DELETE BOKEOND")
    console.log(room)

    for (i = 0; i <= numOfDays; i++) {
      room.bookedOn.splice(room.bookedOn.indexOf(i),1)
    }

    console.log("After DELETE BOKEOND")
    console.log(room)

    room.save()
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

router.get('/test/please/work', (req, res, next) => {
  console.log("WTF")
})

module.exports = router
