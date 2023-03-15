// const { ethers, upgrades } = require("hardhat");
import { ethers, upgrades } from "hardhat"
import { expect } from "chai";
import "dotenv/config"
const hre = require("hardhat");

describe("Upgradeable Contracts Testing", function () {
    // it("Transparent Proxy Contract", async function () {
    //     const EDOUpg1 = await ethers.getContractFactory("EDOUpg1");
    //     const instance = await upgrades.deployProxy(EDOUpg1, [42]);
    //     // assert.strictEqual(await instance.retrieve(), 42);
    //     console.log(await instance.retrieve());

    //     await upgrades.upgradeProxy(instance.address, EDOUpg1V2);
    //     assert.strictEqual(await instance.retrieve(), 42);
    // })
    
    it("Trasparent Proxy Contract", async function () {
        // Deploying
        const EDOUpg1 = await ethers.getContractFactory("EDOUpg1");
        const instance = await upgrades.deployProxy(EDOUpg1, [42]);
        await instance.deployed();
        console.log(await instance.retrieve());

        // Upgrading
        const EDOUpg1V2 = await ethers.getContractFactory("EDOUpg1V2");
        const upgraded = await upgrades.upgradeProxy(instance.address, EDOUpg1V2);  
        console.log(await instance.retrieve());  
        console.log(upgraded);
    })
})
