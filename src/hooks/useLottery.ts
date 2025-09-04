import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { toast } from "sonner";
import {
  CONTRACT_ADDRESSES,
  LOTTERY_CORE_ABI,
  PLATFORM_TOKEN_ABI,
} from "../lib/contracts";

export const useLottery = () => {
  const { address, isConnected, chain } = useAccount();
  const [isRefetching, setIsRefetching] = useState(false);

  // Write contract
  const {
    writeContract,
    data: writeData,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  // Wait for transaction confirmations
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // -------------------------------
  // Individual reads (split queries)
  // -------------------------------

  const currentRoundQuery = useReadContract({
    address: CONTRACT_ADDRESSES.CORE_CONTRACT,
    abi: LOTTERY_CORE_ABI,
    functionName: "getCurrentRound",
    account: address,
    query: { enabled: isConnected },
  });

  const userStatsQuery = useReadContract({
    address: CONTRACT_ADDRESSES.CORE_CONTRACT,
    abi: LOTTERY_CORE_ABI,
    functionName: "getUserStats",
    args: address ? [address] : undefined,
    account: address,
    query: { enabled: isConnected && !!address },
  });

  const tokenBalanceQuery = useReadContract({
    address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
    abi: PLATFORM_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    account: address,
    query: { enabled: isConnected && !!address },
  });

  const stakingInfoQuery = useReadContract({
    address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
    abi: PLATFORM_TOKEN_ABI,
    functionName: "getStakingInfo",
    args: address ? [address] : undefined,
    account: address,
    query: { enabled: isConnected && !!address },
  });

  const allowanceQuery = useReadContract({
    address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
    abi: PLATFORM_TOKEN_ABI,
    functionName: "allowance",
    args: address ? [address, CONTRACT_ADDRESSES.CORE_CONTRACT] : undefined,
    account: address,
    query: { enabled: isConnected && !!address },
  });

  const minStakeAmountQuery = useReadContract({
    address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
    abi: PLATFORM_TOKEN_ABI,
    functionName: "MIN_STAKE_AMOUNT",
    account: address,
    query: { enabled: isConnected },
  });

  const isEligibleQuery = useReadContract({
    address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
    abi: PLATFORM_TOKEN_ABI,
    functionName: "isEligibleForBenefits",
    args: address ? [address] : undefined,
    account: address,
    query: { enabled: isConnected && !!address },
  });

  // -----------------------------------
  // Handle errors
  // -----------------------------------
  useEffect(() => {
    if (writeError) toast.error(`Transaction failed: ${writeError.message}`);
  }, [writeError]);

  const readError =
    currentRoundQuery.error ||
    userStatsQuery.error ||
    tokenBalanceQuery.error ||
    stakingInfoQuery.error ||
    allowanceQuery.error ||
    minStakeAmountQuery.error ||
    isEligibleQuery.error;

  useEffect(() => {
    console.log("readError: ", readError);
    if (readError) toast.error(`Failed to fetch data: ${readError.message}`);
  }, [readError]);

  // -----------------------------------
  // Contract Interactions Functions
  // -----------------------------------
  const approveBetting = async (amount: string) => {
    if (!address) return toast.error("Please connect your wallet");
    try {
      const amountBigInt = parseEther(amount);
      await writeContract({
        address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
        abi: PLATFORM_TOKEN_ABI,
        functionName: "approve",
        args: [CONTRACT_ADDRESSES.CORE_CONTRACT, amountBigInt],
        account: address,
        chain,
      });
      toast.success("Approval submitted!");
    } catch (error: any) {
      toast.error(`Approval failed: ${error.shortMessage || error.message}`);
      throw error;
    }
  };

  const placeBet = async (numbers: number[], amount: string) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    if (numbers.length !== 5) {
      toast.error("Please select exactly 5 numbers");
      return;
    }

    try {
      const amountBigInt = parseEther(amount);
      const numbersArray = numbers.map((n) => BigInt(n));

      await writeContract({
        address: CONTRACT_ADDRESSES.CORE_CONTRACT,
        abi: LOTTERY_CORE_ABI,
        functionName: "placeBet",
        args: [numbersArray, amountBigInt],
        account: address,
        chain,
      });
      toast.success("Bet placed successfully!");
    } catch (error: any) {
      toast.error(`Bet failed: ${error.shortMessage || error.message}`);
      throw error;
    }
  };

  const stakeTokens = async (amount: string) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      const amountBigInt = parseEther(amount);
      await writeContract({
        address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
        abi: PLATFORM_TOKEN_ABI,
        functionName: "stake",
        args: [amountBigInt],
        account: address,
        chain,
      });
      toast.success("Staking transaction submitted!");
    } catch (error: any) {
      toast.error(`Staking failed: ${error.shortMessage || error.message}`);
      throw error;
    }
  };

  const unstakeTokens = async (amount: string) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      const amountBigInt = parseEther(amount);
      await writeContract({
        address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
        abi: PLATFORM_TOKEN_ABI,
        functionName: "unstake",
        args: [amountBigInt],
        account: address,
        chain,
      });
      toast.success("Unstaking transaction submitted!");
    } catch (error: any) {
      toast.error(`Unstaking failed: ${error.shortMessage || error.message}`);
      throw error;
    }
  };

  const getUserBets = async (roundId: number) => {
    if (!address) return [];

    try {
      const { data } = await useReadContract({
        address: CONTRACT_ADDRESSES.CORE_CONTRACT,
        abi: LOTTERY_CORE_ABI,
        functionName: "getUserRoundBets",
        args: [BigInt(roundId), address],
      });
      return data || [];
    } catch (error) {
      console.error("Failed to get user bets:", error);
      return [];
    }
  };

  const claimWinnings = async (roundId: number, betIndices: number[]) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      const indices = betIndices.map((i) => BigInt(i));
      await writeContract({
        address: CONTRACT_ADDRESSES.CORE_CONTRACT,
        abi: LOTTERY_CORE_ABI,
        functionName: "claimWinnings",
        args: [BigInt(roundId), indices],
        account: address,
        chain,
      });
      toast.success("Claim transaction submitted!");
    } catch (error: any) {
      toast.error(`Claim failed: ${error.shortMessage || error.message}`);
      throw error;
    }
  };

  const refetch = async () => {
    setIsRefetching(true);
    try {
      await Promise.all([
        currentRoundQuery.refetch(),
        userStatsQuery.refetch(),
        tokenBalanceQuery.refetch(),
        stakingInfoQuery.refetch(),
        allowanceQuery.refetch(),
        minStakeAmountQuery.refetch(),
        isEligibleQuery.refetch(),
      ]);
      toast.success("Data refreshed!");
    } catch {
      toast.error("Failed to refresh data");
    } finally {
      setIsRefetching(false);
    }
  };

  console.log("currentRoundQuery: ", currentRoundQuery.data);
  console.log("userStatsQuery: ", userStatsQuery.data);
  console.log("tokenBalanceQuery: ", tokenBalanceQuery.data);
  console.log("stakingInfoQuery: ", stakingInfoQuery.data);
  console.log("allowanceQuery: ", allowanceQuery.data);
  console.log("minStakeAmountQuery: ", minStakeAmountQuery.data);
  console.log("isEligibleQuery: ", isEligibleQuery.data);

  // -----------------------------------
  // Format data
  // -----------------------------------
  const currentRound: any = currentRoundQuery.data;
  const userStats: any = userStatsQuery.data;
  const tokenBalance: any = tokenBalanceQuery.data ?? 0n;
  const stakingInfo: any = stakingInfoQuery.data;
  const allowance: any = allowanceQuery.data ?? 0n;
  const minStakeAmount: any = minStakeAmountQuery.data ?? 0n;
  const isEligible: any = isEligibleQuery.data ?? false;

  const formattedCurrentRound = currentRound
    ? {
        roundId: Number(currentRound.roundId),
        startTime: Number(currentRound.startTime),
        endTime: Number(currentRound.endTime),
        winningNumbers: currentRound.winningNumbers.map(Number),
        numbersDrawn: currentRound.numbersDrawn,
        totalBets: formatEther(currentRound.totalBets),
        totalPrizePool: formatEther(currentRound.totalPrizePool),
        participants: currentRound.participants,
        giftsDistributed: currentRound.giftsDistributed,
        vrfRequestId: Number(currentRound.vrfRequestId),
      }
    : null;

  const formattedUserStats = userStats
    ? {
        lastGiftRound: Number(userStats.lastGiftRound),
        consecutiveRounds: Number(userStats.consecutiveRounds),
        totalBets: formatEther(userStats.totalBets),
        totalWinnings: formatEther(userStats.totalWinnings),
        isEligibleForGift: userStats.isEligibleForGift,
      }
    : null;

  const formattedStakingInfo = stakingInfo
    ? {
        staked: formatEther(stakingInfo[0]),
        timestamp: Number(stakingInfo[1]),
        canUnstake: stakingInfo[2],
      }
    : null;

  // -----------------------------------
  // Return hook data
  // -----------------------------------
  return {
    currentRound: formattedCurrentRound,
    userStats: formattedUserStats,
    tokenBalance: formatEther(tokenBalance),
    stakingInfo: formattedStakingInfo,
    allowance: formatEther(allowance),
    minStakeAmount: formatEther(minStakeAmount),
    isEligible: Boolean(isEligible),

    isLoading:
      currentRoundQuery.isLoading ||
      userStatsQuery.isLoading ||
      tokenBalanceQuery.isLoading ||
      stakingInfoQuery.isLoading ||
      allowanceQuery.isLoading ||
      minStakeAmountQuery.isLoading ||
      isEligibleQuery.isLoading ||
      isRefetching,

    isWritePending: isWritePending || isConfirming,

    // Functions
    approveBetting,
    placeBet,
    stakeTokens,
    unstakeTokens,
    getUserBets,
    claimWinnings,
    refetch,

    readError,
    writeError,
  };
};
