const { ethers } = require("hardhat");

async function bridgeToWETH() {
  const helper = await ethers.getContractAt(
    "MonadBridgeHelper",
    "0xa0C3861f6e38F2a90bB2843F6B2398BB5917C05a" // Update dengan address hasil deploy
  );

  console.log("\nStarting conversion...");
  const tx = await helper.bridgeETHToWETH({
    value: ethers.utils.parseEther("0.01"),
    gasLimit: 1000000, // Increased gas limit
  });

  console.log("Waiting for transaction...");
  const receipt = await tx.wait();

  // Parse events
  console.log("\nEvents:");
  for (const event of receipt.events || []) {
    try {
      const args = event.args;
      if (args && args.length >= 2) {
        console.log(`${args[0]}: ${ethers.utils.formatEther(args[1])} ETH`);
      }
    } catch (error) {
      // Skip non-debug events
    }
  }

  console.log("\nConversion complete!");
}

bridgeToWETH()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
