import {
  FULL_PLATFORM_TOKEN_ABI,
  FULL_GIFT_CONTRACT_ABI,
  FULL_LOTTERY_CORE_ABI,
  FULL_ADMIN_CONTRACT_ABI,
} from "./ABIs";

// Contract addresses - Replace with your deployed addresses
export const CONTRACT_ADDRESSES = {
  PLATFORM_TOKEN: "0x82AD07Fd87E2Ac6e09527De19EE7dcf0Add119CD" as const, // Replace with your PLATFORM_TOKEN_ADDRESS
  CORE_CONTRACT: "0xCcEC0cA14CDa3e9c28625ec087Cfd16344391AE8" as const, // Replace with your CORE_CONTRACT_ADDRESS
  GIFT_CONTRACT: "0x2e1Bbc1a858210E457b24cD09D060a9e7c8B2D4f" as const, // Replace with your GIFT_CONTRACT_ADDRESS
  ADMIN_CONTRACT: "0x9EFB45636C38b3F5876C589A5a040f1BfD8eeAA5" as const, // Replace with your ADMIN_CONTRACT_ADDRESS
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
