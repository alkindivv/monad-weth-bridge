const { ethers } = require("hardhat");

async function fundBridge() {
  const bridgeAddress = "0x3d759d650c81C5979B7B5EA493E75cB6b257658A"; // Bridge di Monad
  const amount = ethers.utils.parseEther("0.01");

  // Get signer
  const [signer] = await ethers.getSigners();
  console.log("Your address:", await signer.getAddress());

  // Check bridge MON balance
  const balanceBefore = await ethers.provider.getBalance(bridgeAddress);
  console.log(
    "Bridge MON Balance Before:",
    ethers.utils.formatEther(balanceBefore)
  );

  // Send MON to bridge
  console.log("\nSending MON to bridge...");
  const tx = await signer.sendTransaction({
    to: bridgeAddress,
    value: amount,
    gasLimit: 100000,
  });
  await tx.wait();

  // Verify balance
  const balanceAfter = await ethers.provider.getBalance(bridgeAddress);
  console.log(
    "Bridge MON Balance After:",
    ethers.utils.formatEther(balanceAfter)
  );
}

fundBridge()
  .then(() => process.exit(0))
  .catch(console.error);
