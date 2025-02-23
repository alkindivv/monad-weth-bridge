const { ethers } = require("hardhat");

async function main() {
  const MonadBridgeHelper = await ethers.getContractFactory(
    "MonadBridgeHelper"
  );

  const helper = await MonadBridgeHelper.deploy(
    "0x4200000000000000000000000000000000000010", // Monad Bridge
    "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37" // Monad WETH
  );
  await helper.deployed();

  console.log("Bridge Helper deployed to:", helper.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
