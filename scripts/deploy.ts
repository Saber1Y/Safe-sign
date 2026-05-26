import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const demoToken = await ethers.deployContract("DemoToken");
  await demoToken.waitForDeployment();

  const demoNFT = await ethers.deployContract("DemoNFT");
  await demoNFT.waitForDeployment();

  const fakeRewardSpender = await ethers.deployContract("FakeRewardSpender");
  await fakeRewardSpender.waitForDeployment();

  const registry = await ethers.deployContract("SafeSignRegistry");
  await registry.waitForDeployment();

  console.log("DemoToken:", await demoToken.getAddress());
  console.log("DemoNFT:", await demoNFT.getAddress());
  console.log("FakeRewardSpender:", await fakeRewardSpender.getAddress());
  console.log("SafeSignRegistry:", await registry.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

