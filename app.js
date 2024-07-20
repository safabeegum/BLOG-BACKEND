const Express = require("express")
const Mongoose = require("mongoose")
const Cors = require("cors")
const Bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

let app=Express()

app.get("/", (req,res) => {
    res.send("hello")
})

app.listen((8080, () => {
    console.log("Server started")
}))