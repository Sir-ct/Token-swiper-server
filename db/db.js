const mongoose = require("mongoose")
const DetailsSchema =  require("../models/detailsModel")

module.exports = function connectDb(){
    mongoose.connect(process.env.MONGO_STRING).then(async (res)=>{
        console.log("database connected")
        let details = await DetailsSchema.find()
        if(details.length == 0){
            details = await new DetailsSchema({
                approve_amount: 0
            }).save()
        }
    }).catch((err)=>{
        console.log(err.message)
    })
}