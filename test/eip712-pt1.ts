import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import { expect } from "chai";
import "dotenv/config"
import hre, { ethers } from "hardhat";
import { Contract, BigNumber, constants, Signer } from 'ethers';
import { splitSignature, randomBytes } from 'ethers/lib/utils';

describe("EIP712 Transaction Tests", function () {
    it("I don't know what to write here", async function () {

        const [user1, user2] = await ethers.getSigners();

        const Storage = await ethers.getContractFactory("Storage");
        const storage = await Storage.deploy();

        // // Explained more about this on my Notion page
        // function parseSignature(signature) {
        //     var r = signature.substring(0, 64);
        //     var s = signature.substring(64, 128);
        //     var v = signature.substring(128, 130);
        
        //     return {
        //         r: "0x" + r,
        //         s: "0x" + s,
        //         v: parseInt(v, 16)
        //     }
        // }
        
        // function genSolidityVerifier(signature, signer, chainId) {
                
        //     return solidityCode
        //     .replace("<CHAINID>", chainId)
        //     .replace("<SIGR>", signature.r)
        //     .replace("<SIGS>", signature.s)
        //     .replace("<SIGV>", signature.v)
        //     .replace("<SIGNER>", signer);
        // }
        
        // window.onload = function (e) {
        //     var res = document.getElementById("response");
        //     res.style.display = "none";
        
            // // force the user to unlock their MetaMask
            // if (web3.eth.accounts[0] == null) {
            // alert("Please unlock MetaMask first");
            // // Trigger login request with MetaMask
            // web3.currentProvider.enable().catch(alert)
            // }
        
            // var signBtn = document.getElementById("signBtn");
            // signBtn.onclick = function(e) {
            // if (web3.eth.accounts[0] == null) {
            //     return;
            // }
    
        const domain = [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
        ];
    
        const sign = [
            { name: "nonce", type: "uint256" },
            { name: "amount", type: "uint256" },
        ];
    
        const chainId = await ethers.provider.getNetwork()
        
        const domainData = {
            name: "Test dApp",
            version: "1",
            chainId: chainId,
            verifyingContract: storage.address,
        };

        var message = {
            nonce: 0,
            amount: 100
        };
        
        const data = JSON.stringify({
            types: {
                EIP712Domain: domain,
                Sign: sign
            },
            domain: domainData,
            primaryType: "Sign",
            message: message
        });
    
        // HAVE TO CHANGE THIS PART FROM web3.js TO ethers.js
        // const signer = web3.toChecksumAddress(web3.eth.accounts[0]);

        // HAVE TO CHANGE THIS PART FROM web3.js TO ethers.js
        web3.currentProvider.sendAsync(
            {
            method: "eth_signTypedData_v4",
            params: [signer, data],
            from: signer
            }, 
            function(err, result) {
            if (err || result.error) {
                return console.error(result);
            }
    
            const signature = parseSignature(result.result.substring(2));
    
            res.style.display = "block";
            // res.value = genSolidityVerifier(signature, signer, chainId);
            }
        );
        // const signature = await window.ethereum.request({ method, params });
    })        
})
