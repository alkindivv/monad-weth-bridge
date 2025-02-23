const { ethers } = require("hardhat");

async function runRelayer() {
  const sepoliaWETH = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
  const monadWETHAddress = "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37";

  // Get bridge contracts
  const sepoliaBridge = "0xE4F2f0cb9BEc54a6315EE5747E0d62d4eE85AA2a";
  const monadBridge = "0xf43475eF5078A121b883033d96BfeF117046100F";

  console.log("Starting relayer...");
  console.log("Sepolia Bridge:", sepoliaBridge);
  console.log("Monad Bridge:", monadBridge);
  console.log("\nWatching for BridgeInitiated events...");

  // Test koneksi
  const network = await ethers.provider.getNetwork();
  console.log("Connected to network:", network.name);

  // Listen untuk event di Sepolia
  const bridgeSepolia = await ethers.getContractAt(
    "AdvancedWETHBridge",
    sepoliaBridge
  );

  bridgeSepolia.on("BridgeInitiated", async (user, amount, txId, event) => {
    console.log("\nBridge request detected!");
    console.log("User:", user);
    console.log("Amount:", ethers.utils.formatEther(amount), "WETH");
    console.log("Transaction ID:", txId);

    try {
      // Complete bridge di Monad
      const bridgeMonad = await ethers.getContractAt(
        "AdvancedWETHBridge",
        monadBridge
      );

      console.log("\nCompleting bridge on Monad...");
      const tx = await bridgeMonad.completeBridge(user, amount, txId, {
        value: amount,
        gasLimit: 500000,
      });
      await tx.wait();

      console.log("Bridge completed!");
      console.log("Transaction:", tx.hash);
    } catch (error) {
      console.error("Error completing bridge:", error);
    }
  });

  // Log semua event untuk debug
  bridgeSepolia.on("*", (event) => {
    console.log("Event detected:", event);
  });

  // Keep script running
  process.stdin.resume();
}

runRelayer().catch(console.error);
