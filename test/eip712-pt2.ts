// import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
// import { expect } from "chai";
// import "dotenv/config"
// import hre, { ethers } from "hardhat";
// import { Contract, BigNumber, constants, Signer } from 'ethers';
// import { splitSignature, randomBytes } from 'ethers/lib/utils';

// describe("EIP712 Transaction Tests", function () {
  
//     it('should be success with data type provided', async () => {

//         let EIP712Mock: Contract;
//         let EIP712MockSalt: Contract;
//         let wallet: Signer;
//         let Dummy: Signer;
//         const salt = Buffer.from(randomBytes(32));
//         const saltStr = '0x' + salt.toString('hex');

//         const accounts = await ethers.getSigners();
//         [wallet, Dummy] = accounts;

//         EIP712Mock = await (
//         await ethers.getContractFactory('contracts/EIP712Mock.sol:EIP712Mock', wallet)
//         ).deploy(constants.HashZero);

//         EIP712MockSalt = await (
//         await ethers.getContractFactory('contracts/EIP712Mock.sol:EIP712Mock', wallet)
//         ).deploy(saltStr);

//         const walletAddress = await wallet.getAddress();
    
//         const name = await EIP712Mock.name();
//         const version = await EIP712Mock.version();
//         const chainId = await wallet.getChainId();
//         const contractAddress = EIP712Mock.address;
        
//         // What is the use of these two values?
//         const value = constants.MaxUint256;
//         const nonce = await EIP712Mock.nonces(walletAddress);
    
//         const types = {
//             EIP712Domain: [
//             { name: 'name', type: 'string' },
//             { name: 'version', type: 'string' },
//             { name: 'chainId', type: 'uint256' },
//             { name: 'verifyingContract', type: 'address' },
//             ],
//             // Verify: [
//             // { name: 'owner', type: 'address' },
//             // { name: 'value', type: 'uint256' },
//             // { name: 'nonce', type: 'uint256' },
//             // ],
//             Sign: [
//                 { name: "nonce", type: "uint256" },
//                 { name: "amount", type: "uint256" },
//             ]
//         };
    
//         const primaryType = 'Sign' as const;
    
//         // this is domainData in pt1
//         const domain = {
//             name: name,
//             version: version,
//             chainId: chainId,
//             verifyingContract: contractAddress,
//         };
    
//         // const message = {
//         //     owner: walletAddress,
//         //     value: value.toString(),
//         //     nonce: nonce.toString(),
//         // };
        
//         const message = {
//             nonce: 0,
//             amount: 100
//         };
    
//         const typedMessage = {
//             domain,
//             types,
//             message,
//             primaryType,
//         };
    
//         const sig = await hre.network.provider.send('eth_signTypedData_v4', [walletAddress, typedMessage]);
    
//         const { v, r, s } = splitSignature(sig);
    
//         await EIP712Mock.connect(Dummy)['verify(address,uint256,uint8,bytes32,bytes32)'](walletAddress, value, v, r, s);
//         expect(await EIP712Mock.nonces(walletAddress)).equal(BigNumber.from(1));
//     });
// })
