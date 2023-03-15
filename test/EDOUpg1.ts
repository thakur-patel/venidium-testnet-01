// const { ethers, upgrades } = require("hardhat");
import { ethers, upgrades } from "hardhat"
import { expect } from "chai";
import "dotenv/config"
const hre = require("hardhat");

describe("Upgradeable Contracts Testing", function () {
    
    it("Trasparent Proxy Contract", async function () {
        // Deploying
        const EDOUpg1 = await ethers.getContractFactory("EDOUpg1");
        const instance = await upgrades.deployProxy(EDOUpg1, ["EDO Token", "EDO"], { kind: 'transparent'});
        await instance.deployed();
        // const contractOwner = await instance.owner();
        console.log(instance.address);
        // console.log(contractOwner);        
        await instance.set_upgvar1(7);
        console.log("upgvar1: ", await instance.get_upgvar1());        

        // Upgrading
        const EDOUpg1V2 = await ethers.getContractFactory("EDOUpg1V2");
        const upgraded = await upgrades.upgradeProxy(instance.address, EDOUpg1V2, { kind: 'transparent'});  
        console.log(upgraded.address);
        await upgraded.set_upgvar2(10);
        console.log("upgvar1: ", await upgraded.get_upgvar1());        
        console.log("upgvar2: ", await upgraded.get_upgvar2());        
    })
})
