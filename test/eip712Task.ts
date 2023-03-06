import { expect } from "chai";
import { ethers } from "hardhat";
import "dotenv/config"
// import { AbiCoder } from "ethers/lib/utils";
const hre = require("hardhat");
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";


const fromWei = ethers.utils.formatEther;
const toWei = ethers.utils.parseEther;

describe("EIP712 Testing", function () {
  it("Signing Messages", async function () {
    
    const [owner, user1, user2, user3] = await ethers.getSigners();

    const EDOToken = await hre.ethers.getContractFactory("EDOToken");
    console.log('Deploying EDOToken...');
    const token = await EDOToken.deploy();

    await token.deployed();
    console.log("EDOToken deployed to:", token.address);
    
    const contractOwner = await token.owner();
    console.log("Contract Owner: ", contractOwner);
    // const owner = jsonRpcProvider.getSigner( [ addressOrIndex ] )

    // Gets first two accounts set in hardhat.config.ts
    console.log("Balance of Account 1: ", fromWei(await token.balanceOf(user1.address)));
    console.log("Balance of Account 2: ", fromWei(await token.balanceOf(user2.address)));
    console.log("Balance of Account 3: ", fromWei(await token.balanceOf(user3.address)));
    
    const DOMAIN_NAME = "Sign and Mint";
    const DOMAIN_VERSION = "0.0.1";
    const chainId = await ethers.provider.getNetwork(); // this returns an object
    // console.log(chainId.chainId);    
    const contractAddress = token.address;
    let NONCE = 0;

    const domain = {
      name: DOMAIN_NAME,
      version: DOMAIN_VERSION,
      chainId: chainId.chainId,
      verifyingContract: contractAddress        
    }
    
    const types = {
      SignedMessage: [
        {
          name: "nonce",
          type: "uint256"
        },
        {
          name: "amount",
          type: "uint256"
        },
      ]
    }

    async function signMessage(_nonce, _amount) {
      let message = {
        nonce: _nonce,
        amount: _amount
      }

      return await owner._signTypedData(domain, types, message);
    }

    const abicoder = new ethers.utils.AbiCoder();

    function pack(nonce, amount, signature) {
      return abicoder.encode(
        ['uint256', 'uint256', 'bytes memory'],
        [nonce, amount, signature]
      );
    }

    async function packAndSign(nonce, amount) {
      let signature = await signMessage(nonce, amount);
      let data = pack(nonce, amount, signature);
      return {
        data,
        signature
      }
    }

    async function callMe(amount) {
      return packAndSign(NONCE++, amount);
    }

    let struct1 = await callMe(100);
    // let struct1 = await packAndSign(NONCE++, 100);
    await token.connect(user1).verify(struct1.data, struct1.signature)

    console.log("Balance of Account 1: ", fromWei(await token.balanceOf(user1.address)));

    let struct2 = await callMe(150);
    // let struct2 = await packAndSign(NONCE++, 150);
    await token.connect(user2).verify(struct2.data, struct2.signature)

    console.log("Balance of Account 2: ", fromWei(await token.balanceOf(user2.address)));

    // Test to prevent re-use of signature
    await expect(token.connect(user2).verify(struct2.data, struct2.signature))
    .to.be.revertedWith('This signature has been used.');

    let struct3 = await callMe(500);
    // let struct3 = await packAndSign(NONCE++, 500);
    await token.connect(user3).verify(struct3.data, struct3.signature)

    console.log("Balance of Account 3: ", fromWei(await token.balanceOf(user3.address)));

    // Test to prevent re-use of signature
    await expect(token.connect(user3).verify(struct3.data, struct3.signature))
    .to.be.revertedWith('This signature has been used.');
  });
});
