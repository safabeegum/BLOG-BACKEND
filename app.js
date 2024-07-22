const Express = require("express")
const Mongoose = require("mongoose")
const Cors = require("cors")
const Bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("./models/users")

let app=Express()

app.use(Express.json())
app.use(Cors())

Mongoose.connect("mongodb+srv://safabeegum:mongodb24@cluster0.pbzbbey.mongodb.net/BlogApp?retryWrites=true&w=majority&appName=Cluster0")

app.post("/signup", async(req,res) => {
    
    let input = req.body            //read input
    let hashedPassword = Bcrypt.hashSync(req.body.password,10)          //password encryption
    req.body.password = hashedPassword


    //Password Validation
    userModel.find({email:req.body.email}).then(
        (items) => {
            if(items.length>0)                  //if same email id exists then print already exists
                {
                    res.json({"status":"Email ID already exist"})
                }
                else
                {
                    let result = new userModel(input)
                    result.save()
                    res.json({"status":"Success"})
                }
        }

    ).catch(
        (error)=>{}
    )
   
        
    })


app.listen(8080, () => {
    console.log("Server started")
})