const { ethers } = require("hardhat");

async function unlockTokens() {
  const bridgeAddress = "0x2DfeB255305813A2162DC81c3E73eDd2e5Ff97eC";
  const amount = ethers.utils.parseEther("0.01");
  const [signer] = await ethers.getSigners();

  const bridge = await ethers.getContractAt(
    "AdvancedWETHBridge",
    bridgeAddress
  );
  await bridge.unlockTokens(
    signer.address,
    amount,
    "0x54d788607e4f2164e857afe3bd84592f1fd7339369d6ab287137033eb31e3d56"
  );
}

unlockTokens()
  .then(() => process.exit(0))
  .catch(console.error);
