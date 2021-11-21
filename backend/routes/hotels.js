/* These functions handle requests regarding hotels. Such as
 * what hotels exist, how many rooms they have, amenities and
 * so forth.
 */
const express = require("express")
const hotel = require("../models/hotel")
const Hotel = require("../models/hotel")
const Room = require("../models/room")
const router = express.Router()
const User = require("../models/user")

/*
 * This function takes a hotel objectId and uses it to query
 * for the correspoing hotel. If found, 200 response, else 404.
*/

router.get('/search/one/:id', (req, res) => {

  //mongoose calls .then() function if a hotel is found, if not an error is thrown and caught at the end of this function
  Hotel.findById(req.params.id).then(foundHotel => {
    User.find().where('managerOf').in(foundHotel._id).exec().then(currentManagers => {
      res.status(200).json({
        hotel: foundHotel,
        managers: currentManagers
      })

    }).catch(err => {
      res.status(200).json({
        hotel: foundHotel
      })
    })

  }).catch(err => {

    res.status(404).json({
      //no body required
    })

  })
})

/*
 * get list of  existing hotels.
 */
// router.get('', async (req, res, next) => {
//   Hotel.find().then(documents => {
//     res.status(200).json({
//       message: "Got Hotels",
//       hotels: documents
//     })
//     console.log("hotels have been fetched")
//   })
// })


router.get('/test', (req,res,next) => {
  res.status(200).json({message:"Fuck"})
})

/*
 * Search hotels
 * to-do: Incorporate date range into the search query.
 */
router.get('', async (req, res, next) => {
  console.log(req.query)
  // res.status(200).json({message:"Fuck You"})
  var query = Hotel.find()
  if (Object.keys(req.query).length !== 0){
    if (req.query.hotelName){
      const regEx = new RegExp(req.query.hotelName, 'i')
      query.regex('name', regEx)
    }
    if (req.query.amenities){
      // q.where('amenities').contains(req.query.amenities)
      if (req.query.amenities === req.query.amenities+''){
        query.where('amenities').in(req.query.amenities)
      } else {
        let amenitiesQuery = {}
        query.where('amenities').all(req.query.amenities)
      }
    }
    if (req.query.minPrice || req.query.maxPrice) {

      if (req.query.bed === "Any"){
        query.or([
          {'price.standard': { $gt: req.query.minPrice, $lt: req.query.maxPrice}},
          {'price.queen': { $gt: req.query.minPrice, $lt: req.query.maxPrice}},
          {'price.king': { $gt: req.query.minPrice, $lt: req.query.maxPrice}},
        ])



      } else if (req.query.bed ==="Standard"){

        query.where('price.standard').gt(req.query.minPrice)//.and().lt(req.query.maxPrice)
        query.where('price.standard').lt(req.query.maxPrice)
        console.log('minprice ' + req.query.minPrice)
        console.log('maxPrice ' + req.query.maxPrice)

      } else if (req.query.bed ==="Queen"){
        query.where('price.queen').gt(req.query.minPrice)//.and().lt(req.query.maxPrice)
        query.where('price.queen').lt(req.query.maxPrice)
      } else {
        query.where('price.king').gt(req.query.minPrice)//.and().lt(req.query.maxPrice)
        query.where('price.king').lt(req.query.maxPrice)
      }
    }

    if (req.query.bed !=='Any' && !req.query.startDate) {
      let bedChoiceRooms
      await Room.find({ roomType: req.query.bed.toLowerCase() }).distinct('hotel').then(hotels => {
        console.log("hotels")
        console.log(hotels)
        bedChoiceRooms = hotels;
      })
      query.where('_id').in(bedChoiceRooms)

    }

    if (req.query.startDate) {
      const days = 1000 * 60 * 60 * 24
      const reqDays = []
      var start = new Date(req.query.startDate)
      var end = new Date(req.query.endDate)
      var difference = end - start
      const numOfDays = Math.floor(difference / days) + 1
      while (difference != 0) {
        reqDays.push(new Date(start))
        difference = end - start
        start.setDate(start.getDate() + 1)
      }
      let hotelsWithRooms

      if (req.query.bed === 'Any') {
        await Room.find({ bookedOn: { $nin: reqDays }}).distinct('hotel').then(hotels => {
          console.log(hotels)
          hotelsWithRooms = hotels;
        })
        query.where('_id').in(hotelsWithRooms)
      } else {
        console.log(req.query.bed)
        await Room.find({ bookedOn: { $nin: reqDays }, roomType: req.query.bed.toLowerCase() }).distinct('hotel').then(hotels => {
          console.log(hotels)
          hotelsWithRooms = hotels
        })
        query.where('_id').in(hotelsWithRooms)
      }

    }

  }



  query.exec().then(hotels => {
    console.log("exec")
    return res.status(200).json({
        hotels: hotels,
        message: "success"
    })
  }).catch(err => {
    console.log('err')
    console.log(err)
  })


  // Hotel.find().then(foundHotels => {
  //   foundHotels.where('name').contains('Jack');
  //   console.log(foundHotels)
  //   console.log("hi")
  // })




  // res.status(200).json({message:"stfu"})

})


