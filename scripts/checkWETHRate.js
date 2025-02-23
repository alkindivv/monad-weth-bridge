const { ethers } = require("hardhat");

async function checkWETHRate() {
  const weth = await ethers.getContractAt(
    "contracts/IWrappedETH.sol:IWrappedETH",
    "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37" // Monad WETH
  );

  // Deposit 1 MON
  const amount = ethers.utils.parseEther("0.01"); // Coba dengan jumlah lebih kecil
  console.log("Depositing", ethers.utils.formatEther(amount), "MON");

  // Add gas limit
  const tx = await weth.deposit({
    value: amount,
    gasLimit: 100000,
  });
  await tx.wait();

  // Check WETH balance before and after
  const [signer] = await ethers.getSigners();
  const balanceBefore = await weth.balanceOf(signer.address);
  console.log("WETH Balance Before:", ethers.utils.formatEther(balanceBefore));

  // Check MON balance
  const monBalance = await ethers.provider.getBalance(signer.address);
  console.log("MON Balance:", ethers.utils.formatEther(monBalance));

  // Check contract info
  console.log("\nContract Info:");
  console.log("WETH Address:", weth.address);
  const symbol = await weth.symbol();
  console.log("Symbol:", symbol);
  const decimals = await weth.decimals();
  console.log("Decimals:", decimals);
}

checkWETHRate()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
