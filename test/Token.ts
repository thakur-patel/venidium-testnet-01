import { expect } from "chai";
import env, { ethers } from "hardhat";
// import * as dotenv from "dotenv";
import "dotenv/config"


describe("Transaction using private keys on Venidium Testnet", function () {
  it("Transaction whose private key I have access to is recorded", async function () {
    // 1. Add the Ethers provider logic here:
    // 1a. Define network configurations
    const [firstAccount, secondAccount, thirdAccount] = await ethers.getSigners();
    const chainId = await firstAccount.getChainId()
    const providerRPC = {
      venidiumfork: {
        name: 'venidiumfork',
        rpc: 'https://rpc-evm-testnet.venidium.io/', // Insert your RPC URL here
        chainId: chainId, // 0x504 in hex,
      },
    };
    // 1b. Create ethers provider
    const provider = new ethers.providers.StaticJsonRpcProvider(
      providerRPC.venidiumfork.rpc, 
      {
        chainId: providerRPC.venidiumfork.chainId,
        name: providerRPC.venidiumfork.name,
      }
    );

    // 2. Create account variables
    const account_from = {
      privateKey: process.env.PRIVATE_KEY_1, // private key of Account 1
    };
    const addressTo = process.env.ADDRESS_TO; // account address of Account 2

    console.log("adressTo: ", addressTo);
    

    // 3. Create wallet
    let wallet = new ethers.Wallet(account_from.privateKey, provider);

    // 4. Create send function\
    // Sending a transaction from Account 1 to Account 2
    const send = async () => {
      console.log(`Attempting to send transaction from ${wallet.address} to ${addressTo}`);

      // 5. Create tx object
      const tx = {
        to: addressTo,
        value: ethers.utils.parseEther('1'),
      };

      console.log(tx);

      // 6. Sign and send tx - wait for receipt
      // ------------The issue is in this section------------
      const createReceipt = await wallet.sendTransaction(tx);      
      await createReceipt.wait();
      console.log(createReceipt);
      console.log(`Transaction successful with hash: ${createReceipt.hash}`);
    };

    console.log("Account Balances BEFORE calling send() :-");
    
    console.log("Address 1: ", firstAccount.getAddress());
    // const balance = await firstAccount.getBalance();
    console.log("Balance 1: ", await firstAccount.getBalance());
    console.log("Address 2: ", secondAccount.getAddress());
    console.log("Balance 2: ", await secondAccount.getBalance());
    console.log("Address 3: ", thirdAccount.getAddress());
    console.log("Balance 3: ", await thirdAccount.getBalance());

    // 7. Call the send function
    send();
    
    console.log("Account Balances AFTER calling send() :-");
    console.log("Balance 1: ", await firstAccount.getBalance());
    console.log("Address 2: ", secondAccount.getAddress());
    console.log("Balance 2: ", await secondAccount.getBalance());
    console.log("Address 3: ", thirdAccount.getAddress());
    console.log("Balance 3: ", await thirdAccount.getBalance());

    // Checking the Test Case
    await expect(await secondAccount.getBalance()).to.equal(
      ethers.utils.parseEther('1001')
    )
  });
});