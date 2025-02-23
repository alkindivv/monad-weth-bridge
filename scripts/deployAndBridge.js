const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const sepoliaWETH = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"; // Sepolia WETH
  const monadWETH = "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37"; // Monad WETH
  const amount = ethers.utils.parseEther("0.01");

  // 1. Deploy bridge di Sepolia
  console.log("\nStep 1: Deploying bridges...");

  console.log("Switching to Sepolia...");
  await hre.changeNetwork("sepolia");
  const Bridge = await ethers.getContractFactory("AdvancedWETHBridge");

  console.log("Deploying to Sepolia...");
  const sepoliaBridge = await Bridge.deploy(sepoliaWETH, monadWETH);
  await sepoliaBridge.deployed();
  console.log("Sepolia bridge deployed to:", sepoliaBridge.address);

  // 2. Deploy bridge di Monad
  console.log("\nSwitching to Monad...");
  await hre.changeNetwork("monad");

  console.log("Deploying to Monad...");
  const monadBridge = await Bridge.deploy(sepoliaWETH, monadWETH);
  await monadBridge.deployed();
  console.log("Monad bridge deployed to:", monadBridge.address);

  // 3. Bridge WETH dari Sepolia
  console.log("\nStep 2: Bridging WETH...");
  console.log("Switching back to Sepolia...");
  await hre.changeNetwork("sepolia");

  // Get contracts
  const wethSepolia = await ethers.getContractAt("IWrappedETH", sepoliaWETH);
  const [signer] = await ethers.getSigners();

  // Check balance
  const balance = await wethSepolia.balanceOf(signer.address);
  console.log(
    "Initial WETH Balance on Sepolia:",
    ethers.utils.formatEther(balance)
  );

  // Get WETH if needed
  if (balance.lt(amount)) {
    console.log("Getting WETH on Sepolia...");
    const tx = await wethSepolia.deposit({ value: amount });
    await tx.wait();
    console.log("Got WETH!");
  }

  // Approve dan bridge di Sepolia
  console.log("\nApproving WETH...");
  await wethSepolia.approve(sepoliaBridge.address, amount);
  console.log("Approved!");

  console.log("\nInitiating bridge on Sepolia...");
  await sepoliaBridge.bridgeToMonad(amount);
  console.log("Bridge initiated!");

  // 4. Complete bridge di Monad
  console.log("\nStep 3: Completing bridge on Monad...");
  console.log("Switching to Monad...");
  await hre.changeNetwork("monad");

  await monadBridge.completeBridge(signer.address, amount, {
    value: amount,
    gasLimit: 500000,
  });
  console.log("Bridge completed!");

  // 5. Verifikasi hasil
  console.log("\nStep 4: Verifying results...");
  const wethMonad = await ethers.getContractAt("IWrappedETH", monadWETH);
  const finalBalance = await wethMonad.balanceOf(signer.address);
  console.log(
    "Final WETH Balance on Monad:",
    ethers.utils.formatEther(finalBalance)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
