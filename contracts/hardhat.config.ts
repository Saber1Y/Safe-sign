import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const qieRpcUrl = process.env.QIE_RPC_URL ?? "";
const qieChainId = Number(process.env.QIE_CHAIN_ID ?? "1983");
const deployerKey = process.env.DEPLOYER_PRIVATE_KEY ?? "";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    localnet: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    qieTestnet: {
      url: qieRpcUrl,
      chainId: qieChainId,
      accounts: deployerKey ? [deployerKey] : [],
    },
  },
};

export default config;
