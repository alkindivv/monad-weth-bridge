const { ethers } = require("hardhat");

async function main() {
  const sepoliaWETH = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
  const monadWETHAddress = "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37";
  const relayerAddress = "0x899E3bbc6B756a6a52CfcC133AdaF5CCECfC9AA4";

  const Bridge = await ethers.getContractFactory("AdvancedWETHBridge");
  const bridge = await Bridge.deploy(
    sepoliaWETH,
    monadWETHAddress,
    relayerAddress
  );
  await bridge.deployed();

  console.log("Bridge deployed to:", bridge.address);
}

main().catch(console.error);
