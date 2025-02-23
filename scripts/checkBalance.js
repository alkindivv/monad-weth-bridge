const { ethers } = require("hardhat");

async function main() {
  const monadWETH = "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37";
  const userAddress = "0x899E3bbc6B756a6a52CfcC133AdaF5CCECfC9AA4";

  const weth = await ethers.getContractAt("IWrappedETH", monadWETH);
  const balance = await weth.balanceOf(userAddress);

  console.log("WETH Balance di Monad:", ethers.utils.formatEther(balance));
}

main().catch(console.error);
