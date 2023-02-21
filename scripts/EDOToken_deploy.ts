const hre = require("hardhat");
import "@nomiclabs/hardhat-etherscan";
// import { hre } from "hardhat";

async function main() {

  const EDOToken = await hre.ethers.getContractFactory("EDOToken");
  console.log('Deploying EDOToken...');
  const token = await EDOToken.deploy();

  await token.deployed();
  console.log("EDOToken deployed to:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });