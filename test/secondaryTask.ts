import { expect } from "chai";
// import { ethers } from "ethers";
import { ethers } from "hardhat";
import "dotenv/config"
// import "@nomiclabs/hardhat-ethers"; This plugins adds an ethers object to the Hardhat Runtime Environment. We already have one
// import "@nomicfoundation/hardhat-network-helpers";

describe("Transaction WITHOUT using private keys on Venidium Testnet", function () {
  it("Transaction whose private key I DON'T have access to is recorded", async function () {

    this.signers = await ethers.getSigners()
    this.user1 = this.signers[0];
    this.user2 = this.signers[1];
    this.user3 = this.signers[2];
    this.user4 = this.signers[3];
    const addressTo = this.user3.address;

    const helpers = require("@nomicfoundation/hardhat-network-helpers");

    // Address that will send the ether
    const impersonatedAccount = this.user4.address

    // impersonating an account
    await helpers.impersonateAccount(impersonatedAccount);
    const impersonatedSigner = await ethers.provider.getSigner(impersonatedAccount);
    // console.log("\nimpersonatedSigner: \n", impersonatedSigner);

    console.log("\nBalance of Impersonated Account BEFORE transaction = ", await (await ethers.provider.getBalance(impersonatedAccount)).toString());
    console.log("\nBalance of account to be credited BEFORE transaction = ", await (await ethers.provider.getBalance(addressTo)).toString());

    // Sending the transaction
    const tx = {
      to: addressTo,
      value: ethers.utils.parseEther('1'),
    };
    await impersonatedSigner.sendTransaction(tx);

    console.log("\nBalance of Impersonated Account AFTER transaction = ", await (await ethers.provider.getBalance(impersonatedAccount)).toString());
    console.log("\nBalance of account to be credited AFTER transaction = ", await (await ethers.provider.getBalance(addressTo)).toString());
    

    // Checking the Test Case
    await expect(await ethers.provider.getBalance(this.user3.address)).to.equal(
      ethers.utils.parseEther('10001')
    )
    });
});