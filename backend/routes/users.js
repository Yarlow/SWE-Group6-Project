const express = require("express")
const User = require("../models/user")
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
        { expiresIn: "1h" })

      console.log("Login success")
      // res.status(200).json({
      //   message: "Login Success",
      //   user: foundUser._id
      // })

      return res.status(200).json({
        message: "Success",
        token: token
      })
    } else {
      return res.status(401).json( {
        message: "Not Found"
      })
    }

  }).catch( err => {
    res.status(500).json({
      message: "Error",
      error: err
    })
  })
})

module.exports = router