/*
 * Create a hotel and insert into the db.
 */
router.post('', (req, res, next) => {
  //get JSON request data and save into local variables
  // console.log(req.body)
  let hotel = {
    name: req.body.hotel.name,
    rooms: req.body.hotel.rooms,
    amenities: req.body.hotel.amenities ? req.body.hotel.amenities : [],
  }

  //3 possiblities for pricing. standard, queen, or king.
  if (req.body.hotel.price.standard){
    hotel = {
      ...hotel,
      price: {
        ...hotel.price,
        standard: req.body.hotel.price.standard.replace('$', "")
      }
    }
  }
  if (req.body.hotel.price.queen) {
    hotel = {
      ...hotel,
      price: {
        ...hotel.price,
        queen: req.body.hotel.price.queen.replace('$', "")
      }
    }
  }
  if (req.body.hotel.price.king) {
    hotel = {
      ...hotel,
      price: {
        ...hotel.price,
        king: req.body.hotel.price.king.replace('$', "")
      }
    }
  }
  if (req.body.hotel.price.weekendSurcharge) {
    hotel = {
      ...hotel,
      price: {
        ...hotel.price,
        weekendSurcharge: req.body.hotel.price.weekendSurcharge
      }
    }
  }

  //Create the hotel based on the request data and save to db
  const hotelObj = new Hotel(hotel)
  hotelObj.save().then(createdHotel => {

    createRooms(createdHotel)


    if (req.body.managerUsernames) {
      addupdatedManagersToHotel(req.body.managerUsernames, createdHotel._id).then(() => {
        return res.status(200).json({
          message: "noice"
        })
      }).catch(uncurrentManagers => {
        return res.status(200).json({
          message: "updatedManagers don't exist",
          createdHotel,
          uncurrentManagers
        })
      })
    } else {
      return res.status(200).json({message: "noice"});

    }

  })

})

