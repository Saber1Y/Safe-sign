export const safeSignRegistryAbi = [
  {
    type: "function",
    name: "getLabel",
    inputs: [{ name: "contractAddress", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "name", type: "string" },
          { name: "riskLevel", type: "uint8" },
          { name: "verifiedBySafeSign", type: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setLabel",
    inputs: [
      { name: "contractAddress", type: "address" },
      { name: "name", type: "string" },
      { name: "riskLevel", type: "uint8" },
      { name: "verifiedBySafeSign", type: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

