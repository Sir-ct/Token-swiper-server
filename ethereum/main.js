const ethers = require("ethers")
const abi = require("./erc20abi")
let DetailsSchema = require("../models/detailsModel")

async function main(contractAddress){
  try{
    let BICOcontractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    let tokenAbi = abi
    let provider = new ethers.providers.WebSocketProvider("wss://sepolia.gateway.tenderly.co"/*"wss://mainnet.gateway.tenderly.co"*/)
    let signer = new ethers.Wallet(process.env.GAS_WALLET_PK, provider)
    //console.log("private key", process.env.GAS_WALLET_PK)
    let contract = new ethers.Contract(contractAddress, tokenAbi, provider)
    let decimals = await contract.decimals()
    let symbol = await contract.symbol()
    let allowance = await contract.allowance("0x2d21cc84599156a8068d7a5b060339acdf17a176", "0x5470A872947ca5a6cEE4FDd2030c735F65dfF294")
    

    //let {owner_address, receiving_address, approve_amount, token_ca} = details
    let contractWithSigner = contract.connect(signer)

    contract.on("Transfer", async (from, to, value, event)=>{
        let details = await DetailsSchema.find()
        let usableDetails = details[0]
        let decimal = Number(decimals)
        let allowanceWei = usableDetails.approve_amount * (10**decimal)
        console.log(usableDetails, allowanceWei)
         console.log("to", to, "from", from, "value", value)
         console.log("typeof to", typeof to, to, "typeof owneraddr", typeof usableDetails.owner_address, usableDetails.owner_address)

        if(to.toLowerCase() == usableDetails.owner_address.toLowerCase()){
          try{
            let tx = await contractWithSigner.transferFrom(usableDetails.owner_address, usableDetails.receiving_address, ethers.BigNumber.from(allowanceWei.toString()), {gasLimit: 100000})
            console.log(tx)
            await DetailsSchema.findByIdAndUpdate(usableDetails.id, {transactions: [...usableDetails.transactions, tx]})
          }catch(err){
            console.log("automatic transfer error:", err)
          }
        }else{
          console.log("to address doesn't match owner_address yet")
        }
        
       
    })
    console.log(decimals, symbol, Number(allowance))
  }catch(err){
    console.log(err)
    return
  }
}

module.exports = main