import { useWatchContractEvent } from "wagmi";
import { toast } from "sonner";
import {
  CONTRACT_ADDRESSES,
  LOTTERY_CORE_ABI,
  PLATFORM_TOKEN_ABI,
} from "../lib/contracts";
import { formatEther } from "viem";

export const useLotteryEvents = (
  userAddress?: string,
  onEventReceived?: () => void
) => {
  const normalize = (val?: string) => val?.toLowerCase();
  const currentUser = normalize(userAddress);

  const handleEvent = (eventHandler: (log: any) => void) => (logs: any[]) => {
    logs.forEach((log) => {
      eventHandler(log);
      onEventReceived?.();
    });
  };

  const eventConfigs = [
    {
      address: CONTRACT_ADDRESSES.CORE_CONTRACT,
      abi: LOTTERY_CORE_ABI,
      eventName: "BetPlaced",
      handler: (log: any) => {
        const { user, numbers, amount, roundId } = log.args;
        if (normalize(user) === currentUser) {
          toast.success(
            `Bet placed for Round ${roundId}: [${numbers?.join(
              ", "
            )}] - ${formatEther(amount || 0n)} PTK`
          );
        }
      },
    },
    {
      address: CONTRACT_ADDRESSES.CORE_CONTRACT,
      abi: LOTTERY_CORE_ABI,
      eventName: "NumbersDrawn",
      handler: (log: any) => {
        const { roundId, winningNumbers } = log.args;
        toast.info(
          `Round ${roundId} Results: [${winningNumbers?.join(", ")}]`,
          {
            duration: 10000,
          }
        );
      },
    },
    {
      address: CONTRACT_ADDRESSES.CORE_CONTRACT,
      abi: LOTTERY_CORE_ABI,
      eventName: "WinningsClaimed",
      handler: (log: any) => {
        const { user, amount, roundId, matchCount } = log.args;
        if (normalize(user) === currentUser) {
          toast.success(
            `🎉 Winnings claimed! ${formatEther(
              amount || 0n
            )} PTK for ${matchCount} matches in Round ${roundId}`
          );
        }
      },
    },
    {
      address: CONTRACT_ADDRESSES.CORE_CONTRACT,
      abi: LOTTERY_CORE_ABI,
      eventName: "RoundStarted",
      handler: (log: any) => {
        const { roundId } = log.args;
        toast.info(`🎰 New Round ${roundId} Started!`);
      },
    },
    {
      address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
      abi: PLATFORM_TOKEN_ABI,
      eventName: "TokensStaked",
      handler: (log: any) => {
        const { user, amount } = log.args;
        if (normalize(user) === currentUser) {
          toast.success(
            `Staked ${formatEther(amount || 0n)} PTK successfully!`
          );
        }
      },
    },
    {
      address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
      abi: PLATFORM_TOKEN_ABI,
      eventName: "TokensUnstaked",
      handler: (log: any) => {
        const { user, amount } = log.args;
        if (normalize(user) === currentUser) {
          toast.success(
            `Unstaked ${formatEther(amount || 0n)} PTK successfully!`
          );
        }
      },
    },
  ];

  // Register watchers dynamically
  eventConfigs.forEach(({ address, abi, eventName, handler }) => {
    useWatchContractEvent({
      address,
      abi,
      eventName: eventName as any,
      onLogs: handleEvent(handler),
    });
  });
};
