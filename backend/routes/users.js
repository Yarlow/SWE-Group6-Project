const express = require("express")
const User = require("../models/user")
const Reservation = require("../models/reservation")
const Hotel = require("../models/hotel")
const jwt = require("jsonwebtoken")
const router = express.Router()

router.get('/new', (req, res, next) => {
  const user = new User({
    username: 'Test',
    password: 'Test',
  })
  user.save().then(createdUser => {
    res.status(201).json({
      message: "Made user",
      userId: createdUser._id
    })
  }).catch( err => {
    res.status(500).json({
      error: err
    })
  })
})

router.post('', (req, res, next) => {
  if (req.body.hotelKey){
    let hotel = null
    console.log("Hotel Key Attempt")
    Hotel.find({managerPassword: req.body.hotelKey}).then(foundHotel => {
      if (!foundHotel){
        return res.status(404).json({
          message: "Hotel Not Found"
        })
      }
      hotel = foundHotel
      console.log(foundHotel)
    })

  }
  console.log(req.body)
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })

  user.save().then(createdUser => {
    res.status(201).json({
      message: "Made user",
      userId: createdUser._id
    })
  }).catch( err => {
    res.status(500).json({
      error: err
    })
  })
})

router.post('/login', (req, res, next) => {
  console.log(req.body)
  const insensitiveQuery = {username: { $regex: new RegExp(`^${req.body.username}$`), $options: 'i'}}
  User.findOne(insensitiveQuery).then(foundUser => {
    if (!foundUser){
      return res.status(401).json( {
        message: "Username/password not found"
      })
    }
    if (foundUser.password == req.body.password) {

      const token = jwt.sign(
        {username: foundUser.username, userId: foundUser._id},
        'secret_passphrase',
        { expiresIn: "6h" })

      console.log("Login success")
      // res.status(200).json({
      //   message: "Login Success",
      //   user: foundUser._id
      // })
      console.log("User Id " + foundUser._id)

      res.status(200).json({
        message: "Success",
        userId: foundUser._id,
        token: token,
        expiresIn: 6*3600 // 6 hours in seconds
      })
    } else {
      return res.status(401).json( {
        message: "Username/password not found"
      })
    }

  }).catch( err => {
    console.log("but error??????")
    console.log(err)
    res.status(500).json({
      message: "Error",
      error: err
    })
  })
})

router.get('/:id', (req,res,next) => {
  User.findById(req.params.id).then(user => {
    if (user) {
      Reservation.find({user: user._id}).populate('hotel').then(reservations => {
        // console.log("Reservationss" + reservations)
        // console.log("USER " + user)
        // console.log(reservations)
        for(reservation of reservations){
          // console.log(reservation)
          // reservation.populate('hotel').then(popres =>{
          //   console.log(popres)
          // })
        }
        res.status(200).json({
          user: {
            _id: user._id,
            username: user.username,
            reservations: reservations,
            managerOf: user.managerOf

          }
        })
      })

    }
    // if (user){
    //   console.log(user)
    //   user.populate('reservations')
    //   user.populate('managerOf')
    //   res.status(200).json({
    //     user: {
    //       _id: user._id,
    //       username: user.username,
    //       reservations: user.reservations,
    //       managerOf: user.managerOf
    //
    //     }
    //   })
    // }
    else {
      res.status(404).json({message: 'User Not Found'})
    }
  })
})

module.exports = router
