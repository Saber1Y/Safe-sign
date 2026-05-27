import { ethers } from "hardhat";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type DeploymentRecord = {
  chainId: number;
  networkName: string;
  deployer: string;
  deployedAt: string;
  contracts: {
    demoToken: string;
    demoNft: string;
    safeSpender: string;
    fakeRewardSpender: string;
    registry: string;
  };
};

async function main() {
  const [deployer] = await ethers.getSigners();
  const { chainId, name } = await ethers.provider.getNetwork();
  console.log("Deploying contracts with:", deployer.address);

  const demoToken = await ethers.deployContract("DemoToken");
  await demoToken.waitForDeployment();

  const demoNFT = await ethers.deployContract("DemoNFT");
  await demoNFT.waitForDeployment();

  const fakeRewardSpender = await ethers.deployContract("FakeRewardSpender");
  await fakeRewardSpender.waitForDeployment();

  const safeSpender = await ethers.deployContract("DemoSafeSpender");
  await safeSpender.waitForDeployment();

  const registry = await ethers.deployContract("SafeSignRegistry");
  await registry.waitForDeployment();

  const deployment: DeploymentRecord = {
    chainId: Number(chainId),
    networkName: name,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    contracts: {
      demoToken: await demoToken.getAddress(),
      demoNft: await demoNFT.getAddress(),
      safeSpender: await safeSpender.getAddress(),
      fakeRewardSpender: await fakeRewardSpender.getAddress(),
      registry: await registry.getAddress(),
    },
  };

  await (
    await registry.setLabel(
      deployment.contracts.demoToken,
      "Official Demo Token",
      0,
      true,
    )
  ).wait();
  await (
    await registry.setLabel(
      deployment.contracts.demoNft,
      "Official Demo NFT",
      0,
      true,
    )
  ).wait();
  await (
    await registry.setLabel(
      deployment.contracts.safeSpender,
      "Known Demo Spender",
      1,
      true,
    )
  ).wait();
  await (
    await registry.setLabel(
      deployment.contracts.fakeRewardSpender,
      "Fake Claim Spender",
      3,
      false,
    )
  ).wait();

  const deploymentsDir = path.resolve(__dirname, "../deployments");
  await mkdir(deploymentsDir, { recursive: true });
  const deploymentPath = path.join(deploymentsDir, "qieTestnet.json");
  await writeFile(deploymentPath, `${JSON.stringify(deployment, null, 2)}\n`);

  const frontendGeneratedDir = path.resolve(
    __dirname,
    "../../frontend/src/config/generated",
  );
  await mkdir(frontendGeneratedDir, { recursive: true });
  const frontendTsPath = path.join(frontendGeneratedDir, "deployment.ts");
  const frontendTs = `export const deployment = ${JSON.stringify(
    {
      chainId: deployment.chainId,
      networkName: deployment.networkName,
      contracts: deployment.contracts,
    },
    null,
    2,
  )} as const;\n`;
  await writeFile(frontendTsPath, frontendTs);

  console.log("DemoToken:", deployment.contracts.demoToken);
  console.log("DemoNFT:", deployment.contracts.demoNft);
  console.log("SafeSpender:", deployment.contracts.safeSpender);
  console.log("FakeRewardSpender:", deployment.contracts.fakeRewardSpender);
  console.log("SafeSignRegistry:", deployment.contracts.registry);
  console.log("Deployment JSON:", deploymentPath);
  console.log("Frontend config:", frontendTsPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
