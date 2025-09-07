import { useWriteContract, useReadContract, useAccount } from "wagmi";
import { parseEther, formatEther } from "viem";
import { toast } from "sonner";
import {
  CONTRACT_ADDRESSES,
  LOTTERY_CORE_ABI,
  GIFT_CONTRACT_ABI,
} from "../lib/contracts";
import { useState } from "react";

interface RoundData {
  roundId: number; // Instead of bigint
  startTime: number; // Instead of bigint
  endTime: number; // Instead of bigint
  winningNumbers: number[]; // Instead of bigint[]
  numbersDrawn: boolean;
  totalBets: bigint; // Formatted as "1.234" ETH
  totalPrizePool: bigint; // Formatted as "5.678" ETH
  participants: string[];
  giftsDistributed: boolean;
  vrfRequestId: number; // Instead of bigint
}

export const useAdmin = () => {
  const { writeContract, isPending, error } = useWriteContract();
  const { address, chain } = useAccount();

  // State for managing round queries
  const [currentRoundId, setCurrentRoundId] = useState<number | null>(null);

  // Read admin-specific data
  const { data: giftReserveStatus } = useReadContract({
    address: CONTRACT_ADDRESSES.GIFT_CONTRACT,
    abi: GIFT_CONTRACT_ABI,
    functionName: "getGiftReserveStatus",
  });

  // Read contract data for the current round ID
  const {
    data: rawRoundData,
    isLoading: isLoadingRound,
    error: roundError,
    refetch: refetchRound,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.CORE_CONTRACT,
    abi: LOTTERY_CORE_ABI,
    functionName: "getRound",
    args: currentRoundId ? [BigInt(currentRoundId)] : undefined,
    query: {
      enabled: currentRoundId !== null,
    },
  });

  // Function to fetch round data by ID
  const getRound = async (roundId: number) => {
    try {
      setCurrentRoundId(roundId);
      // If the roundId is the same as current, refetch
      if (currentRoundId === roundId) {
        await refetchRound();
      }
      toast.success(`Fetching round ${roundId} data...`);
    } catch (error: any) {
      toast.error(`Failed to fetch round data: ${error.message}`);
      throw error;
    }
  };

  const endCurrentRound = async () => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.CORE_CONTRACT,
        abi: LOTTERY_CORE_ABI,
        functionName: "endRound",
        account: address,
        chain: chain,
      });
      toast.success("End round transaction submitted!");
    } catch (error: any) {
      toast.error(`End round failed: ${error.shortMessage || error.message}`);
      throw error;
    }
  };

  const fundGiftReserve = async (amount: string) => {
    try {
      const amountBigInt = parseEther(amount);
      await writeContract({
        address: CONTRACT_ADDRESSES.GIFT_CONTRACT,
        abi: GIFT_CONTRACT_ABI,
        functionName: "fundGiftReserve",
        args: [amountBigInt],
        account: address,
        chain: chain,
      });
      toast.success("Gift reserve funding transaction submitted!");
    } catch (error: any) {
      toast.error(
        `Gift reserve funding failed: ${error.shortMessage || error.message}`
      );
      throw error;
    }
  };

  const distributeGifts = async (roundId: number) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.GIFT_CONTRACT,
        abi: GIFT_CONTRACT_ABI,
        functionName: "distributeGifts",
        args: [BigInt(roundId)],
        account: address,
        chain: chain,
      });
      toast.success("Gift distribution transaction submitted!");
    } catch (error: any) {
      toast.error(
        `Gift distribution failed: ${error.shortMessage || error.message}`
      );
      throw error;
    }
  };

  const roundData = rawRoundData
    ? {
        roundId: Number((rawRoundData as RoundData).roundId),
        startTime: Number((rawRoundData as RoundData).startTime),
        endTime: Number((rawRoundData as RoundData).endTime),
        winningNumbers: (rawRoundData as RoundData).winningNumbers.map(Number),
        numbersDrawn: (rawRoundData as RoundData).numbersDrawn,
        totalBets: formatEther((rawRoundData as RoundData).totalBets),
        totalPrizePool: formatEther((rawRoundData as RoundData).totalPrizePool),
        participants: (rawRoundData as RoundData).participants,
        giftsDistributed: (rawRoundData as RoundData).giftsDistributed,
        vrfRequestId: Number((rawRoundData as RoundData).vrfRequestId),
      }
    : null;

  return {
    // Data
    giftReserveStatus,
    roundData,
    currentRoundId,
    // Loading state
    isAdminActionPending: isPending,
    isLoadingRound,
    adminError: error,
    roundError,
    // Functions
    getRound,
    endCurrentRound,
    fundGiftReserve,
    distributeGifts,
  };
};
