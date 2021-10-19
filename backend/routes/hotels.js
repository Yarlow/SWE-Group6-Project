const express = require("express")
const Hotel = require("../models/hotel")

const router = express.Router()

router.get('', (req, res, next) => {
  Hotel.find().then(documents => {
    res.status(200).json({
      message: "Got Hotels",
      hotels: documents
    })
    console.log("hotels have been fetched")
  })
} )

router.get('/search', (req, res, next) => {
  // console.log(req.query)
  let query = {}
  var q = Hotel.find()
  q.where('name').equals('Jack MiHoff')
  console.log('bed choice ' + req.query.bed)
  if (req.query.hotelName){
    console.log("Hotel name query given")
    query = {...query, name: req.query.hotelName}
  }
  if (req.query.amenities){
    query = {...query, amenities: { $all :req.query.amenities}}
    // console.log(query)
  }
  if (req.query.minPrice || req.query.maxPrice) {
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
  }).catch(err => {
    console.log(err)
  })


  // Hotel.find().then(foundHotels => {
  //   foundHotels.where('name').contains('Jack');
  //   console.log(foundHotels)
  //   console.log("hi")
  // })




  res.status(200).json({message:"stfu"})

})

// router.get('/new', (req, res, next) => {
//   let hotel =
// })

module.exports = router
