const { ethers } = require("hardhat");

async function main() {
  const network = await ethers.provider.getNetwork();
  console.log("Current network:", network.name);

  const sepoliaWETH = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"; // Sepolia WETH
  const monadWETHAddress = "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37"; // Monad WETH
  const relayerAddress = "0x899E3bbc6B756a6a52CfcC133AdaF5CCECfC9AA4"; // Address yang akan menjalankan relayer
  const amount = ethers.utils.parseEther("0.01");

  if (network.name === "sepolia") {
    // 1. Deploy dan bridge di Sepolia
    console.log("\nStep 1: Deploy dan bridge di Sepolia");
    const Bridge = await ethers.getContractFactory("AdvancedWETHBridge");
    const sepoliaBridge = await Bridge.deploy(
      sepoliaWETH,
      monadWETHAddress,
      relayerAddress
    );
    await sepoliaBridge.deployed();
    console.log("Bridge deployed to:", sepoliaBridge.address);

    // Get dan approve WETH
    const weth = await ethers.getContractAt("IWrappedETH", sepoliaWETH);
    const [signer] = await ethers.getSigners();

    // Get WETH if needed
    const balance = await weth.balanceOf(signer.address);
    console.log("Current WETH Balance:", ethers.utils.formatEther(balance));

    if (balance.lt(amount)) {
      console.log("Getting WETH...");
      await weth.deposit({ value: amount });
      console.log("Got WETH!");
    }

    console.log("\nApproving WETH...");
    await weth.approve(sepoliaBridge.address, amount);
    console.log("Approved!");

    console.log("\nInitiating bridge...");
    const tx = await sepoliaBridge.bridgeToMonad(amount, {
      gasLimit: 200000,
    });

    // Tunggu transaksi selesai dan dapatkan event
    const receipt = await tx.wait();
    const event = receipt.events.find((e) => e.event === "BridgeInitiated");

    console.log("\nBridge initiated!");
    console.log("Transaction Hash:", tx.hash);
    console.log("User Address:", event.args.user);
    console.log("Amount:", ethers.utils.formatEther(event.args.amount), "WETH");
    console.log("\nWaiting for bridge confirmation...");

    // Listen untuk event BridgeCompleted
    sepoliaBridge.once("BridgeCompleted", (user, amount, event) => {
      console.log("\nBridge completed!");
      console.log("User:", user);
      console.log("Amount:", ethers.utils.formatEther(amount), "WETH");
      console.log("You can now run with --network monad");
      process.exit(0);
    });
  } else if (network.name === "unknown") {
    // Monad
    console.log("\nStep 2: Complete bridge di Monad");
    const Bridge = await ethers.getContractFactory("AdvancedWETHBridge");
    const monadBridge = await Bridge.deploy(
      sepoliaWETH,
      monadWETHAddress,
      relayerAddress
    );
    await monadBridge.deployed();
    console.log("Bridge deployed to:", monadBridge.address);

    const [signer] = await ethers.getSigners();
    console.log("\nCompleting bridge...");

    // Generate txId yang sama dengan di Sepolia
    const txId = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256", "uint256", "uint256"],
        [signer.address, amount, 0, 0] // Gunakan nilai dummy untuk timestamp dan blocknumber
      )
    );

    await monadBridge.completeBridge(signer.address, amount, txId, {
      value: amount,
      gasLimit: 500000,
    });
    console.log("Bridge completed!");

    // Verify hasil
    const monadWETH = await ethers.getContractAt(
      "IWrappedETH",
      monadWETHAddress
    );
    const balance = await monadWETH.balanceOf(signer.address);
    console.log("\nFinal WETH Balance:", ethers.utils.formatEther(balance));
  } else {
    console.log("Please use --network sepolia or --network monad");
    process.exit(1);
  }
}

main().catch(console.error);
