const { ethers } = require("hardhat");

async function main() {
  const sepoliaBridgeAddress = "0xE4F2f0cb9BEc54a6315EE5747E0d62d4eE85AA2a";
  const amount = ethers.utils.parseEther("0.01");

  // Get contracts
  const bridge = await ethers.getContractAt(
    "AdvancedWETHBridge",
    sepoliaBridgeAddress
  );
  const weth = await ethers.getContractAt(
    "IWrappedETH",
    "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"
  );

  // Approve dan bridge
  console.log("Approving WETH...");
  await weth.approve(sepoliaBridgeAddress, amount);

  console.log("Bridging WETH...");
  const tx = await bridge.bridgeToMonad(amount, { gasLimit: 200000 });
  await tx.wait();

  console.log("Bridge initiated! Waiting for relayer...");
}

main().catch(console.error);
