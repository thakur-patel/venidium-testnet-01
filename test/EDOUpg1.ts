// const { ethers, upgrades } = require("hardhat");
import { ethers, upgrades } from "hardhat"
import { expect } from "chai";
import "dotenv/config"
// import { EDOUpg1V3__factory } from "../typechain-types";
const hre = require("hardhat");

describe("Upgradeable Contracts Testing", function () {
    
    it("Trasparent Proxy Contract", async function () {
        // Storing the account signers
        const [user0, user1, user2] = await ethers.getSigners();

        // Deploying V1
        const EDOUpg1 = await ethers.getContractFactory("EDOUpg1");
        const instance = await upgrades.deployProxy(EDOUpg1, ["EDO Token", "EDO"], { initializer: 'initialize', kind: 'transparent'});
        await instance.deployed();
        const contractOwnerV1 = await instance.connect(user1).owner();
        console.log("Values initialized in V1 :-");
        console.log("Proxy Contract Address: ", instance.address);
        console.log("Owner of deployed Proxy contract: ", contractOwnerV1);   
        console.log("Token Ticker: ", await instance.symbol());
             
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
        const EDOUpg1V3 = await ethers.getContractFactory("EDOUpg1V3", user0);
        // console.log(EDOUpg1V3);

        // --- TRYING TO ENCODE THE FUNCTION DATA using encodeFunctionData() ---
        // const _EDOUpg1V3 = await EDOUpg1V3.deploy();
        // console.log(_EDOUpg1V3.interface.encodeFunctionData);
        // const encodedFnData = _EDOUpg1V3.interface.encodeFunctionData("set_upgvar4", [55]);
        // console.log("encodedFnData: ", encodedFnData);
        // const upgradedV3 = await upgrades.upgradeProxy(
        //     instance.address,
        //     EDOUpg1V3,
        //     {
        //         kind: 'transparent',
        //         call: encodedFnData
        //     }
        // )
        // console.log(upgradedV3);
        
        // --- RANDOM CODE ---
        // await EDOUpg1V3.deploy();
        // await EDOUpg1V3.deployTransaction.wait()
        // console.log(`UpgradeProxyImplementation contract address: ${EDOUpg1V3.address}`)

        // --- REDEPLOYING USING deployProxy() ---
        // const upgradedV3 = await upgrades.deployProxy(EDOUpg1V3, ["EDO Token", "EDO"], { initializer: 'initialize', kind: 'transparent' });

        // --- TRYING TO CALL FUNCTIONS IN OwnableUpgradeable.sol to change the owner
        // const upgradedV3 = await upgrades.upgradeProxy(instance.address, EDOUpg1V3, { call: { fn: "transferOwnership", args:[user0.address] }, kind: 'transparent'} );  
        // const upgradedV3 = await upgrades.upgradeProxy(instance.address, EDOUpg1V3, { call: "transferOwnership", kind: 'transparent'} );  
        // const upgradedV3 = await upgrades.upgradeProxy(instance.address, EDOUpg1V3, { kind: 'transparent'});  
        // console.log(upgradedV3.address);

        // CALLING set_upgvar1() IN upgradeProxy() OPTS
        const upgradedV3 = await upgrades.upgradeProxy(
            instance.address, 
            EDOUpg1V3, 
            { 
                call: {
                    fn: "set_upgvar1",
                    args: [55]
                }, 
                kind: 'transparent'
            } 
        );  
        
        // // CALLING initialize() IN upgradeProxy() OPTS
        // const upgradedV3 = await upgrades.upgradeProxy(
        //     instance.address, 
        //     EDOUpg1V3, 
        //     { 
        //         call: {
        //             fn: "initialize",
        //             args: ['EDO Token', 'EDO']
        //         }, 
        //         kind: 'transparent'
        //     } 
        // );  

        // GITHUB REPO "DEFENDER_POC" STYLE IMPLEMENTATION
        // const EDOUpg1V3 = await (
        //     await ethers.getContractFactory("EDOUpg1V3", user0)
        // ).deploy(
        //     upgradedV2.address,
        //     EDOUpg1V3,
        //     EDOUpg1V3.interface.encodeFunctionData("initialize", [
                
        //     ])
        // )
        // await EDOUpg1V3.deployTransaction.wait()
        // console.log('EDOUpg1V3 Contract Address: ${EDOUpg1V3.address}');
        

        // GITHUB REPO "HYDN-SEAL" EXAMPLE
        // const upgradedV3 = await hre.upgrades.upgradeProxy(instance.address, HYDNSeal1, {
        //     kind: 'uups',
        //     call: {
        //       fn: set_upgvar4.toString(),
        //       args: [55]
        //     },
        //     timeout: 0,
        //     pollingInterval: 10000,
        // })
        // await upgradedV3.deployTransaction.wait()
        // console.info(`Upgrade proxy done ${upgradedV3.address}`)
        // const implAddress = await hre.upgrades.erc1967.getImplementationAddress(HYDNSealProxyDeployment.address)
        // console.info(`HYDNSeal new impl ${implAddress}`)
        

        const contractOwnerV3 = await instance.owner();
        console.log("Owner of deployed Proxy contract: ", contractOwnerV3);       

        console.log("Values initially in V3 :-");
        console.log("upgvar1: ", await upgradedV3.get_upgvar1());        
        console.log("upgvar2: ", await upgradedV3.get_upgvar2());
        console.log("upgvar3: ", await upgradedV3.get_upgvar3());  
        console.log("upgvar4: ", await upgradedV3.get_upgvar4());  

        console.log("Values updated in V3 :-");
        
        await upgradedV3.connect(user0).set_upgvar1(99);
        console.log("upgvar1: ", await upgradedV3.get_upgvar1());        

        await upgradedV3.connect(user1).set_upgvar2(10);
        console.log("upgvar2: ", await upgradedV3.get_upgvar2());

        // user2 is the owner of proxy contract
        await upgradedV3.connect(user1).set_upgvar3(101);
        console.log("upgvar3: ", await upgradedV3.get_upgvar3());  

        await expect(upgradedV3.connect(user2).set_upgvar3(101)).to.be.revertedWith('Ownable: caller is not the owner'); // set_upgvar2 can only be called by owner
        await expect(upgradedV3.connect(user0).set_upgvar3(101)).to.be.revertedWith('Ownable: caller is not the owner'); // set_upgvar3 can only be called by owner

    })

    it("UUPS Testing", async function () {
        // Storing the account signers
        const [owner, user1, user2] = await ethers.getSigners();
         
        const EDOUpg2 = await ethers.getContractFactory("EDOUpg2");
        const instance = await upgrades.deployProxy(EDOUpg2, ["EDO Token", "EDO"], { initializer: 'initialize', kind: 'uups'});
        await instance.deployed();
        const contractOwnerV1 = await instance.owner();
        console.log("Values initialized in V1 :-");
        console.log("Proxy Contract Address in V1: ", instance.address);
        console.log("Address of account that deployed Proxy contract: ", contractOwnerV1);        
        await instance.set_upgvar1(7);
        console.log("upgvar1: ", await instance.get_upgvar1());

        // Upgrading to V2
        const EDOUpg2V2 = await ethers.getContractFactory("EDOUpg2V2");
        // const upgradedV3 = await upgrades.upgradeProxy(instance.address, EDOUpg2V2, { call: { fn: "initialize", args:["EDO Token", "EDO"]}, kind: 'uups'});  
        // above statement throws error: The contract is already initalized.
        const upgradedV2 = await upgrades.upgradeProxy(instance.address, EDOUpg2V2, { kind: 'uups'});  
        console.log("Proxy Contract Address in V2: ", upgradedV2.address);
        // const contractOwnerV3 = await instance.owner();
        // console.log(contractOwnerV3);
        console.log("Values updated in V3 :-");
        await upgradedV2.connect(user2).set_upgvar1(99);
        await upgradedV2.connect(user1).set_upgvar2(10);
        await expect(upgradedV2.connect(user1).set_upgvar3(101)).to.be.revertedWith('Ownable: caller is not the owner'); // set_upgvar3 can only be called by owner
        await expect(upgradedV2.connect(user2).set_upgvar3(101)).to.be.revertedWith('Ownable: caller is not the owner'); // set_upgvar3 can only be called by owner
        await upgradedV2.connect(owner).set_upgvar3(101);
        console.log("upgvar1: ", await upgradedV2.get_upgvar1());        
        console.log("upgvar2: ", await upgradedV2.get_upgvar2());  
        console.log("upgvar3: ", await upgradedV2.get_upgvar3());
    })
})
