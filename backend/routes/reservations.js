const express = require("express")
const Reservation = require("../models/reservation")
const Hotel = require("../models/hotel")
const User = require("../models/user")
const reservation = require("../models/reservation")
const Room = require("../models/room")

const router = express.Router()

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
  console.log("desired hotel: " + req.body.hotel)
  console.log("desired bed: " + req.body.bedChoice)
  const dates = [];
  
  Room.findOne({ hotel: req.body.hotel, roomType: req.body.bedChoice }).lean().exec(function (err, room) {
    if (err) {
      console.log(err)
    }
    else {
      const foundRoom = new Room(room)
      //js gets day before actual date for some reason, but dates are saved accurately in bookedOn array
      let start = new Date(req.body.startDate)
      let end = new Date(req.body.endDate)
      var i = 1;
      //incrementing days by 1
      start.setDate(start.getDate())
      end.setDate(end.getDate())
      
      var difference = end - start

      console.log("Start date: " + start)
      console.log("end date: " + end)
      console.log("difference between the two days: " + difference)

      //add the initial start date to the bookedOn array
      console.log("adding day: " + start)
      foundRoom.bookedOn.push(new Date(start))

      //iterate through days in reservation
      while (difference != 0) {
        console.log("INSIDE OF WHILE LOOP:")
        //increment the start day by one
        start.setDate(start.getDate() + 1)
        //add to bookedOn array
        console.log("adding day: " + start)
        foundRoom.bookedOn.push(new Date(start))
        //calulate difference again
        difference = end - start
        console.log("difference after iteration " + i + ":" + difference)
        i += 1;
      }
      
      console.log("Day after start date " + start)
      console.log("Room found: " + foundRoom)
      console.log("reserved: " + foundRoom.bookedOn)
      
    }
  })

  res.status(200).json({
    message: "ok"
  })

 /* //put the created reservation into the DB
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
  })*/
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
