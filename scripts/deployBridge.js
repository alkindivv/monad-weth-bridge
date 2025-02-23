const { ethers } = require("hardhat");

async function main() {
  const network = await ethers.provider.getNetwork();
  console.log("Deploying to network:", network.name);

  const AdvancedWETHBridge = await ethers.getContractFactory(
    "AdvancedWETHBridge"
  );

  const bridge = await AdvancedWETHBridge.deploy(
    "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14", // Sepolia WETH
    "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37" // Monad WETH
  );
  await bridge.deployed();

  console.log("Bridge deployed to:", bridge.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
