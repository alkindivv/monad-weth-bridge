const { ethers } = require("hardhat");

async function checkWETHInfo() {
  const weth = await ethers.getContractAt(
    "contracts/IWrappedETH.sol:IWrappedETH",
    "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37" // Monad WETH
  );

  console.log("\nContract Info:");
  console.log("WETH Address:", weth.address);

  // Check balance
  const [signer] = await ethers.getSigners();
  try {
    const balance = await weth.balanceOf(signer.address);
    console.log("Your WETH Balance:", ethers.utils.formatEther(balance));
  } catch (error) {
    console.log("Error getting balance:", error.message);
  }

  // Try small deposit
  try {
    console.log("\nTrying small deposit...");
    const tx = await weth.deposit({
      value: ethers.utils.parseEther("0.001"),
      gasLimit: 100000,
    });
    console.log("Deposit tx:", tx.hash);
    await tx.wait();
    console.log("Deposit successful!");

    // Check balance after
    const balanceAfter = await weth.balanceOf(signer.address);
    console.log("WETH Balance After:", ethers.utils.formatEther(balanceAfter));
  } catch (error) {
    console.log("Error depositing:", error.message);
  }

  // Check if contract has code
  const code = await ethers.provider.getCode(weth.address);
  console.log("\nContract has code:", code !== "0x");
  console.log("Code length:", (code.length - 2) / 2, "bytes");
}

checkWETHInfo()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
