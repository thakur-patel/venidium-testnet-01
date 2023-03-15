import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "dotenv/config"
import { ethers } from "ethers";
import '@openzeppelin/hardhat-upgrades';

const account_from = {
  privateKey1: process.env.PRIVATE_KEY_1, // private key of Account 1
  privateKey2: process.env.PRIVATE_KEY_2, // private key of Account 2
  privateKey3: process.env.PRIVATE_KEY_3, // private key of Account 3
  privateKey4: process.env.PRIVATE_KEY_4, // private key of Account 4 
  // (Account 4 is the Impersonated Account. However, I didn't use its private key to do the transaction.)
  // (I've initialized it here so as to put some funds into that account.)
};

import {HardhatNetworkAccountsUserConfig} from "hardhat/types/config";

const accounts: HardhatNetworkAccountsUserConfig = [
  {
    privateKey: account_from.privateKey1!,
    balance: ethers.utils.parseEther('10000').toString()
  }, 
  {
    privateKey: account_from.privateKey2!,
    balance: ethers.utils.parseEther('10000').toString()
  }, 
  {
    privateKey: account_from.privateKey3!,
    balance: ethers.utils.parseEther('10000').toString()
  },
  {
    privateKey: account_from.privateKey4!,
    balance: ethers.utils.parseEther('10000').toString()
  }
]

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      forking: {
        url: "https://rpc-evm-testnet.venidium.io/",
        // blockNumber: 2868491
      },
      accounts
    }
  }
};

export default config;