function createRooms(createdHotel) {
  const hotelId = createdHotel._id;
  const numTotalRooms = createdHotel.rooms
  let countOfRoomTypes = 0
  countOfRoomTypes = createdHotel.price.standard ? ++countOfRoomTypes : countOfRoomTypes;
  countOfRoomTypes = createdHotel.price.queen ? ++countOfRoomTypes : countOfRoomTypes;
  countOfRoomTypes = createdHotel.price.king ? ++countOfRoomTypes : countOfRoomTypes;
  console.log(createdHotel)

  let rooms = createdHotel.price;
  console.log("rooms" ,rooms)
  delete rooms['weekendSurcharge'];
  console.log(rooms)

  let roomTypes = Object.keys(rooms);

  let roomTypesFix = []
  // for some reason. Object.keys() gives me all of the Model's object, even though what was passed in doesn't have the field
  // so i gotsta get tricky
  for (room of roomTypes) {
    if (rooms[room]) {
      roomTypesFix.push(room)
    }
  }

  roomTypes = roomTypesFix

  console.log("roomTypes")
  console.log(roomTypes)

  const sortRoomsBy = {
    'standard': 0,
    'queen': 1,
    'king': 2
  }

  const sortedRooms = roomTypes.sort((a, b) => {
    sortRoomsBy[a.state] - sortRoomsBy[b.state]
  })

  console.log("sortedRoomes")
  console.log(sortedRooms)

  let roomWeightObject = {}
  console.log("countOfRoomTypes: ", countOfRoomTypes)
  if (countOfRoomTypes === 3) {
    roomWeightObject = {
      'standard': numTotalRooms * 0.5,
      'queen': numTotalRooms * 0.3,
      'king':numTotalRooms * 0.2
    }
  } else if (countOfRoomTypes === 2) {
    roomWeightObject[sortedRooms[0]] = numTotalRooms * 0.5
    roomWeightObject[sortedRooms[1]] = numTotalRooms * 0.5
  } else {
    roomWeightObject[sortedRooms[0]] = numTotalRooms
  }

  console.log("roomWeightObject")
  console.log(roomWeightObject)

  for (let roomType of sortedRooms) {
    let room = {
      hotel: hotelId,
      roomType: roomType
    }
    console.log(room)
    console.log(roomWeightObject[roomType])
    let num = roomWeightObject[roomType]
    for (; num > 0; num--) {
      let roomObj = new Room(room);
      roomObj.save()
    }

  }

  //
  //
  // let numStandard = createdHotel.rooms * 0.5;
  // let numQueen = createdHotel.rooms * 0.3;
  // let numKing = createdHotel.rooms * 0.2;
  // const standardRoom = {
  //   hotel: createdHotel._id,
  //   roomType: "standard",
  // }
  // const queenRoom ={
  //   hotel: createdHotel._id,
  //   roomType: "queen",
  // }
  // const kingRoom = {
  //   hotel: createdHotel._id,
  //   roomType: "king",
  // }
  // for (; numStandard > 0; numStandard--){
  //   let standRoomObj = new Room(standardRoom)
  //   standRoomObj.save()
  // }
  // for (; numQueen > 0; numQueen--){
  //   let queenRoomObj = new Room(queenRoom)
  //   queenRoomObj.save()
  // }
  // for (; numKing > 0; numKing--){
  //   let kingRoomObj = new Room(kingRoom)
  //   kingRoomObj.save()
  // }


}

async function addupdatedManagersToHotel(usernames, hotelId) {

  return new Promise( async (resolve, reject) => {
    // check if usernames is NOT an array. if it isn't, turn it into one so i can loop through
    if (!Array.isArray(usernames)){
      usernames = [usernames].flat()
    }

    let uncurrentManagers = []
    for (let username of usernames) {
      await User.findOne({username: username}).then(foundUser => {
        console.log(foundUser)
        foundUser.managerOf.push(hotelId)
        foundUser.save()
      }).catch(err => {
        uncurrentManagers.push(username)
      })
    }
    if (!uncurrentManagers) {
      resolve()
    } else {
      reject(uncurrentManagers)
    }
  })
}

async function removeHotelManagers(username, hotelId) {
  User.findOne({username: username}).then(foundUser => {
    console.log("Removing Manager: " + foundUser)
    let index = foundUser.indexof(hotelId)
    foundUser.managerOf.splice(index, 1)
  })
}

