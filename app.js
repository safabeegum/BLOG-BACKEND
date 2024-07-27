const Express = require("express")
const Mongoose = require("mongoose")
const Cors = require("cors")
const Bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("./models/users")
const postModel = require("./models/posts")

let app=Express()

app.use(Express.json())
app.use(Cors())

Mongoose.connect("mongodb+srv://safabeegum:mongodb24@cluster0.pbzbbey.mongodb.net/BlogApp?retryWrites=true&w=majority&appName=Cluster0")

//create a Post
app.post("/create",async(req,res) => {
    let input = req.body
    
    //pass awt token and validate token, otherwise anyone could post 
    //either pass through body or through headers
    //through headers--->
    let token = req.headers.token
    
    //verify token
    jwt.verify(token,"BlogApp",async(error, decoded)=> {
        if (decoded && decoded.email) 
        {
            let result = new postModel(input)
            await result.save()
            res.json({"status":"Success"})
        } 
        else    //if token is wrong, post cannot be posted
        {
            res.json({"status":"Invalid Authentication"})
        }
    })
})


//View All Posts
app.post("/viewall", (req,res) => {
        
    let token = req.headers.token

    jwt.verify(token, "BlogApp", (error,decoded) => {
        if (decoded && decoded.email) 
        {
            postModel.find().then(
                (items) => {
                    res.json(items)
                }
            ).catch(
                (error) => {
                    res.json({"status":"Error"})
                }
            )
        } 
        else 
        {
            res.json({"status":"Invalid Authentication"})
        }
    })
})


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