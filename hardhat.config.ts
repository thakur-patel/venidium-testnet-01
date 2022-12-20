import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      forking: {
        url: "https://rpc-evm-testnet.venidium.io/",
        // blockNumber: 2868491
      }
    }
  }
};

export default config;
