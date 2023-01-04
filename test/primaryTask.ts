import { expect } from "chai";
import { ethers } from "hardhat";
// import { ethers } from "ethers";
import "dotenv/config"
// import "@nomiclabs/hardhat-ethers"; This plugins adds an ethers object to the Hardhat Runtime Environment. We already have one
// import "@nomicfoundation/hardhat-network-helpers";

describe("Transaction using private keys on Venidium Testnet", function () {
  it("Transaction whose private key I have access to is recorded", async function () {
    
    const [user1, user2] = await ethers.getSigners();

    // Account address of Account 2
    const addressTo = user2.address; 

    // 4. Create send function
    // Sending a transaction from Account 1 to Account 2
    const send = async () => {
      console.log(`Attempting to send transaction from ${user1.address} to ${addressTo}`);

      // 5. Create tx object
      const tx = {
        to: addressTo,
        value: ethers.utils.parseEther('1'),
      };
      // // console.log(tx);

      // 6. Sign and send tx - wait for receipt
      const createReceipt = await user1.sendTransaction(tx);      
      await createReceipt.wait();
      // console.log(createReceipt);
      console.log(`\nTransaction successful with hash: ${createReceipt.hash} \n`);
    };

    console.log("\nAccount Balance of sending account BEFORE calling send() :-");
    console.log("Address: ", user1.address);
    console.log("Balance: ", await (await ethers.provider.getBalance(user1.address)).toString());

    // Call the send function
    console.log("\n");
    await send();
    
    console.log("\nAccount Balances of sending account AFTER calling send() :-");
    console.log("Balance: ", await (await ethers.provider.getBalance(user1.address)).toString());

    // Checking the Test Case
    await expect(await ethers.provider.getBalance(user2.address)).to.equal(
      ethers.utils.parseEther('10001')
    )
  });
});
