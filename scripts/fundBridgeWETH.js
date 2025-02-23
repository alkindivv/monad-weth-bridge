const { ethers } = require("hardhat");

async function fundBridgeWETH() {
  const bridgeAddress = "0x2DfeB255305813A2162DC81c3E73eDd2e5Ff97eC"; // Bridge di Monad
  const amount = ethers.utils.parseEther("0.01");

  // Get WETH contract
  const weth = await ethers.getContractAt(
    "contracts/IWrappedETH.sol:IWrappedETH",
    "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37" // WETH di Monad
  );

  // Check balances
  const [signer] = await ethers.getSigners();
  console.log("\nChecking balances...");
  console.log(
    "Bridge WETH balance:",
    ethers.utils.formatEther(await weth.balanceOf(bridgeAddress))
  );
  console.log(
    "Your WETH balance:",
    ethers.utils.formatEther(await weth.balanceOf(signer.address))
  );

  // Transfer WETH ke bridge
  console.log("\nTransferring WETH to bridge...");
  const tx = await weth.transfer(bridgeAddress, amount, {
    gasLimit: 200000,
  });
  await tx.wait();

  // Verify balance
  console.log("\nVerifying bridge balance...");
  console.log(
    "Bridge WETH balance:",
    ethers.utils.formatEther(await weth.balanceOf(bridgeAddress))
  );
}

fundBridgeWETH()
  .then(() => process.exit(0))
  .catch(console.error);
