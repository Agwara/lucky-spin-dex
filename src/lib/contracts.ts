import {
  FULL_PLATFORM_TOKEN_ABI,
  FULL_GIFT_CONTRACT_ABI,
  FULL_LOTTERY_CORE_ABI,
  FULL_ADMIN_CONTRACT_ABI,
} from "./ABIs";

// Contract addresses - Replace with your deployed addresses
export const CONTRACT_ADDRESSES = {
  PLATFORM_TOKEN: "0xeceff35fe011694dfcea93e97bba60d2feec2253" as const, // Replace with your PLATFORM_TOKEN_ADDRESS
  CORE_CONTRACT: "0x2374B65D35C3144d7Abc35762df27dD5b5E0F979" as const, // Replace with your CORE_CONTRACT_ADDRESS
  GIFT_CONTRACT: "0x1E06023F4E2Cfa580BA1645Cd4a6DA657CC43886" as const, // Replace with your GIFT_CONTRACT_ADDRESS
  ADMIN_CONTRACT: "0xb618B8cF3FfF26B94230D7de23BaaF65bF0Fe29D" as const, // Replace with your ADMIN_CONTRACT_ADDRESS
};

// Lottery Game Core ABI (essential functions)
export const LOTTERY_CORE_ABI = [...FULL_LOTTERY_CORE_ABI] as const;

// Platform Token ABI (essential functions)
export const PLATFORM_TOKEN_ABI = [...FULL_PLATFORM_TOKEN_ABI] as const;

// Gift Contract ABI (essential functions)
export const GIFT_CONTRACT_ABI = [...FULL_GIFT_CONTRACT_ABI] as const;

// Admin Contract ABI
export const ADMIN_CONTRACT_ABI = [...FULL_ADMIN_CONTRACT_ABI] as const;

// Utility function to get contract config
export const getContractConfig = (
  contractName: keyof typeof CONTRACT_ADDRESSES
) => {
  const address = CONTRACT_ADDRESSES[contractName];

  switch (contractName) {
    case "PLATFORM_TOKEN":
      return { address, abi: PLATFORM_TOKEN_ABI };
    case "CORE_CONTRACT":
      return { address, abi: LOTTERY_CORE_ABI };
    case "GIFT_CONTRACT":
      return { address, abi: GIFT_CONTRACT_ABI };
    case "ADMIN_CONTRACT":
      return { address, abi: ADMIN_CONTRACT_ABI };
    default:
      throw new Error(`Unknown contract: ${contractName}`);
  }
};
