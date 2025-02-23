const { ethers } = require("hardhat");

async function main() {
  const network = await ethers.provider.getNetwork();
  const sepoliaWETH = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"; // Sepolia WETH

  console.log("Deploying to network:", network.name);
  const Bridge = await ethers.getContractFactory("AdvancedWETHBridge");
  const bridge = await Bridge.deploy(sepoliaWETH);
  await bridge.deployed();

  console.log("Bridge deployed to:", bridge.address);
}

main()
  .then(() => process.exit(0))
  .catch(console.error);
