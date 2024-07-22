const Mongoose = require("mongoose")

const userSchema = Mongoose.Schema(
    {
        firstname:
        {
            type: String,
            required: true
        },
        lastname:
        {
            type: String,
            required: true
        },
        phone:
        {
            type: String,
            required: true
        },
        email:
        {
            type: String,
            required: true
        },
        username:
        {
            type: String,
            required: true
        },
        password:
        {
            type: String,
            required: true
        },
    }
)

var userModel = Mongoose.model("users",userSchema)
module.exports=userModel