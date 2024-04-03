const ethers = require("ethers")
const abi = require("./erc20abi")
const db = require("../config/db")

async function main(){

    let BICOcontractAddress ="0x6C4da7995555F85B6178138091CC513204b830a0" //"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    let tokenAbi = abi
    let provider = new ethers.providers.WebSocketProvider(
      /*"wss://ethereum-rpc.publicnode.com"*/
      "wss://ethereum-sepolia-rpc.publicnode.com"
    )
  
    let contract = new ethers.Contract(BICOcontractAddress, tokenAbi, provider)
    let decimals = await contract.decimals()
    let symbol = await contract.symbol()

    let [currentOwnerAddress, currentReceiverAddress, signer, amount] = await db.getMany(["owner-address", "receiving-address", "signer", "approve-amount"])
    let contractWithSigner = contract.connect(signer)

    contract.on("Transfer", (from, to, value, event)=>{
        let info = {
            from: from,
            to: to,
            value: ethers.utils.formatUnits(value, decimals)
        }
        
        if(currentOwnerAddress && signer && to == currentOwnerAddress){
            let tx = contractWithSigner.transferFrom(currentOwnerAddress, currentReceiverAddress, amount)
            console.log(tx)
        }
        
        console.log(JSON.stringify(info))
    })
    console.log(decimals, symbol)
  }

module.exports = main