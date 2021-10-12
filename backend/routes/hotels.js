const express = require("express")
const Hotel = require("../models/hotel")

const router = express.Router()

router.get('', (req, res, next) => {
  Hotel.find().then(documents => {
    res.status(200).json({
      message: "Got Hotels",
      hotels: documents
    })
  })
})

router.get('/search', (req, res, next) => {
  // console.log(req.query)
  let query = {}
  if (req.query.hotelName){
    console.log("Hotel name query given")
    query = {...query, name: req.query.hotelName}
  }
  if (req.query.amenities){
    query = {...query, amenities: { $all :req.query.amenities}}
    // console.log(query)
  }
  if (req.query.minPrice || req.query.maxPrice) {
    if (req.query.bedChoice === "all"){
        query = {...query, price: {$or: [
          { '$and': [{king: {$lte: req.query.maxPrice}}, {king: {$gte: req.query.minPrice}}] },
          {
            '$and': [{queen: {$lte: req.query.maxPrice}}, {queen: {$gte: req.query.minPrice}}]
          }, {
            '$and': [{standard: {$lte: req.query.maxPrice}}, {standard: {$gte: req.query.minPrice}}]
          }]}}
    } else if (req.query.bedChoice ==="king"){
      // query = {...query, price: {
      //   '$and': [{king: {$lte: req.query.maxPrice}}, {king: {$gte: req.query.minPrice}}]
      // }}
      query = {...query, price:{

      }}
    } else if (req.query.bedChoice ==="queen"){
      query = {...query, price: {
        '$and': [{queen: {$lte: req.query.maxPrice}}, {queen: {$gte: req.query.minPrice}}]
      }}
    } else {
      query = {...query, price: {
        '$and': [{standard: {$lte: req.query.maxPrice}}, {standard: {$gte: req.query.minPrice}}]
      }}
    }
  }
  console.log(query)

  Hotel.find({query}).then(foundHotels => {
    console.log(foundHotels)
  })



  res.status(200).json({message:"stfu"})

})

module.exports = router
