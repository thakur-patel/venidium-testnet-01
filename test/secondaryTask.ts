import { expect } from "chai";
import { ethers } from "ethers";
import "dotenv/config"
// import "@nomiclabs/hardhat-ethers"; This plugins adds an ethers object to the Hardhat Runtime Environment. We already have one
// import "@nomicfoundation/hardhat-network-helpers";

describe("Transaction WITHOUT using private keys on Venidium Testnet", function () {
  it("Transaction whose private key I DON'T have access to is recorded", async function () {
    // Add the Ethers provider logic here:
    // Define network configurations
    const providerRPC = {
      venidiumfork: {
        name: 'venidiumfork',
        rpc: 'http://localhost:8545/', 
        chainId: 31337, 
      },
    };
    // Create ethers provider
    const provider = new ethers.providers.StaticJsonRpcProvider(
      providerRPC.venidiumfork.rpc, 
      {
        chainId: providerRPC.venidiumfork.chainId,
        name: providerRPC.venidiumfork.name,
      }
    );

    // Creating account variables
    const account_from = {
      privateKey1: process.env.PRIVATE_KEY_1, // private key of Account 1
      privateKey2: process.env.PRIVATE_KEY_2, // private key of Account 2
      privateKey3: process.env.PRIVATE_KEY_3, // private key of Account 3
    };
    
    const wallet3 = new ethers.Wallet(account_from.privateKey3, provider);
    const addressTo = wallet3.address; 
    
    const helpers = require("@nomicfoundation/hardhat-network-helpers");

    // Address that will send the ether
    const impersonatedAccount = "0x90F79bf6EB2c4f870365E785982E1f101E93b906"

    // impersonating an account
    await helpers.impersonateAccount(impersonatedAccount);
    const impersonatedSigner = await provider.getSigner(impersonatedAccount);
    console.log("\nimpersonatedSigner: \n", impersonatedSigner);

    console.log("\nBalance of Impersonated Account BEFORE transaction = ", await (await provider.getBalance(impersonatedAccount)).toString());
    console.log("\nBalance of account to be credited BEFORE transaction = ", await (await provider.getBalance(addressTo)).toString());

    // Sending the transaction
    const tx = {
      to: addressTo,
      value: ethers.utils.parseEther('1'),
    };
    await impersonatedSigner.sendTransaction(tx);

    console.log("\nBalance of Impersonated Account AFTER transaction = ", await (await provider.getBalance(impersonatedAccount)).toString());
    console.log("\nBalance of account to be credited AFTER transaction = ", await (await provider.getBalance(addressTo)).toString());
    

    // Checking the Test Case
    await expect(await provider.getBalance(wallet3.address)).to.equal(
      ethers.utils.parseEther('10001')
    )
    });
});