// import { expect } from "chai";
// import { ethers } from "hardhat";
// import "dotenv/config"
// import { token } from "../typechain-types/@openzeppelin/contracts";
// const hre = require("hardhat");

// describe("LazyNFT Testing", function () {
//     it("Signing Messages", async function () {
      
//       // Gets first two accounts set in hardhat.config.ts
//       const [user1, user2] = await ethers.getSigners();

//       const LazyNFT = await hre.ethers.getContractFactory("LazyNFT");
//       console.log('Deploying LazyNFT...');
//       const lazynft = await LazyNFT.deploy(user1.address);
  
//       await lazynft.deployed();
//       console.log("LazyNFT deployed to:", lazynft.address);

//       const tokenURI = "https://gateway.pinata.cloud/ipfs/QmNmgJyrU3qQcG24Gn33FXUkPRQ7JaFdb7pjWqWvdEzfMS"

//       const SIGNING_DOMAIN_NAME = "Voucher-Domain"
//       const SIGNING_DOMAIN_VERSION = "1"
//       const chainId = await ethers.provider.getNetwork(); // this returns an object
//       const contractAddress = lazynft.address 
//       // const signer = new ethers.Wallet("503f38a9c967ed597e47fe25643985f032b072db8075426a92110f82df48dfcb") // private key that I use for address 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
  
//       const domain = {
//         name: SIGNING_DOMAIN_NAME,
//         version: SIGNING_DOMAIN_VERSION,
//         verifyingContract: contractAddress,
//         chainId: chainId.chainId
//       }
  
//       async function createVoucher(_tokenId: any, _price: any, _uri: any, _buyer: any) {
//         const voucher = { 
//             tokenId: _tokenId, 
//             price: _price, 
//             uri: _uri, 
//             buyer: _buyer 
//         }

//         const types = {
//           LazyNFTVoucher: [
//             {name: "tokenId", type: "uint256"},
//             {name: "price", type: "uint256"},
//             {name: "uri", type: "string"},
//             {name: "buyer", type: "address"}
//           ]
//         }
  
//         const signature = await user1._signTypedData(domain, types, voucher)
//         return {
//           ...voucher,
//           signature
//         }
//       }
  
//       async function main() {
//         const voucher = await createVoucher(7, 100, tokenURI, user1.address) // the address is the address which receives the NFT
//         console.log(`[${voucher.tokenId}, ${voucher.price}, "${voucher.uri}", "${voucher.buyer}", "${voucher.signature}"]`)
//         console.log("Balance of Account 1: ", await (await ethers.provider.getBalance(user1.address)).toString());    
//         await lazynft.connect(user1).safeMint(voucher)
//         console.log(await lazynft.tokenURI(voucher.tokenId));
//         console.log(await lazynft.recover(voucher));
//       }

//       await main();
 

//     //   // minting to user1 
//     //   await lazynft.mintNFT(user1.address, tokenURI);
//     });
// });