const express = require("express")
const { check, validationResult } = require('express-validator')
var passwordValidator = require('password-validator');
const User = require("../models/user")
const Reservation = require("../models/reservation")
const Hotel = require("../models/hotel")
const jwt = require("jsonwebtoken")
const router = express.Router()

var usernameSchema = new passwordValidator()
var passwordSchema = new passwordValidator()

/*
 *These two schemas will be used for form input validation. We do not want to just
 * accept anything and store in the database.
 */
//username validation
usernameSchema
  .is().min(6)
  .is().max(25)
  .has().not().spaces()

//password validation
passwordSchema
  .is().min(6)
  .is().max(25)
  // .has().uppercase()
  // .has().lowercase()
  // .has().digits(1)
  // .has().not().spaces()
  // //regex for special characters, one of these must be in pw
  // .has(/[!$?+]/)

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

  const usernameCheck = usernameSchema.validate(req.body.username)
  const passwordCheck = passwordSchema.validate(req.body.password)

  //if username and password are valid
  if (usernameCheck && passwordCheck) {

    //create user object from request data
    const user = new User({
      username: req.body.username,
      password: req.body.password
    })
    //save user into database
    user.save().then(createdUser => {
      res.status(201).json({
        message: "Made user",
        userId: createdUser._id
      })
    })
  } else {
    res.status(400).json({
      message: "check form data"
    })
  }
})

/*
 *This function takes login credentials from the user and
 * checks in database to see if they exist.
 */
router.post('/login', (req, res, next) => {
  console.log(req.body)
  //create query
  const insensitiveQuery = { username: { $regex: new RegExp(`^${req.body.username}$`), $options: 'i' } }

  //user query to find a match in the database
  User.findOne(insensitiveQuery).then(foundUser => {
    //if user not found, respond with 401
    if (!foundUser) {
      return res.status(401).json({
        message: "Username/password not found"
      })
    }
    //if user is found and the passwords match up, then enter this block
    if (foundUser.password == req.body.password) {
      //create a token
      const token = jwt.sign(
        {username: foundUser.username, userId: foundUser._id, role: foundUser.role},
        'secret_passphrase',
        { expiresIn: "6h" })

      console.log("Login success")
      console.log(foundUser)

      console.log("User Id " + foundUser._id)
      //200 response for successful login. Note token is included in response
      res.status(200).json({
        message: "Success",
        userId: foundUser._id,
        token: token,
        expiresIn: 6*3600 // 6 hours in seconds
      })
    }
    //if username matches but password does not
    else {
      return res.status(401).json( {
        message: "Username/password not found"
      })
    }
    //bit of a catch all for any errors that may occur
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
            managerOf: user.managerOf,
            role: user.role

          }
        })
      })

    }
    else {
      res.status(404).json({message: 'User Not Found'})
    }
  })
})

router.post('/token', (req, res, next) => {
  let token = req.body.token;
  if (!token){
    return res.status(401).json({message: 'No Token'})
  }

  jwt.verify(token, 'secret_passphrase', (err, user) => {
    console.log(user)
  })

})


/*
 * Delete a user in the database. Added some error checking.
 * Response 404 indicates server cant find requested resource.
 */
router.delete('/:id', (req, res, next) => {
  console.log("what is being passed as a parameter: " + req.params.id)
  User.findByIdAndRemove(req.params.id).then(FoundUser => {
    console.log("what is being saved in variabel: " + FoundUser)
    //reponse 404 if user does not exist in db
    if (FoundUser == null) {
      res.status(404).json({
        action: "user does not exist "
      })
    }
    //response 200 if user has been found and deleted
    else {
      res.status(200).json({
        user: FoundUser,
        action: "deleted"
      })
    }
  })
})


/*
 * This function allows a user to reset their password.
 */

router.patch('/editaccount', (req, res,) => {
  //first find the user that wants to change pw
  User.findById(req.body.userId).then(FoundUser => {
    //if their old password matches then reset to requested password
    if (FoundUser.password === req.body.oldPassword) {
      //set password and save into db
      FoundUser.password = req.body.newPassword
      FoundUser.save()
      //respond
      res.status(200).json({
        message: "ok"
      })
      //if passwords do not match respond with 401 unautorized
    } else {
      res.status(401).json({
        //no body required
      })
    }
  }).catch(err => {
    res.status(404).json({
      error: "user does not exist"
    })
  })
})


module.exports = router
