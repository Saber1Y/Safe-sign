import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const qieRpcUrl = process.env.QIE_RPC_URL ?? "";
const qieChainId = Number(process.env.QIE_CHAIN_ID ?? "35443");
const deployerKey = process.env.DEPLOYER_PRIVATE_KEY ?? "";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    qieTestnet: {
      url: qieRpcUrl,
      chainId: qieChainId,
      accounts: deployerKey ? [deployerKey] : [],
    },
  },
};

export default config;
