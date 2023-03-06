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

    // // minting to user1 
    // await token.mint(user1.address, 100);
    // console.log(fromWei(await token.balanceOf(user1.address)));
    
    // const Verifier = await hre.ethers.getContractFactory("Verifier");
    // console.log('Deploying Verifier...');
    // const verifier = await Verifier.deploy();

    // await verifier.deployed();
    // console.log("Verifier deployed to:", verifier.address);
    
    const DOMAIN_NAME = "Sign and Mint";
    const DOMAIN_VERSION = "0.0.1";
    const chainId = await ethers.provider.getNetwork(); // this returns an object
    // console.log(chainId.chainId);    
    const contractAddress = token.address;

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
      // if (_nonce == 0) return await user1._signTypedData(domain, types, message);
      // if (_nonce == 1) return await user2._signTypedData(domain, types, message);
      // if (_nonce == 2) return await user3._signTypedData(domain, types, message);
    }

    // let message = {
    //   nonce: 0,
    //   amount: 100
    // }

    // const signature = await user1._signTypedData(domain, types, message);
    // console.log(signature);

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

    let struct1 = await packAndSign(0, 100);
    // console.log(struct1);
    let verifiedAddress1 = await token.connect(user1).verify(struct1.data, struct1.signature)
    // console.log(user1);
    // console.log(verifiedAddress1);
    // console.log(user1.address);

    // if (verifiedAddress1 == user1.address) {
    //   // minting to user1 
    //   await token.mint(user1.address, 100);
    //   console.log("Balance of Account 1: ", fromWei(await token.balanceOf(user1.address)));
    // }
    console.log("Balance of Account 1: ", fromWei(await token.balanceOf(user1.address)));


    let struct2 = await packAndSign(1, 150);
    let verifiedAddress2 = await token.connect(user2).verify(struct2.data, struct2.signature)
    // console.log(verifiedAddress2);
    // console.log(user2.address);

    // if (verifiedAddress2 == user2.address) {
    //   // minting to user2
    //   await token.mint(user2.address, 150);
    //   console.log("Balance of Account 2: ", fromWei(await token.balanceOf(user2.address)));
    // }
    console.log("Balance of Account 2: ", fromWei(await token.balanceOf(user2.address)));


    let struct3 = await packAndSign(2, 500);
    let verifiedAddress3 = await token.connect(user3).verify(struct3.data, struct3.signature)
    // console.log(verifiedAddress3);
    // console.log(user3.address);

    // if (verifiedAddress3 == user3.address) {
    //   // minting to user3
    //   await token.mint(user3.address, 500);
    //   console.log("Balance of Account 3: ", fromWei(await token.balanceOf(user3.address)));
    // }
    console.log("Balance of Account 3: ", fromWei(await token.balanceOf(user3.address)));

  });
});
