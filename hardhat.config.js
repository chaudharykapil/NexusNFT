
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
    networks:{
      sepolia: {
      url: `https://sepolia.infura.io/v3/008163aea6bf4cce9b12f215ec5d09fd`,
      accounts: [`0xc2c4ddc5a8d9954162c8afc414f0102a9d35d4553bfc3a99b7c2b38437d498fa`], // Make sure to replace with your private key
      chainId: 11155111,
    },
  },
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
};

