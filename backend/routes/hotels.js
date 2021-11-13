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
  var query = Hotel.find()
  console.log('bed choice ' + req.query.bed)
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



module.exports = router
