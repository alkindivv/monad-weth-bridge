require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    monad: {
      url: "https://testnet-rpc.monad.xyz/",
      chainId: 10143,
      accounts: [PRIVATE_KEY],
      timeout: 60000,
    },
  },
};
