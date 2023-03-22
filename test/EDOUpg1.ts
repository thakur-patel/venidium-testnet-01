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
        const instance = await upgrades.deployProxy(EDOUpg1, ["EDO Token", "EDO"], { initializer: 'initialize', kind: 'transparent'});
        await instance.deployed();
        const contractOwnerV1 = await instance.owner();
        console.log("Values initialized in V1 :-");
        console.log("Proxy Contract Address: ", instance.address);
        console.log("Address of account that deployed Proxy contract: ", contractOwnerV1);        
        await instance.set_upgvar1(7);
        console.log("upgvar1: ", await instance.get_upgvar1());

        // Upgrading to V2
        const EDOUpg1V2 = await ethers.getContractFactory("EDOUpg1V2");
        const upgradedV2 = await upgrades.upgradeProxy(instance.address, EDOUpg1V2, { kind: 'transparent'});  
        // console.log(upgradedV2.address);
        await upgradedV2.set_upgvar2(10);
        console.log("Values updated in V2 :-");
        console.log("upgvar1: ", await upgradedV2.get_upgvar1());        
        console.log("upgvar2: ", await upgradedV2.get_upgvar2());        
    
        // Upgrading to V3
        const EDOUpg1V3 = await ethers.getContractFactory("EDOUpg1V3");
        // const upgradedV3 = await upgrades.upgradeProxy(instance.address, EDOUpg1V3, { call: { fn: "setOwner", args:[]}, kind: 'transparent'});  
        const upgradedV3 = await upgrades.upgradeProxy(instance.address, EDOUpg1V3, { kind: 'transparent'});  
        // console.log(upgradedV3.address);
        const contractOwnerV3 = await instance.owner();
        console.log(contractOwnerV3);
        console.log("Values updated in V3 :-");
        await upgradedV3.connect(user1).set_upgvar1(99);
        await upgradedV2.connect(user2).set_upgvar2(10);
        await expect(upgradedV3.connect(user1).set_upgvar3(101)).to.be.revertedWith('Ownable: caller is not the owner'); // set_upgvar2 can only be called by owner
        await expect(upgradedV3.connect(user2).set_upgvar3(101)).to.be.revertedWith('Ownable: caller is not the owner'); // set_upgvar3 can only be called by owner
        await upgradedV3.connect(owner).set_upgvar3(101);
        console.log("upgvar1: ", await upgradedV3.get_upgvar1());        
        console.log("upgvar2: ", await upgradedV3.get_upgvar2());
        console.log("upgvar3: ", await upgradedV3.get_upgvar3());  
    })

    // it("UUPS Testing", async function () {
    //     // Storing the account signers
    //     const [owner, user1, user2] = await ethers.getSigners();
         
    //     const EDOUpg2 = await ethers.getContractFactory("EDOUpg2");
    //     const instance = await upgrades.deployProxy(EDOUpg2, ["EDO Token", "EDO"], { initializer: 'initialize', kind: 'uups'});
    //     await instance.deployed();
    //     const contractOwnerV1 = await instance.owner();
    //     console.log("Values initialized in V1 :-");
    //     console.log("Proxy Contract Address in V1: ", instance.address);
    //     console.log("Address of account that deployed Proxy contract: ", contractOwnerV1);        
    //     await instance.set_upgvar1(7);
    //     console.log("upgvar1: ", await instance.get_upgvar1());

    //     // Upgrading to V2
    //     const EDOUpg2V2 = await ethers.getContractFactory("EDOUpg2V2");
    //     // const upgradedV3 = await upgrades.upgradeProxy(instance.address, EDOUpg2V2, { call: { fn: "initialize", args:["EDO Token", "EDO"]}, kind: 'uups'});  
    //     // above statement throws error: The contract is already initalized.
    //     const upgradedV2 = await upgrades.upgradeProxy(instance.address, EDOUpg2V2, { kind: 'uups'});  
    //     console.log("Proxy Contract Address in V2: ", upgradedV2.address);
    //     // const contractOwnerV3 = await instance.owner();
    //     // console.log(contractOwnerV3);
    //     console.log("Values updated in V3 :-");
    //     await upgradedV2.connect(user2).set_upgvar1(99);
    //     await upgradedV2.connect(user1).set_upgvar2(10);
    //     await expect(upgradedV2.connect(user1).set_upgvar3(101)).to.be.revertedWith('Ownable: caller is not the owner'); // set_upgvar3 can only be called by owner
    //     await expect(upgradedV2.connect(user2).set_upgvar3(101)).to.be.revertedWith('Ownable: caller is not the owner'); // set_upgvar3 can only be called by owner
    //     await upgradedV2.connect(owner).set_upgvar3(101);
    //     console.log("upgvar1: ", await upgradedV2.get_upgvar1());        
    //     console.log("upgvar2: ", await upgradedV2.get_upgvar2());  
    //     console.log("upgvar3: ", await upgradedV2.get_upgvar3());
    // })
})
