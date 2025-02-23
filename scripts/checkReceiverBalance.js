const { ethers } = require("hardhat");

async function checkReceiverBalance() {
  // WETH Monad address
  const wethAddress = "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37";
  const receiverAddress = "0x1f4882Db5796ff92717F6c75Dcdc9fc7e1f13a6E";

  // Get WETH contract
  const weth = await ethers.getContractAt("IERC20", wethAddress);

  // Check receiver's WETH balance
  const balance = await weth.balanceOf(receiverAddress);
  console.log(
    "Receiver WETH Balance:",
    ethers.utils.formatEther(balance),
    "WETH"
  );
}

checkReceiverBalance()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
