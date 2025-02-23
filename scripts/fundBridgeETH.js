const { ethers } = require("hardhat");

async function fundBridgeETH() {
  const bridgeAddress = "0xDDe5F032A9D3F89C1a96C7eec2Ed9AE73082D6B8"; // Monad Bridge
  const amount = ethers.utils.parseEther("0.01");

  // Get signer
  const [signer] = await ethers.getSigners();
  console.log("Your address:", await signer.getAddress());

  // Check bridge ETH balance before
  const balanceBefore = await ethers.provider.getBalance(bridgeAddress);
  console.log(
    "Bridge ETH Balance Before:",
    ethers.utils.formatEther(balanceBefore)
  );

  // Send ETH to bridge dengan gas limit yang lebih tinggi
  console.log("Sending ETH to bridge...");
  const tx = await signer.sendTransaction({
    to: bridgeAddress,
    value: amount,
    gasLimit: 100000, // Tambahkan gas limit
  });
  await tx.wait();

  // Check bridge ETH balance after
  const balanceAfter = await ethers.provider.getBalance(bridgeAddress);
  console.log(
    "Bridge ETH Balance After:",
    ethers.utils.formatEther(balanceAfter)
  );
}

fundBridgeETH()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
