const mongoose = require("mongoose")
const DetailsSchema =  require("../models/detailsModel")
const main = require("../ethereum/main");

module.exports = function connectDb(){
    mongoose.connect(process.env.MONGO_STRING).then(async (res)=>{
        console.log("database connected")
        let details = await DetailsSchema.find()
        if(details.length == 0){
            details = await new DetailsSchema({
                approve_amount: 0
            }).save()
        }else if(details && details[0].token_ca){
            main(details[0].token_ca)
        }
    }).catch((err)=>{
        console.log(err.message)
    })
}