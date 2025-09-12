import { useWriteContract, useReadContract, useAccount } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { parseEther, formatEther } from "viem";
import { toast } from "sonner";
import {
  CONTRACT_ADDRESSES,
  LOTTERY_CORE_ABI,
  GIFT_CONTRACT_ABI,
  ADMIN_CONTRACT_ABI,
  PLATFORM_TOKEN_ABI,
} from "../lib/contracts";
import { useState } from "react";
import { config } from "../lib/web3";

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
  const { writeContract, writeContractAsync, isPending, error } =
    useWriteContract();
  const { address, chain } = useAccount();
  const [isPausing, setIsPausing] = useState(false);
  const [isUnpausing, setIsUnpausing] = useState(false);

  // State for managing round queries
  const [currentRoundId, setCurrentRoundId] = useState<number | null>(null);

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

  const scheduleMaxPayoutChange = async (amount: string) => {
    try {
      const amountBigInt = parseEther(amount);
      await writeContract({
        address: CONTRACT_ADDRESSES.ADMIN_CONTRACT,
        abi: ADMIN_CONTRACT_ABI,
        functionName: "scheduleMaxPayoutChange",
        args: [amountBigInt],
        account: address,
        chain: chain,
      });
      toast.success("Max payout change scheduled transaction submitted!");
    } catch (error: any) {
      toast.error(
        `Max payout schedule failed: ${error.shortMessage || error.message}`
      );
      throw error;
    }
  };

  const setMaxPayoutPerRound = async (amount: string) => {
    try {
      const amountBigInt = parseEther(amount);
      await writeContract({
        address: CONTRACT_ADDRESSES.ADMIN_CONTRACT,
        abi: ADMIN_CONTRACT_ABI,
        functionName: "setMaxPayoutPerRound",
        args: [amountBigInt],
        account: address,
        chain: chain,
      });

      toast.success("Set max payout transaction submitted!!");
    } catch (error: any) {
      toast.error(
        `Set max payout failed: ${error.shortMessage || error.message}`
      );
      throw error;
    }
  };

  const emergencyWithdraw = async (amount: string) => {
    try {
      const amountBigInt = parseEther(amount);
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.ADMIN_CONTRACT,
        abi: ADMIN_CONTRACT_ABI,
        functionName: "emergencyWithdraw",
        args: [amountBigInt],
        account: address,
        chain: chain,
      });
      // Wait for the transaction to be mined
      await waitForTransactionReceipt(config, { hash });
      toast.success("Emergency withdraw transaction successful!");
    } catch (error: any) {
      toast.error(
        `Emergency withdraw failed: ${error.shortMessage || error.message}`
      );
      throw error;
    }
  };

  const pauseLottery = async () => {
    let tokenPaused = false;
    setIsPausing(true);

    try {
      // First, pause the platform token and wait for confirmation
      const tokenTxHash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
        abi: PLATFORM_TOKEN_ABI,
        functionName: "pause",
        account: address,
        chain: chain,
      });

      // Wait for token pause to be confirmed
      await waitForTransactionReceipt(config, {
        hash: tokenTxHash,
      });
      tokenPaused = true;

      // Then pause the lottery through admin contract
      const lotteryTxHash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.ADMIN_CONTRACT,
        abi: ADMIN_CONTRACT_ABI,
        functionName: "pause", // This should call lotteryCore.pause()
        account: address,
        chain: chain,
      });

      // Wait for lottery pause confirmation
      await waitForTransactionReceipt(config, {
        hash: lotteryTxHash,
      });

      toast.success("System paused successfully!");
    } catch (error: any) {
      // If lottery pause fails but token was paused, try to rollback
      if (tokenPaused) {
        try {
          const rollbackTxHash = await writeContractAsync({
            address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
            abi: PLATFORM_TOKEN_ABI,
            functionName: "unpause",
            account: address,
            chain: chain,
          });

          await waitForTransactionReceipt(config, {
            hash: rollbackTxHash,
          });

          toast.warning("Token pause rolled back due to lottery pause failure");
        } catch (rollbackError) {
          toast.error(
            "Critical: Token paused but lottery pause failed. Manual intervention required."
          );
          console.error("Rollback failed:", rollbackError);
        }
      }

      toast.error(
        `Pause transaction failed: ${error.shortMessage || error.message}`
      );
      throw error;
    } finally {
      setIsPausing(false);
    }
  };

  const unPauseLottery = async () => {
    setIsUnpausing(true);
    try {
      const lotteryTxHash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.ADMIN_CONTRACT,
        abi: ADMIN_CONTRACT_ABI,
        functionName: "unpause",
        account: address,
        chain: chain,
      });

      await waitForTransactionReceipt(config, {
        hash: lotteryTxHash,
      });

      const tokenTxHash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
        abi: PLATFORM_TOKEN_ABI,
        functionName: "unpause",
        account: address,
        chain: chain,
      });

      await waitForTransactionReceipt(config, {
        hash: tokenTxHash,
      });

      toast.success("System unpaused successfully!");
    } catch (error: any) {
      toast.error(
        `Unpause transaction failed: ${error.shortMessage || error.message}`
      );
      throw error;
    } finally {
      setIsUnpausing(false);
    }
  };

  const updateGiftSettings = async (
    count: string,
    creatorAmount: string,
    userAmount: string
  ) => {
    try {
      const recipientCountBigInt = BigInt(parseInt(count, 10)); // <-- CORRECT
      const creatorAmountBigInt = parseEther(creatorAmount);
      const userAmountBigInt = parseEther(userAmount);

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.GIFT_CONTRACT,
        abi: GIFT_CONTRACT_ABI,
        functionName: "updateGiftSettings",
        args: [recipientCountBigInt, creatorAmountBigInt, userAmountBigInt],
        account: address,
        chain: chain,
      });
      // Wait for the transaction to be mined
      await waitForTransactionReceipt(config, { hash });
      toast.success("Update gift settings transaction successful!");
    } catch (error: any) {
      console.error("FULL ERROR:", error);
      toast.error(
        `Update gift settings failed: ${error.shortMessage || error.message}`
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
    roundData,
    currentRoundId,

    // Loading state
    isAdminActionPending: isPending,
    isLoadingRound,
    adminError: error,
    roundError,
    isPausing,
    isUnpausing,

    // Functions
    getRound,
    endCurrentRound,
    fundGiftReserve,
    distributeGifts,
    scheduleMaxPayoutChange,
    setMaxPayoutPerRound,
    emergencyWithdraw,
    unPauseLottery,
    pauseLottery,
    updateGiftSettings,
  };
};
