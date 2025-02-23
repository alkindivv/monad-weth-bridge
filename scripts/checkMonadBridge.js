const { ethers } = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkMonadBridge() {
  const monadBridge = await ethers.getContractAt(
    "contracts/IMonadBridge.sol:IMonadBridge",
    "0x4200000000000000000000000000000000000010" // Monad Bridge
  );

  const weth = await ethers.getContractAt(
    "contracts/IWrappedETH.sol:IWrappedETH",
    "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37" // Monad WETH
  );

  // Check balances before
  const [signer] = await ethers.getSigners();
  console.log("\nBalances Before:");
  console.log(
    "WETH Balance:",
    ethers.utils.formatEther(await weth.balanceOf(signer.address))
  );
  console.log(
    "MON Balance:",
    ethers.utils.formatEther(await ethers.provider.getBalance(signer.address))
  );

  try {
    console.log("\nDepositing MON to bridge...");
    const tx = await monadBridge.depositETH({
      value: ethers.utils.parseEther("0.01"), // Increased amount
      gasLimit: 200000,
    });
    console.log("Deposit tx:", tx.hash);
    await tx.wait();
    console.log("Deposit successful!");

    // Wait for a few seconds
    console.log("Waiting for 10 seconds...");
    await sleep(10000);

    // Check balances after
    console.log("\nBalances After:");
    console.log(
      "WETH Balance:",
      ethers.utils.formatEther(await weth.balanceOf(signer.address))
    );
    console.log(
      "MON Balance:",
      ethers.utils.formatEther(await ethers.provider.getBalance(signer.address))
    );

    // Check bridge balance
    const bridgeBalance = await weth.balanceOf(monadBridge.address);
    console.log(
      "\nBridge WETH Balance:",
      ethers.utils.formatEther(bridgeBalance)
    );
  } catch (error) {
    console.log("Error depositing:", error.message);
  }
}

checkMonadBridge()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
