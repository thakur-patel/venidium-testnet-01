// import { expect } from "chai";
// import { ethers } from "hardhat";
// import "dotenv/config"
// const hre = require("hardhat");

// describe("OneNFT Testing", function () {
//     it("Signing Messages", async function () {
      
//       const OneNFT = await hre.ethers.getContractFactory("OneNFT");
//       console.log('Deploying OneNFT...');
//       const onenft = await OneNFT.deploy();
  
//       await onenft.deployed();
//       console.log("OneNFT deployed to:", onenft.address);
  
//       // Gets first two accounts set in hardhat.config.ts
//       const [user1, user2] = await ethers.getSigners();

//       const tokenURI = "https://gateway.pinata.cloud/ipfs/QmNmgJyrU3qQcG24Gn33FXUkPRQ7JaFdb7pjWqWvdEzfMS"

//       // minting to user1 
//       await onenft.mintNFT(user1.address, tokenURI);
//     });
// });