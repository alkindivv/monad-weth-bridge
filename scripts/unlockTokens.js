const { ethers } = require("hardhat");

async function unlockTokens() {
  const bridgeAddress = "0x3d759d650c81C5979B7B5EA493E75cB6b257658A"; // Update dengan hasil deploy Monad
  const amount = ethers.utils.parseEther("0.01");
  const [signer] = await ethers.getSigners();

  console.log("Unlocking tokens...");
  const bridge = await ethers.getContractAt(
    "AdvancedWETHBridge",
    bridgeAddress
  );

  const tx = await bridge.unlockTokens(
    signer.address,
    amount,
    "0xacf01b0b0e012677527bd018bb817c08a443bbe942cc0e789913c2cf1b9c3316",
    {
      gasLimit: 500000,
    }
  );
  await tx.wait();
  console.log("Tokens unlocked! Check your MON balance.");
}

unlockTokens()
  .then(() => process.exit(0))
  .catch(console.error);
