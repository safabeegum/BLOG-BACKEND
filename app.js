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


//Sign In
app.post("/signin", async(req,res) => {
let input = req.body
let result = userModel.find({email:req.body.email}).then(
    (items) => {
        if (items.length>0)     //check if email id exist or not
        {
            const passwordValidator = Bcrypt.compareSync(req.body.password, items[0].password)      //if email exits, checks for password validation 
            if (passwordValidator)                      //if password matches, generate token 
            {
                jwt.sign({email:req.body.email}, "BlogApp",{expiresIn:"1d"}, 
                    (error, token) => {
                        if (error) 
                        {
                            res.json({"status": "error", "errorMessage": error})    
                        }
                        else
                        {
                            res.json({"status": "status", "token": token, "userId":items[0]._id})       //also given id of whoever logged in    
                        }
                    })
            } 
            else                    
            {
                res.json({"status": "Incorrect Password"})
            }
        } else 
        {
            res.json({"status": "Invalid Email ID"})
            
        }
    }
).catch()
})


//Sign Up 
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