/* These functions handle requests regarding hotels. Such as
 * what hotels exist, how many rooms they have, amenities and
 * so forth.
 */
const express = require("express")
const Hotel = require("../models/hotel")
const Room = require("../models/room")
const router = express.Router()

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
} )

/*
 * Search hotels
 */
router.get('/search', (req, res, next) => {
  // console.log(req.query)
  let query = {}
  var q = Hotel.find()
  console.log('bed choice ' + req.query.bed)
  if (req.query.hotelName){


    // q.regex('name', `^${req.query.hotelName}$`)
    // q.find({name: { $regex: new RegExp(`^${req.query.hotelName}$`), $options: 'i'}})
    // q.where('name').in(`/${req.query.hotelName}/i`)
    // q.find({name: { $regex: `/${req.query.hotelName}/i`}})
    // q.regex('name', /${req.query.hotelName}/i)

    const regEx = new RegExp(req.query.hotelName, 'i')

    q.regex('name', regEx)

//    q.regex('name', /`Jack`/i) THIS WORKS

    console.log("Hotel name query given " + req.query.hotelName)

  }
  if (req.query.amenities){
      // q.where('amenities').contains(req.query.amenities)
      if (req.query.amenities === req.query.amenities+''){
        q.where('amenities').in(req.query.amenities)
      } else {
        let amenitiesQuery = {}
        q.where('amenities').all(req.query.amenities)
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
      q.or(
        [q.where('price.standard').gt(req.query.minPrice).lt(req.query.maxPrice),
        q.where('price.queen').gt(req.query.minPrice).lt(req.query.maxPrice),
        q.where('price.king').gt(req.query.minPrice).lt(req.query.maxPrice)]
      )
      // q.where('price.standard').gt(req.query.minPrice)

    } else if (req.query.bed ==="Standard"){

      q.where('price.standard').gt(req.query.minPrice)//.and().lt(req.query.maxPrice)
      q.where('price.standard').lt(req.query.maxPrice)
      console.log('minprice ' + req.query.minPrice)
      console.log('maxPrice ' + req.query.maxPrice)

    } else if (req.query.bedChoice ==="Queen"){
      q.where('price.queen').gt(req.query.minPrice)//.and().lt(req.query.maxPrice)
      q.where('price.queen').lt(req.query.maxPrice)
    } else {
      q.where('price.king').gt(req.query.minPrice)//.and().lt(req.query.maxPrice)
      q.where('price.king').lt(req.query.maxPrice)
    }
  }
  console.log(query)



  q.exec().then(hotels => {
    console.log(hotels)
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
  let hotel = {
    name: req.body.name,
    rooms: req.body.rooms,
    amenities: req.body.amenities,
  }

  //3 possiblities for pricing. standard, queen, or king.
  if (req.body.price.standard){
    hotel = {
      ...hotel,
      price: {
        ...hotel.price,
        standard: req.body.price.standard.replace('$', "")
      }
    }
  }
  if (req.body.price.queen) {
    hotel = {
      ...hotel,
      price: {
        ...hotel.price,
        queen: req.body.price.queen.replace('$', "")
      }
    }
  }
  if (req.body.price.king) {
    hotel = {
      ...hotel,
      price: {
        ...hotel.price,
        king: req.body.price.king.replace('$', "")
      }
    }
  }
  if (req.body.price.weekendSurcharge) {
    hotel = {
      ...hotel,
      price: {
        ...hotel.price,
        weekendSurcharge: req.body.price.weekendSurcharge
      }
    }
  }

  //Create the hotel based on the request data and save to db
  const hotelObj = new Hotel(hotel)
  hotelObj.save().then(createdHotel => {
    let numStandard = createdHotel.rooms * 0.5;
    let numQueen = createdHotel.rooms * 0.3;
    let numKing = createdHotel.rooms * 0.2;
    const standardRoom = {
      hotel: createdHotel._id,
      roomType: "standard",
    }
    const queenRoom ={
      hotel: createdHotel._id,
      roomType: "queen",
    }
    const kingRoom = {
      hotel: createdHotel._id,
      roomType: "king",
    }
    for (; numStandard > 0; numStandard--){
      let standRoomObj = new Room(standardRoom)
      standRoomObj.save()
    }
    for (; numQueen > 0; numQueen--){
      let queenRoomObj = new Room(queenRoom)
      queenRoomObj.save()
    }
    for (; numKing > 0; numKing--){
      let kingRoomObj = new Room(kingRoom)
      kingRoomObj.save()
    }
    return res.status(200).json({message: "noice"});
  })

})

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

module.exports = router
