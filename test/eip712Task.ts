// import { expect } from "chai";
// import { ethers } from "hardhat";
// import "dotenv/config"
// const hre = require("hardhat");

// import "@openzeppelin/contracts"

// const fromWei = ethers.utils.formatEther;
// const toWei = ethers.utils.parseEther;

// describe("EIP712 Testing", function () {
//   it("Signing Messages", async function () {
    
//     const EDOToken = await hre.ethers.getContractFactory("EDOToken");
//     console.log('Deploying EDOToken...');
//     const token = await EDOToken.deploy();

//     await token.deployed();
//     console.log("EDOToken deployed to:", token.address);

//     // Gets first two accounts set in hardhat.config.ts
//     const [user1, user2] = await ethers.getSigners();
//     console.log(fromWei(await token.balanceOf(user1.address)));
//     console.log(fromWei(await token.balanceOf(user2.address)));

//     // minting to user1 
//     await token.mint(user1.address, 100);
//     console.log(fromWei(await token.balanceOf(user1.address)));
    
    
//     // const DOMAIN_NAME = "ex-ex-ex";
//     // const DOMAIN_VERSION = "0.0.1";


//     // function getDomain(chainId, contractAddress) {
//     //   return {
//     //     name: DOMAIN_NAME,
//     //     version: DOMAIN_VERSION,
//     //     chainId: chainId,
//     //     verifyingContract: contractAddress
//     //   }
//     // }

//     // const types = {
//     //   SignedMint: [{
//     //       name: "x",
//     //       type: "address"
//     //     },
//     //     {
//     //       name: "y",
//     //       type: "uint256"
//     //     },
//     //     {
//     //       name: "z",
//     //       type: "uint256"
//     //     },
//     //   ]
//     // };

//     // async function signMessage(_x, _y, _z) {
//     //   message = {
//     //     x: _x,
//     //     y: _y,
//     //     z: _z
//     //   }

//     //   const chainId = await web3.eth.getChainId();
//     //   xyzcontract = await ethers.getContractFactory("XYZContract");
//     //   domain = getDomain(chainId, xyzcontract.address);
//     //   signature = await signer._signTypedData(domain, types, message);
//     //   return signature
//     // }

//     // function pack(x, y, z, signature) {
//     //   return web3.eth.abi.encodeParameters(
//     //     ['address', 'uint256', 'uint256', 'bytes memory'],
//     //     [x, y, z, signature]
//     //   );
//     // }

//     // async function packAndSign(x, y, z) {
//     //   let signature = await signMessage(x, y, z);
//     //   let data = pack(x, y, z, signature);
//     //   return {
//     //     data,
//     //     signature
//     //   }
//     // }

//     // // Gets first two accounts set in hardhat.config.ts
//     // const [user1, user2] = await ethers.getSigners();

//     // // Account address of Account 2
//     // const addressTo = user2.address; 

//     // // 4. Create send function
//     // // Sending a transaction from Account 1 to Account 2
//     // const send = async () => {
//     //   console.log(`Attempting to send transaction from ${user1.address} to ${addressTo}`);

//     //   // 5. Create tx object
//     //   const tx = {
//     //     to: addressTo,
//     //     value: ethers.utils.parseEther('1'),
//     //   };
//     //   // // console.log(tx);

//     //   // 6. Sign and send tx - wait for receipt
//     //   const createReceipt = await user1.sendTransaction(tx);      
//     //   await createReceipt.wait();
//     //   // console.log(createReceipt);
//     //   console.log(`\nTransaction successful with hash: ${createReceipt.hash} \n`);
//     // };

//     // console.log("\nAccount Balance of sending account BEFORE calling send() :-");
//     // console.log("Address: ", user1.address);
//     // console.log("Balance: ", await (await ethers.provider.getBalance(user1.address)).toString());

//     // // Call the send function
//     // console.log("\n");
//     // await send();
    
//     // console.log("\nAccount Balances of sending account AFTER calling send() :-");
//     // console.log("Balance: ", await (await ethers.provider.getBalance(user1.address)).toString());

//     // // Checking the Test Case
//     // await expect(await ethers.provider.getBalance(user2.address)).to.equal(
//     //   ethers.utils.parseEther('10001')
//     // )
//   });
// });
