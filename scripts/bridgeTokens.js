const { ethers } = require("hardhat");

async function bridgeTokens() {
  const amount = ethers.utils.parseEther("0.01");
  const bridgeAddress = "0xAB7A526f5890d4fe0CbF8CE6DE3b6521b9091Fc6";

  // Get WETH contract
  const weth = await ethers.getContractAt(
    "contracts/IWrappedETH.sol:IWrappedETH",
    "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14" // Sepolia WETH
  );

  // Check WETH balance
  const [signer] = await ethers.getSigners();
  const balance = await weth.balanceOf(signer.address);
  console.log("Your WETH Balance:", ethers.utils.formatEther(balance));

  if (balance.lt(amount)) {
    console.log("Insufficient WETH balance. Getting WETH first...");
    const tx = await weth.deposit({
      value: amount,
      gasLimit: 100000,
    });
    await tx.wait();
    console.log("Got WETH!");
  }

  // Approve dan lock
  console.log("\nApproving WETH...");
  const approveTx = await weth.approve(bridgeAddress, amount, {
    gasLimit: 100000,
  });
  await approveTx.wait();
  console.log("Approved!");

  console.log("\nLocking WETH...");
  const bridge = await ethers.getContractAt(
    "AdvancedWETHBridge",
    bridgeAddress
  );
  const tx = await bridge.lockTokens(amount, {
    gasLimit: 200000,
  });
  const receipt = await tx.wait();

  // Get transaction ID untuk unlock
  const event = receipt.events.find((e) => e.event === "TokensLocked");
  console.log("\nTransaction ID:", event.args.transactionId);
}

bridgeTokens()
  .then(() => process.exit(0))
  .catch(console.error);
