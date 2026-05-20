require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    bscTestnode: {
      url: process.env.RPC_URL || "http://127.0.0.1:9545",
      accounts: [process.env.DEPLOYER_KEY],
      chainId: 35039980,
      gasPrice: 10_000_000_000, // 10 gwei
    },
  },
};
