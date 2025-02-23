const { ethers } = require("hardhat");

async function getWETH() {
  const amount = ethers.utils.parseEther("0.01");

  const weth = await ethers.getContractAt(
    "contracts/IWrappedETH.sol:IWrappedETH",
    "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14" // Sepolia WETH
  );

  console.log("Depositing ETH to get WETH...");
  const tx = await weth.deposit({
    value: amount,
    gasLimit: 100000,
  });
  await tx.wait();
  console.log("Got WETH!");
}

getWETH()
  .then(() => process.exit(0))
  .catch(console.error);
