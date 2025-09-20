import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { waitForTransactionReceipt, simulateContract } from "wagmi/actions";
import { parseEther, formatEther, decodeErrorResult } from "viem";
import { toast } from "sonner";
import {
  CONTRACT_ADDRESSES,
  LOTTERY_CORE_ABI,
  PLATFORM_TOKEN_ABI,
  GIFT_CONTRACT_ABI,
} from "../lib/contracts";
import { config } from "../lib/web3"; // Your wagmi config

export const useLottery = () => {
  const { address, isConnected, chain } = useAccount();
  const [isRefetching, setIsRefetching] = useState(false);

  // State for managing round queries
  const [currentBetId, setCurrentBetId] = useState<number | null>(null);

  const [fetchingClaimable, setFetchingClaimable] = useState(false);

  const [currentClaimableId, setCurrentClaimableId] = useState<number | null>(
    null
  );

  // Write contract
  const {
    writeContractAsync,
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

  const isPausedQuery = useReadContract({
    address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
    abi: PLATFORM_TOKEN_ABI,
    functionName: "paused",
    query: { enabled: isConnected },
  });

  const currentRoundQuery = useReadContract({
    address: CONTRACT_ADDRESSES.CORE_CONTRACT,
    abi: LOTTERY_CORE_ABI,
    functionName: "getCurrentRound",
    account: address,
    query: { enabled: isConnected },
  });

  const maxPayoutPerRoundQuery = useReadContract({
    address: CONTRACT_ADDRESSES.CORE_CONTRACT,
    abi: LOTTERY_CORE_ABI,
    functionName: "maxPayoutPerRound",
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

  const coreContractTokenBalanceQuery = useReadContract({
    address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
    abi: PLATFORM_TOKEN_ABI,
    functionName: "balanceOf",
    args: CONTRACT_ADDRESSES.CORE_CONTRACT
      ? [CONTRACT_ADDRESSES.CORE_CONTRACT]
      : undefined,
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

  const giftReserveStatusQuery = useReadContract({
    address: CONTRACT_ADDRESSES.GIFT_CONTRACT,
    abi: GIFT_CONTRACT_ABI,
    functionName: "getGiftReserveStatus",
    account: address,
    query: { enabled: isConnected },
  });

  const giftRecipientsCountQuery = useReadContract({
    address: CONTRACT_ADDRESSES.GIFT_CONTRACT,
    abi: GIFT_CONTRACT_ABI,
    functionName: "giftRecipientsCount",
    account: address,
    query: { enabled: isConnected },
  });

  const creatorGiftAmountQuery = useReadContract({
    address: CONTRACT_ADDRESSES.GIFT_CONTRACT,
    abi: GIFT_CONTRACT_ABI,
    functionName: "creatorGiftAmount",
    account: address,
    query: { enabled: isConnected },
  });

  const userGiftAmountQuery = useReadContract({
    address: CONTRACT_ADDRESSES.GIFT_CONTRACT,
    abi: GIFT_CONTRACT_ABI,
    functionName: "userGiftAmount",
    account: address,
    query: { enabled: isConnected },
  });

  const emergencyWithdrawalEnabledQuery = useReadContract({
    address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
    abi: PLATFORM_TOKEN_ABI,
    functionName: "emergencyWithdrawalEnabled",
    account: address,
    query: { enabled: isConnected },
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
    isEligibleQuery.error ||
    giftReserveStatusQuery.error ||
    maxPayoutPerRoundQuery.error ||
    coreContractTokenBalanceQuery.error ||
    isPausedQuery.error ||
    giftRecipientsCountQuery.error ||
    creatorGiftAmountQuery.error ||
    userGiftAmountQuery.error ||
    emergencyWithdrawalEnabledQuery.error;

  useEffect(() => {
    console.log("readError: ", readError);
    if (readError) toast.error(`Failed to fetch data: ${readError.message}`);
  }, [readError]);

  // -----------------------------------
  // Contract Interactions Functions
  // -----------------------------------
  const approveBetting = async (amount: string) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      const amountBigInt = parseEther(amount);

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
        abi: PLATFORM_TOKEN_ABI,
        functionName: "approve",
        args: [CONTRACT_ADDRESSES.CORE_CONTRACT, amountBigInt],
        account: address,
        chain,
      });

      await waitForTransactionReceipt(config, { hash });
      toast.success("Approval completed successfully!");
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

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.CORE_CONTRACT,
        abi: LOTTERY_CORE_ABI,
        functionName: "placeBet",
        args: [numbersArray, amountBigInt],
        account: address,
        chain,
      });

      await waitForTransactionReceipt(config, { hash });
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

    if (isPaused) {
      toast.error("Staking is currently paused. Please try again later.");
      return;
    }

    try {
      const amountBigInt = parseEther(amount);

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
        abi: PLATFORM_TOKEN_ABI,
        functionName: "stake",
        args: [amountBigInt],
        account: address,
        chain,
      });

      // Wait for the transaction to be mined
      await waitForTransactionReceipt(config, { hash });

      toast.success("Staking completed successfully!");
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

    if (isPaused) {
      toast.error("unStaking is currently paused. Please try again later.");
      return;
    }

    try {
      const amountBigInt = parseEther(amount);
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
        abi: PLATFORM_TOKEN_ABI,
        functionName: "unstake",
        args: [amountBigInt],
        account: address,
        chain,
      });
      // Wait for the transaction to be mined
      await waitForTransactionReceipt(config, { hash });
      toast.success("Unstaking completed successfully!");
    } catch (error: any) {
      toast.error(`Unstaking failed: ${error.shortMessage || error.message}`);
      throw error;
    }
  };

  // Read contract data for the current round ID
  const {
    data: rawBetData,
    isLoading: isLoadingBet,
    error: betError,
    refetch: refetchBet,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.CORE_CONTRACT,
    abi: LOTTERY_CORE_ABI,
    functionName: "getUserRoundBets",
    args: currentBetId ? [BigInt(currentBetId), address] : undefined,
    query: {
      enabled: currentBetId !== null,
    },
  });

  // Function to fetch Bet data by ID
  const getUserbets = async (betId: number) => {
    try {
      setCurrentBetId(betId);
      // If the betId is the same as current, refetch
      if (currentBetId === betId) {
        await refetchBet();
      }
      toast.success(`Fetching bet ${betId} data...`);
    } catch (error: any) {
      toast.error(`Failed to fetch round data: ${error.message}`);
      throw error;
    }
  };

  // Read contract data for the current round ID
  const {
    data: rawClaimableData,
    isLoading: isLoadingClaimable,
    error: claimableError,
    refetch: claimableBet,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.CORE_CONTRACT,
    abi: LOTTERY_CORE_ABI,
    functionName: "getClaimableWinnings",
    args: currentClaimableId
      ? [BigInt(currentClaimableId), address]
      : undefined,
    query: {
      enabled: currentClaimableId !== null,
    },
  });

  // Function to fetch Bet data by ID
  const getclaimableBet = async (betId: number) => {
    try {
      setCurrentClaimableId(betId);
      // If the betId is the same as current, refetch
      if (currentClaimableId === betId) {
        await claimableBet();
      }
      toast.success(`Fetching bet ${betId} data...`);
    } catch (error: any) {
      console.log("error: ", error);
      toast.error(`Failed to fetch round data: ${error.message}`);
      throw error;
    }
  };

  const claimWinnings = async (roundId: number, betIndices: number[]) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setFetchingClaimable(true);
      const indices = betIndices.map((i) => BigInt(i));

      // First, try to simulate the transaction to catch custom errors
      try {
        const { request } = await simulateContract(config, {
          address: CONTRACT_ADDRESSES.CORE_CONTRACT,
          abi: LOTTERY_CORE_ABI,
          functionName: "claimWinnings",
          args: [BigInt(roundId), indices],
          account: address,
        });

        // If simulation passes, execute the transaction
        const hash = await writeContractAsync(request);
        await waitForTransactionReceipt(config, { hash });
        toast.success("Winnings claimed successfully!");
      } catch (simulationError: any) {
        // Handle simulation errors (where custom errors are properly decoded)
        console.log("Simulation error:", simulationError);

        let errorMessage = "Claim failed";

        // Check for custom errors in simulation
        if (simulationError.data?.errorName) {
          switch (simulationError.data.errorName) {
            case "NumbersNotDrawn":
              errorMessage = "The winning numbers have not been drawn yet.";
              break;
            case "NoWinnings":
              errorMessage = "You have no winnings to claim for this round.";
              break;
            case "AlreadyClaimed":
              errorMessage = "You already claimed winnings for this bet.";
              break;
            case "PayoutExceedsMaximum":
              errorMessage = "This round's payout exceeds the allowed maximum.";
              break;
            default:
              errorMessage = `Contract error: ${simulationError.data.errorName}`;
          }
        } else {
          // Try to decode the error manually
          try {
            if (simulationError.data && LOTTERY_CORE_ABI) {
              const decodedError = decodeErrorResult({
                abi: LOTTERY_CORE_ABI,
                data: simulationError.data,
              });
              console.log("Decoded simulation error:", decodedError);

              switch (decodedError?.errorName) {
                case "NumbersNotDrawn":
                  errorMessage = "The winning numbers have not been drawn yet.";
                  break;
                case "NoWinnings":
                  errorMessage =
                    "You have no winnings to claim for this round.";
                  break;
                case "AlreadyClaimed":
                  errorMessage = "You already claimed winnings for this bet.";
                  break;
                case "PayoutExceedsMaximum":
                  errorMessage =
                    "This round's payout exceeds the allowed maximum.";
                  break;
              }
            }
          } catch (decodeError) {
            console.log("Could not decode simulation error:", decodeError);
          }

          // Fallback string matching for simulation errors
          if (errorMessage === "Claim failed") {
            // Safe JSON stringify that handles BigInt
            const errorString = JSON.stringify(simulationError, (key, value) =>
              typeof value === "bigint" ? value.toString() : value
            ).toLowerCase();
            const messageString = (simulationError.message || "").toLowerCase();
            const shortMessageString = (
              simulationError.shortMessage || ""
            ).toLowerCase();

            if (
              errorString.includes("numbersnotdrawn") ||
              messageString.includes("numbersnotdrawn") ||
              shortMessageString.includes("numbersnotdrawn")
            ) {
              errorMessage = "The winning numbers have not been drawn yet.";
            } else if (
              errorString.includes("nowinnings") ||
              messageString.includes("nowinnings") ||
              shortMessageString.includes("nowinnings")
            ) {
              errorMessage = "You have no winnings to claim for this round.";
            } else if (
              errorString.includes("alreadyclaimed") ||
              messageString.includes("alreadyclaimed") ||
              shortMessageString.includes("alreadyclaimed")
            ) {
              errorMessage = "You already claimed winnings for this bet.";
            } else if (
              errorString.includes("payoutexceedsmaximum") ||
              messageString.includes("payoutexceedsmaximum") ||
              shortMessageString.includes("payoutexceedsmaximum")
            ) {
              errorMessage = "This round's payout exceeds the allowed maximum.";
            } else {
              errorMessage =
                simulationError.shortMessage ||
                simulationError.message ||
                "Transaction would fail";
            }
          }
        }

        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("Claim error:", error);

      toast.error(error.message || "Claim failed", {
        position: "top-right",
      });
    } finally {
      setFetchingClaimable(false);
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
        giftReserveStatusQuery.refetch(),
        maxPayoutPerRoundQuery.refetch(),
        coreContractTokenBalanceQuery.refetch(),
        isPausedQuery.refetch(),
        giftRecipientsCountQuery.refetch(),
        creatorGiftAmountQuery.refetch(),
        userGiftAmountQuery.refetch(),
        emergencyWithdrawalEnabledQuery.refetch(),
      ]);
      toast.success("Data refreshed!");
    } catch {
      toast.error("Failed to refresh data");
    } finally {
      setIsRefetching(false);
    }
  };

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
  const giftReserveStatus: any = giftReserveStatusQuery.data;
  const maxPayoutPerRound: any = maxPayoutPerRoundQuery.data ?? 0n;
  const coreContractTokenBalance: any =
    coreContractTokenBalanceQuery.data ?? 0n;
  const isPaused: any = isPausedQuery.data ?? false;
  const giftRecipientsCount: any = giftRecipientsCountQuery.data ?? 0n;
  const creatorGiftAmount: any = creatorGiftAmountQuery.data ?? 0n;
  const userGiftAmount: any = userGiftAmountQuery.data ?? 0n;
  const emergencyWithdrawalEnabled: any =
    emergencyWithdrawalEnabledQuery.data ?? false;

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

  const formattedGiftReserve = giftReserveStatus
    ? {
        reserve: formatEther(giftReserveStatus[0]),
        costPerRound: formatEther(giftReserveStatus[1]),
      }
    : null;

  const formatrawClaimableData = rawClaimableData
    ? [formatEther(rawClaimableData[0]), rawClaimableData[1]]
    : [0n, []];

  const formatrawBetData: any = rawBetData ? rawBetData : [];

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
    giftReserveStatus: formattedGiftReserve,
    maxPayoutPerRound: formatEther(maxPayoutPerRound),
    coreContractTokenBalance: formatEther(coreContractTokenBalance),
    isPaused: Boolean(isPaused),
    giftRecipientsCountValue: Number(giftRecipientsCount),
    creatorGiftAmountValue: formatEther(creatorGiftAmount),
    userGiftAmountValue: formatEther(userGiftAmount),
    emergencyWithdrawalEnabled,
    rawBetData: formatrawBetData,
    rawClaimableData: formatrawClaimableData,
    fetchingClaimable,

    isLoading:
      currentRoundQuery.isLoading ||
      userStatsQuery.isLoading ||
      tokenBalanceQuery.isLoading ||
      stakingInfoQuery.isLoading ||
      allowanceQuery.isLoading ||
      minStakeAmountQuery.isLoading ||
      isEligibleQuery.isLoading ||
      giftReserveStatusQuery.isLoading ||
      maxPayoutPerRoundQuery.isLoading ||
      coreContractTokenBalanceQuery.isLoading ||
      isRefetching ||
      isPausedQuery.isLoading ||
      giftRecipientsCountQuery.isLoading ||
      creatorGiftAmountQuery.isLoading ||
      userGiftAmountQuery.isLoading ||
      emergencyWithdrawalEnabledQuery.isLoading,

    isWritePending: isWritePending || isConfirming,
    isLoadingBet: isLoadingBet,
    isLoadingClaimable: isLoadingClaimable,

    // Functions
    approveBetting,
    placeBet,
    stakeTokens,
    unstakeTokens,
    claimWinnings,
    getUserbets,
    getclaimableBet,
    refetch,

    readError,
    writeError,
    betError,
    claimableError,
  };
};
