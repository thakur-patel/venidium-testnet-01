import { expect } from "chai";
import { network } from "hardhat";
import { Signer, ethers } from "ethers";
import "dotenv/config"
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-network-helpers";

describe("Transaction using private keys on Venidium Testnet", function () {
  it("Transaction whose private key I have access to is recorded", async function () {
    // 1. Add the Ethers provider logic here:
    // 1a. Define network configurations
    const providerRPC = {
      venidiumfork: {
        name: 'venidiumfork',
        rpc: 'http://localhost:8545/', 
        chainId: 31337, 
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
      privateKey1: process.env.PRIVATE_KEY_1, // private key of Account 1
      privateKey2: process.env.PRIVATE_KEY_2, // private key of Account 2
      privateKey3: process.env.PRIVATE_KEY_3, // private key of Account 3
    };

    // 3. Create wallet(s)
    const wallet1 = new ethers.Wallet(account_from.privateKey1, provider);
    const wallet2 = new ethers.Wallet(account_from.privateKey2, provider);

    // Account address of Account 2
    const addressTo = wallet2.address; 

    // // // Checking how the Wallet is structured
    // // console.log("Wallet: \n", wallet1);
    // // console.log(wallet1._signingKey());

    // 4. Create send function
    // Sending a transaction from Account 1 to Account 2
    const send = async () => {
      console.log(`Attempting to send transaction from ${wallet1.address} to ${addressTo}`);

      // 5. Create tx object
      const tx = {
        to: addressTo,
        value: ethers.utils.parseEther('1'),
      };
      // // console.log(tx);

      // 6. Sign and send tx - wait for receipt
      // ------------The issue is in this section------------
      const createReceipt = await wallet1.sendTransaction(tx);      
      await createReceipt.wait();
      // console.log(createReceipt);
      console.log(`\nTransaction successful with hash: ${createReceipt.hash} \n`);
    };

    console.log("\nAccount Balance of sending account BEFORE calling send() :-");
    console.log("Address: ", wallet1.address);
    console.log("Balance: ", await (await provider.getBalance(wallet1.address)).toString());

    // 7. Call the send function
    console.log("\n");
    await send();
    
    console.log("\nAccount Balances of sending account AFTER calling send() :-");
    console.log("Balance: ", await (await provider.getBalance(wallet1.address)).toString());

    // Checking the Test Case
    await expect(await provider.getBalance(wallet2.address)).to.equal(
      ethers.utils.parseEther('10001')
    )
  });

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
    
    const wallet2 = new ethers.Wallet(account_from.privateKey2, provider);
    const addressTo = wallet2.address; 
    
    // // Way #3 : https://mixbytes.io/blog/how-fork-mainnet-testing 
    // // Function which allows to convert any address to the signer which can sign transactions in a test
    // const impersonateAddress = async (address) => {
    //   const hre = require('hardhat');
    //   await hre.network.provider.request({
    //     method: 'hardhat_impersonateAccount',
    //     params: [address],
    //   });
    //   const signer = await ethers.provider.getSigner(address);
    //   signer.address = signer._address;
    //   return signer;
    // };

    const helpers = require("@nomicfoundation/hardhat-network-helpers");

    // Address that will send the ether
    // const impersonatedAccount = "0x4318eaF55dEfA363344889C3f692A4d067A8eE28" // Impersonating my MetaMask account
    const impersonatedAccount = "0x90F79bf6EB2c4f870365E785982E1f101E93b906"

    // Way #1 : Hardhat Doc
    // const impersonatedSigner = await ethers.getImpersonatedSigner(impersonatedAccount);
    // console.log(impersonatedSigner);

    // Way #2 : Hardhat Doc
    await helpers.impersonateAccount(impersonatedAccount);
    const impersonatedSigner = await ethers.getSigner(impersonatedAccount);
    console.log("\nimpersonatedSigner: \n", impersonatedSigner);

    // await network.provider.request({
    //   method: "hardhat_impersonateAccount",
    //   params: [impersonatedAccount],
    // });
    // const impersonatedAccountSigner: Signer = await ethers.provider.getSigner(impersonatedAccount);
    
    // console.log("\nBalance of Impersonated Account BEFORE transaction = ", await provider.getBalance(impersonatedAccount));
    // console.log("\nBalance of account to be credited BEFORE transaction = ", await provider.getBalance(addressTo));

    // Sending the transaction
    const tx = {
      to: addressTo,
      value: ethers.utils.parseEther('1'),
    };
    await impersonatedSigner.sendTransaction(tx);

    console.log("\nBalance of Impersonated Account AFTER transaction = ", await provider.getBalance(impersonatedAccount));
    console.log("\nBalance of account to be credited AFTER transaction = ", await provider.getBalance(addressTo));
    

    // // Checking the Test Case
    // await expect(await provider.getBalance(wallet2.address)).to.equal(
    //   ethers.utils.parseEther('10002')
    // )
  });
});