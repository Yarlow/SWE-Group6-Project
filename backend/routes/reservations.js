const express = require("express")
const Reservation = require("../models/reservation")
const Hotel = require("../models/hotel")
const User = require("../models/user")
const reservation = require("../models/reservation")
const Room = require("../models/room")

const router = express.Router()


router.post('', (req, res, next) => {

  //save user request information into variables
  let reservation = new Reservation({
    hotel: req.body.hotel,
    user: req.body.user,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    price: req.body.price,
    bedChoice: req.body.bedChoice
  })

  const days = 1000 * 60 * 60 * 24

  //create array to save requested days into
  const reqDays = []
  //convert start and end dates to date objects
  var start = new Date(req.body.startDate)
  var end = new Date(req.body.endDate)

  //dates received from postman are a day behind, may have to fix in the future. For now I will increment received dates by 1 day.
  start.setDate(start.getDate() + 1)
  end.setDate(end.getDate() + 1)

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
  
  //this loop displays what is saved into the requested dates array 
  for (i = 0; i < 3; i++) {
    console.log(reqDays[i].toLocaleDateString('en-US'))
  }

  /* findOne function is used to find a room that is available. breakdown of query passed as its arguement:
   * bookedOn: { $nin: reqDays } --> return a room that does not have any of these array values in it's bookedOn array
   * hotel: req.body.hotel --> room hotel id field must match that of the request
   * roomType: req.body.bedChoice --> room roomType field must match that of the request
   */
  Room.findOne({ bookedOn: { $nin: reqDays }, hotel: req.body.hotel, roomType: req.body.bedChoice }, function(err, foundRoom) {
    //If a room was not found
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
      reservation.Room = foundRoom._id

      //save the new reservation document and save the changes made to the existing room 
      reservation.save()
      foundRoom.save()
      //respond 
      res.status(200).json({
        message: "Reservation created and room bookedOn updated"
      })
    }
    
  })
})

/*//create a reservation and insert into the database
router.post('', (req, res, next) => {
  //save user request information into variables
  let reservation = new Reservation({
    hotel: req.body.hotel,
    user: req.body.user,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    price: req.body.price,
    bedChoice: req.body.bedChoice
  })

  
  const requestedDates = [];
  //save reservation to database
  const resObj = new Reservation(reservation)
  //save room id to the reservation model if dates are good  
  resObj.save();
  
  Room.findOne({ hotel: req.body.hotel, roomType: req.body.bedChoice }).exec(function (err, foundRoom) {
    if (err) {
      console.log(err)
    }
    else {
      //const foundRoom = new Room(room)
      //js gets day before actual date for some reason, but dates are saved accurately in bookedOn array
      let start = new Date(req.body.startDate)
      let end = new Date(req.body.endDate)
      var i = 1;

      console.log("Start date: " + start)
      console.log("end date: " + end)
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
      //all of this will happen if the room is availale on the requested dates 
*//*
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
      }*//*
      
      console.log("Day after start date " + start)
      console.log("Room found: " + foundRoom)
      console.log("reserved: " + foundRoom.bookedOn)

      *//* We have added data to the bookedOn array of the found room, so we need  
       * to save the changes made to it.
       *//*
      console.log("Right before the save function is called")
      *//* Only if room is available on given dates 
       * foundRoom.save()
       *//*
    }
  })

  res.status(200).json({
    message: "ok"
  })

 *//* //put the created reservation into the DB
  reservation.save().then(createdRes => {
    // let user = User.findById(req.body.user).then(user => {
    //   console.log(user)
    //   user.reservations.push(createdRes._id)
    //   user.save().then(updatedUser => {
    //     console.log(updatedUser)
    //   })
    // })

   


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
