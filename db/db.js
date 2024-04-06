const mongoose = require("mongoose")

module.exports = function connectDb(){
    mongoose.connect(process.env.MONGO_STRING).then((res)=>{
        console.log("DB connected", res)
    }).catch((err)=>{
        console.log(err.message)
    })
}