router.patch('', (req, res, next) => {

  /* Front end will send a json object of a hotel to the backend. This function will compare those fields with the existing
   * hotel and update anything that is different.
   */

  //create hotel out of the json object in request update form
  let hotel = req.body.hotel
  let hotelId = req.body.hotelId
  let updatedManagers = req.body.managerUsernames
  console.log("*****updatedManagers******: \n")
  for(i = 0;i < updatedManagers.length;i++){
    console.log(updatedManagers[i])
  }
  console.log("HOTEL IN THE REQUEST: ")
  console.log(hotel)

  User.find({ managerOf: req.body.hotelId }, function (err, currentManagers) {
    console.log("*****Users Found*****")
    console.log(currentManagers)
    if(currentManagers.length < updatedManagers.length){
      addupdatedManagersToHotel(updatedManagers,hotelId)
        .then(function (value) { console.log(value) })
        .catch(err => console.log(err))
    } else if (updatedManagers.length < currentManagers.length){
      for(i = 0;i < currentManagers.length;i++){
        if(!updatedManagers.includes(currentManagers[i])){
          let username = currentManagers[i]
          removeHotelManagers(username, hotelId)
            .then(function (value) { console.log(value) })
            .catch(err => console.log(err))
        }
      }
    } else {
      console.log("*** No manager updates ***")
    }
  })

  //query for the hotel in the database
  Hotel.findOne({ _id: req.body.hotelId }, function (err, foundDoc) {
  console.log("EXISTING HOTEL IN DATABASE: " + foundDoc)

    //if unknown error occurred
    if (err) {
      res.status(500).json({
        message: "Error",
        err: err
      })
      console.log("something went wrong")
      //if the document was not found in the database
    } else if (!foundDoc){
        res.status(404).json({
          message: "404"
        })
      //if the document was found in the database
    } else {

      //compare fields. Change document if field has changed.
      if (foundDoc.name != hotel.name) {
        console.log("user would like to change the hotel name to: " + hotel.name)
        foundDoc.name = hotel.name
      }
      //what happens to exising rooms when we change this?
      if (foundDoc.rooms != hotel.rooms) {
        console.log("user would like to change the number of rooms to: " + hotel.rooms)
        foundDoc.rooms = hotel.rooms
      }
      if (foundDoc.price.standard != hotel.price.standard) {
        console.log("user would like to change standard room price to: " + hotel.price.standard)
        foundDoc.price.standard = hotel.price.standard
      }
      if (foundDoc.price.queen != hotel.price.queen) {
        console.log("user would like to change queen room price to: " + hotel.price.queen)
        foundDoc.price.queen = hotel.price.queen
      }
      if (foundDoc.price.king != hotel.price.king) {
        console.log("user would like to change king room price to: " + hotel.price.king)
        foundDoc.price.king = hotel.price.king
      }
      if (foundDoc.price.weekendSurcharge != hotel.price.weekendSurcharge) {
        console.log("user would like to change weekend surcharge to: " + hotel.price.weekendSurcharge)
        foundDoc.price.weekendSurcharge = hotel.price.weekendSurcharge
      }
      //this is not a valid way to compare arrays, does not work but will fix in future
      if (foundDoc.amenities != hotel.amenities) {
        console.log("user would like to change amenities to: " + hotel.amenities)
        foundDoc.amenities = hotel.amenities
      }
      if (foundDoc.managerPassword != hotel.managerPassword) {
        console.log("user would like to change the manager password to: " + hotel.managerPassword)
        foundDoc.managerPassword = hotel.managerPassword
      }


      //save changes made to the document
      //foundDoc.save()
    }
    //respond to request
    res.status(200).json({
      message: "success",
      name: foundDoc.name,

    })
  })
})

router.get('/search/manager', (req, res, next) => {
  console.log('res received')
  let query = Hotel.find();
  let hotelIds = req.query.hotelId
  console.log(hotelIds)
  query.where('_id').in(hotelIds)
  query.exec().then(hotels => {
    console.log(hotels)
    res.status(200).json({
      hotels: hotels
    })
  })

})

module.exports = router
