const hre = require("hardhat");
import "@nomiclabs/hardhat-etherscan";
import { ethers } from "hardhat";

async function main() {
    const OneNFT = await hre.ethers.getContractFactory("OneNFT")
  
    // Start deployment, returning a promise that resolves to a contract object
    const onenft = await OneNFT.deploy()
    console.log("OneNFT Contract deployed to address:", onenft.address)

    // // Deploying an NFT using the tokenURI
    // // Gets first two accounts set in hardhat.config.ts
    // const [user1, user2] = await ethers.getSigners();

    // const tokenURI = "https://gateway.pinata.cloud/ipfs/QmNmgJyrU3qQcG24Gn33FXUkPRQ7JaFdb7pjWqWvdEzfMS"

    // // minting to user1 
    // await onenft.mintNFT(user1.address, tokenURI);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error)
    process.exit(1)
})