import { expect } from "chai";
import { ethers } from "hardhat";
// import { ethers } from "ethers";
import "dotenv/config"
// import "@nomiclabs/hardhat-ethers"; This plugins adds an ethers object to the Hardhat Runtime Environment. We already have one
// import "@nomicfoundation/hardhat-network-helpers";

describe("Transaction using private keys on Venidium Testnet", function () {
  it("Transaction whose private key I have access to is recorded", async function () {
    // // 1. Add the Ethers provider logic here:
    // // 1a. Define network configurations
    // const providerRPC = {
    //   venidiumfork: {
    //     name: 'venidiumfork',
    //     rpc: 'http://localhost:8545/', 
    //     chainId: 31337, 
    //   },
    // };
    // // 1b. Create ethers provider
    // const provider = new ethers.providers.StaticJsonRpcProvider(
    //   providerRPC.venidiumfork.rpc, 
    //   {
    //     chainId: providerRPC.venidiumfork.chainId,
    //     name: providerRPC.venidiumfork.name,
    //   }
    // );

    // // 2. Create account variables
    // const account_from = {
    //   privateKey1: process.env.PRIVATE_KEY_1, // private key of Account 1
    //   privateKey2: process.env.PRIVATE_KEY_2, // private key of Account 2
    //   privateKey3: process.env.PRIVATE_KEY_3, // private key of Account 3
    // };

    // // 3. Create wallet(s)
    // const this.user1 = new ethers.Wallet(account_from.privateKey1, provider);
    // const wallet2 = new ethers.Wallet(account_from.privateKey2, provider);

    const [user1, user2] = await ethers.getSigners();

    // this.signers = await ethers.getSigners()
    // this.user1 = this.signers[0];
    // this.user2 = this.signers[1];
    // this.user3 = this.signers[2];
    // // console.log(this.user1);
    // // console.log(this.user2);
        
    // const user1 = await provider.getSigner(this.user1.address);
    // const user2 = await provider.getSigner(this.user2.address);
    // const user3 = await provider.getSigner(this.user3.address);
    // // console.log(user1, user2, user3);

    // Account address of Account 2
    const addressTo = user2.address; 

    // // // Checking how the Wallet is structured
    // // console.log("Wallet: \n", this.user1);
    // // console.log(this.user1._signingKey());

    // 4. Create send function
    // Sending a transaction from Account 1 to Account 2
    const send = async () => {
      console.log(`Attempting to send transaction from ${user1.address} to ${addressTo}`);

      // 5. Create tx object
      const tx = {
        to: addressTo,
        value: ethers.utils.parseEther('100'),
      };
      // // console.log(tx);

      // 6. Sign and send tx - wait for receipt
      // ------------The issue is in this section------------
      const createReceipt = await user1.sendTransaction(tx);      
      await createReceipt.wait();
      console.log(createReceipt);
      console.log(`\nTransaction successful with hash: ${createReceipt.hash} \n`);
    };

    console.log("\nAccount Balance of sending account BEFORE calling send() :-");
    console.log("Address: ", user1.address);
    console.log("Balance: ", await (await ethers.provider.getBalance(user1.address)).toString());

    // 7. Call the send function
    console.log("\n");
    await send();
    
    console.log("\nAccount Balances of sending account AFTER calling send() :-");
    console.log("Balance: ", await (await ethers.provider.getBalance(user1.address)).toString());

    // // Checking the Test Case
    // await expect(await provider.getBalance(wallet2.address)).to.equal(
    //   ethers.utils.parseEther('10001')
    // )
  });
});
