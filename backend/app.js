const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const hotelsRoutes = require("./routes/hotels")
const reservationsRoutes = require("./routes/reservations")
const usersRoutes = require("./routes/users")


const app = express()

mongoose.connect("mongodb+srv://JShawver:sJBMVTGfqjaEBzGT@cluster0.kfyl3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>{
    console.log('connected to database!')
  })
  .catch(() => {
    console.log('connection failed!')
  })

mongoose.connect()

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-WIth, Content-Type, Accept, Authorization") // Headers can only have these, i think.
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT")
  next()
})

app.use("/api/hotels", hotelsRoutes)
app.use("/api/reservations", reservationsRoutes)
app.use("/api/users", usersRoutes)

module.exports = app
// sJBMVTGfqjaEBzGT
