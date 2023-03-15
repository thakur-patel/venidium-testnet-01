// const { ethers, upgrades } = require("hardhat");
import { ethers, upgrades } from "hardhat"
import { expect } from "chai";
import "dotenv/config"
const hre = require("hardhat");

describe("Upgradeable Contracts Testing", function () {
    
    it("Trasparent Proxy Contract", async function () {
        // Storing the account signers
        const [owner, user1, user2] = await ethers.getSigners();

        // Deploying V1
        const EDOUpg1 = await ethers.getContractFactory("EDOUpg1");
        const instance = await upgrades.deployProxy(EDOUpg1, ["EDO Token", "EDO"], { kind: 'transparent'});
        await instance.deployed();
        const contractOwnerV1 = await instance.owner();
        console.log(instance.address);
        console.log(contractOwnerV1);        
        await instance.set_upgvar1(7);
        console.log("upgvar1: ", await instance.get_upgvar1());

        // Upgrading to V2
        const EDOUpg1V2 = await ethers.getContractFactory("EDOUpg1V2");
        const upgradedV2 = await upgrades.upgradeProxy(instance.address, EDOUpg1V2, { kind: 'transparent'});  
        console.log(upgradedV2.address);
        await upgradedV2.set_upgvar2(10);
        console.log("upgvar1: ", await upgradedV2.get_upgvar1());        
        console.log("upgvar2: ", await upgradedV2.get_upgvar2());        
    
        // Upgrading to V3
        const EDOUpg1V3 = await ethers.getContractFactory("EDOUpg1V3");
        const upgradedV3 = await upgrades.upgradeProxy(instance.address, EDOUpg1V3, { kind: 'transparent'});  
        console.log(upgradedV3.address);
        const contractOwnerV3 = await instance.owner();
        console.log(contractOwnerV3);
        console.log("upgvar1: ", await upgradedV2.get_upgvar1());        
        console.log("upgvar2: ", await upgradedV2.get_upgvar2());  
        await expect(upgradedV3.connect(user1).set_upgvar1(99)).to.be.revertedWith('Ownable: caller is not the owner');
        await expect(upgradedV3.connect(user2).set_upgvar2(101)).to.be.revertedWith('Ownable: caller is not the owner');
    })
})
