const { ethers } = require("hardhat");

async function main() {
  const sepoliaWETH = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"; // Sepolia WETH
  const monadWETH = "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37"; // Monad WETH
  const amount = ethers.utils.parseEther("0.01");

  // 1. Deploy bridge di Monad
  console.log("\nDeploying bridge to Monad...");
  const Bridge = await ethers.getContractFactory("AdvancedWETHBridge");
  const bridge = await Bridge.deploy(sepoliaWETH, monadWETH);
  await bridge.deployed();
  console.log("Bridge deployed to:", bridge.address);

  // 2. Complete bridge
  console.log("\nCompleting bridge...");
  const [signer] = await ethers.getSigners();

  await bridge.completeBridge(signer.address, amount, {
    value: amount,
    gasLimit: 500000,
  });
  console.log("Bridge completed!");

  // 3. Verify hasil
  const weth = await ethers.getContractAt("IWrappedETH", monadWETH);
  const balance = await weth.balanceOf(signer.address);
  console.log("\nFinal WETH Balance:", ethers.utils.formatEther(balance));
}

main()
  .then(() => process.exit(0))
  .catch(console.error);
