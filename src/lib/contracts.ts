import {
  FULL_PLATFORM_TOKEN_ABI,
  FULL_GIFT_CONTRACT_ABI,
  FULL_LOTTERY_CORE_ABI,
  FULL_ADMIN_CONTRACT_ABI,
} from "./ABIs";

// Contract addresses - Replace with your deployed addresses
export const CONTRACT_ADDRESSES = {
  PLATFORM_TOKEN: "0xeceff35fe011694dfcea93e97bba60d2feec2253" as const, // Replace with your PLATFORM_TOKEN_ADDRESS
  CORE_CONTRACT: "0xB00e9C805E09B4BC5203Cc18e3f45a7e39797F2b" as const, // Replace with your CORE_CONTRACT_ADDRESS
  GIFT_CONTRACT: "0x4A4E08CeB3C062B8849C248869c47f8021531E7d" as const, // Replace with your GIFT_CONTRACT_ADDRESS
  ADMIN_CONTRACT: "0x8A8043B1A3E34E273E7a5A9aD18A70BBeDc2654D" as const, // Replace with your ADMIN_CONTRACT_ADDRESS
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
