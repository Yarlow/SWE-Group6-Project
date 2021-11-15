/* These functions handle requests regarding hotels. Such as
 * what hotels exist, how many rooms they have, amenities and
 * so forth.
 */
const express = require("express")
const Hotel = require("../models/hotel")
const Room = require("../models/room")
const router = express.Router()
const User = require("../models/user")

/*
 * This function takes a hotel objectId and uses it to query
 * for the correspoing hotel. If found, 200 response, else 404.
*/

router.get('/:id', (req, res) => {

  //mongoose calls .then() function if a hotel is found, if not an error is thrown and caught at the end of this function
  Hotel.findById(req.params.id).then(foundHotel => {
    User.find().where('managerOf').in(foundHotel._id).exec().then(foundUsers => {
      res.status(200).json({
        hotel: foundHotel,
        managers: foundUsers
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
router.get('', (req, res, next) => {
  Hotel.find().then(documents => {
    res.status(200).json({
      message: "Got Hotels",
      hotels: documents
    })
    console.log("hotels have been fetched")
  })
})


router.get('/test', (req,res,next) => {
  res.status(200).json({message:"Fuck"})
})

/*
 * Search hotels
 * to-do: Incorporate date range into the search query.
 */
router.get('/search/filter', (req, res, next) => {
  // res.status(200).json({message:"Fuck You"})
  console.log("Hey fucker")
  var query = Hotel.find()
  // console.log('bed choice ' + req.query.bed)
  if (req.query.hotelName){


    // q.regex('name', `^${req.query.hotelName}$`)
    // q.find({name: { $regex: new RegExp(`^${req.query.hotelName}$`), $options: 'i'}})
    // q.where('name').in(`/${req.query.hotelName}/i`)
    // q.find({name: { $regex: `/${req.query.hotelName}/i`}})
    // q.regex('name', /${req.query.hotelName}/i)

    const regEx = new RegExp(req.query.hotelName, 'i')

    query.regex('name', regEx)
//    q.regex('name', /`Jack`/i) THIS WORKS

    console.log("Hotel name query given " + req.query.hotelName)

  }
  if (req.query.amenities){
      // q.where('amenities').contains(req.query.amenities)
      if (req.query.amenities === req.query.amenities+''){
        query.where('amenities').in(req.query.amenities)
      } else {
        let amenitiesQuery = {}
        query.where('amenities').all(req.query.amenities)
        // for (let amen of req.query.amenities) {
        //   console.log(amen)
        //   amenitiesQuery = {
        //     ...amenitiesQuery,
        //     'amenities': {$in: {amen}}
        //   }
        //   // q.where('amenities').in(amen)
        // }
        // q.and(amenitiesQuery)

      }
  }
  if (req.query.minPrice || req.query.maxPrice) {
    // let minPrice = req.query.minPrice ?? 0
    // let maxPrice = req.query.maxPrice ?? 0

    if (req.query.bedChoice === "Any"){
      query.or(
        [query.where('price.standard').gt(req.query.minPrice).lt(req.query.maxPrice),
        query.where('price.queen').gt(req.query.minPrice).lt(req.query.maxPrice),
        query.where('price.king').gt(req.query.minPrice).lt(req.query.maxPrice)]
      )
      // q.where('price.standard').gt(req.query.minPrice)

    } else if (req.query.bed ==="Standard"){

      query.where('price.standard').gt(req.query.minPrice)//.and().lt(req.query.maxPrice)
      query.where('price.standard').lt(req.query.maxPrice)
      console.log('minprice ' + req.query.minPrice)
      console.log('maxPrice ' + req.query.maxPrice)

    } else if (req.query.bedChoice ==="Queen"){
      query.where('price.queen').gt(req.query.minPrice)//.and().lt(req.query.maxPrice)
      query.where('price.queen').lt(req.query.maxPrice)
    } else {
      query.where('price.king').gt(req.query.minPrice)//.and().lt(req.query.maxPrice)
      query.where('price.king').lt(req.query.maxPrice)
    }
  }



  query.exec().then(hotels => {
    return res.status(200).json({
        hotels: hotels,
        message: "success"
    })
  }).catch(err => {
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
    amenities:req.body.hotel.amenities,
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
      addManagersToHotel(req.body.managerUsernames, createdHotel._id).then(() => {
        return res.status(200).json({
          message: "noice"
        })
      }).catch(unFoundUsers => {
        return res.status(200).json({
          message: "managers don't exist",
          createdHotel,
          unFoundUsers
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

async function addManagersToHotel(usernames, hotelId) {
  return new Promise( async (resolve, reject) => {
    // check if usernames is NOT an array. if it isn't, turn it into one so i can loop through
    if (!Array.isArray(usernames)){
      usernames = [usernames].flat()
    }

    let unFoundUsers = []
    for (let username of usernames) {
      await User.findOne({username: username}).then(foundUser => {
        console.log(foundUser)
        foundUser.managerOf.push(hotelId)
        foundUser.save()
      }).catch(err => {
        unFoundUsers.push(username)
      })
    }
    if (!unFoundUsers) {
      resolve()
    } else {
      reject(unFoundUsers)
    }
  })
}

router.patch('/edithotel', (req, res, next) => {

  /* From the examples I am finding online, findByIdAndUpdate works if you know what will be changing prior to the function call so I am going
   * to use findOne and compare values for now. I am going to assume that all fields will be sent in the request, but only the changed fields will
   * be different than what they were previous to the request. I can definitely refactor in the future, just want to have something that works.*/

  Hotel.findOne({ _id: req.body.id }, function (err, foundDoc) {

    if (err) {
      console.log("something went fooking wrong")
    }
    else {
      console.log("king price: " + foundDoc.price.king)
      //compare fields. Change document if field has changed.
      if (foundDoc.name != req.body.name) {
        console.log("user would like to change the hotel name to: " + req.body.name)
        foundDoc.name = req.body.name
      }
      //what happens to exising rooms when we change this?
      if (foundDoc.rooms != req.body.rooms) {
        console.log("user would like to change the number of rooms to: " + req.body.rooms)
        foundDoc.rooms = req.body.rooms
      }
      if (foundDoc.price.standard != req.body.price.standard) {
        console.log("user would like to change standard room price to: " + req.body.price.standard)
        foundDoc.price.standard = req.body.price.standard
      }
      if (foundDoc.price.queen != req.body.price.queen) {
        console.log("user would like to change queen room price to: " + req.body.price.queen)
        foundDoc.price.queen = req.body.price.queen
      }
      if (foundDoc.price.king != req.body.price.king) {
        console.log("user would like to change king room price to: " + req.body.price.king)
        foundDoc.price.king = req.body.price.king
      }
      if (foundDoc.price.weekendSurcharge != req.body.price.weekendSurcharge) {
        console.log("user would like to change weekend surcharge to: " + req.body.price.weekendSurcharge)
        foundDoc.price.weekendSurcharge = req.body.price.weekendSurcharge
      }
      //this is not a valid way to compare arrays, does not work but will fix in future
      if (foundDoc.amenities != req.body.amenities) {
        console.log("user would like to change amenities to: " + req.body.amenities)
        foundDoc.amenities = req.body.amenities
      }
      if (foundDoc.managerPassword != req.body.managerPassword) {
        console.log("user would like to change the manager password to: " + req.body.managerPassword)
        foundDoc.managerPassword = req.body.managerPassword
      }

      //save changes made to the document
      foundDoc.save()
    }
    //respond to request
    res.status(200).json({
      message: "found reservation",
      name: foundDoc.name,

    })
  })
})

router.get('/search/manager', (req, res, next) => {
  console.log('res received')
  let query = Hotel.find();
  let hotelIds = req.query.hotelId
  console.log(hotelIds)
  query.where('_id').in(req.query.amenities)
  query.exec().then(hotels => {
    console.log(hotels)
    res.status(200).json({
      hotels: hotels
    })
  })

})

module.exports = router
