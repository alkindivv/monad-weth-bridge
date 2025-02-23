const { ethers } = require("hardhat");

async function main() {
  const sepoliaWETH = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"; // Sepolia WETH
  const monadWETH = "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37"; // Monad WETH
  const amount = ethers.utils.parseEther("0.01");

  // 1. Deploy bridge di Sepolia
  console.log("\nDeploying bridge to Sepolia...");
  const Bridge = await ethers.getContractFactory("AdvancedWETHBridge");
  const bridge = await Bridge.deploy(sepoliaWETH, monadWETH);
  await bridge.deployed();
  console.log("Bridge deployed to:", bridge.address);

  // 2. Bridge WETH
  console.log("\nBridging WETH...");
  const weth = await ethers.getContractAt("IWrappedETH", sepoliaWETH);
  const [signer] = await ethers.getSigners();

  // Check balance
  const balance = await weth.balanceOf(signer.address);
  console.log("Initial WETH Balance:", ethers.utils.formatEther(balance));

  // Get WETH if needed
  if (balance.lt(amount)) {
    console.log("Getting WETH...");
    const tx = await weth.deposit({ value: amount });
    await tx.wait();
    console.log("Got WETH!");
  }

  // Approve dan bridge
  console.log("\nApproving WETH...");
  await weth.approve(bridge.address, amount);
  console.log("Approved!");

  console.log("\nInitiating bridge...");
  await bridge.bridgeToMonad(amount);
  console.log("Bridge initiated! Bridge address:", bridge.address);
}

main()
  .then(() => process.exit(0))
  .catch(console.error);
