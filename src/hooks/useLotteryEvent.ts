import { useWatchContractEvent } from "wagmi";
import { toast } from "sonner";
import {
  CONTRACT_ADDRESSES,
  LOTTERY_CORE_ABI,
  PLATFORM_TOKEN_ABI,
  ADMIN_CONTRACT_ABI,
  GIFT_CONTRACT_ABI,
} from "../lib/contracts";
import { formatEther } from "viem";

function shortenString(str, maxLength = 20) {
  if (!str) return "";
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}

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
    // CORE CONTRACT SECTION
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
            )}] - ${formatEther(amount || 0n)} PTK`,
            {
              position: "top-right",
            }
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
            position: "top-right",
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
            )} PTK for ${matchCount} matches in Round ${roundId}`,
            {
              position: "top-right",
            }
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
        toast.info(`🎰 New Round ${roundId} Started!`, {
          position: "top-right",
        });
      },
    },
    // PLATFORM TOKEN SECTION
    {
      address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
      abi: PLATFORM_TOKEN_ABI,
      eventName: "TokensStaked",
      handler: (log: any) => {
        const { user, amount } = log.args;
        if (normalize(user) === currentUser) {
          toast.success(
            `Staked ${formatEther(amount || 0n)} PTK successfully!`,
            {
              position: "top-right",
            }
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
            `Unstaked ${formatEther(amount || 0n)} PTK successfully!`,
            {
              position: "top-right",
            }
          );
        }
      },
    },
    // ADMIN CONTRACT SECTION
    {
      address: CONTRACT_ADDRESSES.ADMIN_CONTRACT,
      abi: ADMIN_CONTRACT_ABI,
      eventName: "OperationScheduled",
      handler: (log: any) => {
        const { operationId } = log.args;
        toast.success(
          `Operation ${shortenString(operationId)} was scheduled successfully!`,
          {
            position: "top-right",
          }
        );
      },
    },

    {
      address: CONTRACT_ADDRESSES.ADMIN_CONTRACT,
      abi: ADMIN_CONTRACT_ABI,
      eventName: "MaxPayoutUpdated",
      handler: (log: any) => {
        const { newMaxPayout } = log.args;
        toast.success(
          `Max Payout Updated of ${formatEther(
            newMaxPayout
          )} PTK was scheduled successfully!`,
          {
            position: "top-right",
          }
        );
      },
    },

    {
      address: CONTRACT_ADDRESSES.CORE_CONTRACT,
      abi: LOTTERY_CORE_ABI,
      eventName: "Paused",
      handler: (log: any) => {
        // const { sender } = log.args;
        console.log("sender: ", log.args);
        toast.success(`Lottery Game Paused successfully!`, {
          position: "top-right",
        });
      },
    },

    {
      address: CONTRACT_ADDRESSES.CORE_CONTRACT,
      abi: LOTTERY_CORE_ABI,
      eventName: "Unpaused",
      handler: (log: any) => {
        // const { sender } = log.args;
        console.log("sender: ", log.args);
        toast.success(`Lottery Game Unpaused successfully!`, {
          position: "top-right",
        });
      },
    },

    {
      address: CONTRACT_ADDRESSES.GIFT_CONTRACT,
      abi: GIFT_CONTRACT_ABI,
      eventName: "GiftSettingsUpdated",
      handler: (log: any) => {
        // const { recipientsCount, creatorAmount, userAmount } = log.args;
        console.log("sender: ", log.args);
        toast.success(`Gift Settings Updated successfully!`, {
          position: "top-right",
        });
      },
    },

    {
      address: CONTRACT_ADDRESSES.GIFT_CONTRACT,
      abi: GIFT_CONTRACT_ABI,
      eventName: "GiftReserveFunded",
      handler: (log: any) => {
        // const { recipientsCount, creatorAmount, userAmount } = log.args;
        console.log("sender: ", log.args);
        toast.success(`Gift Reserve Funded successfully!`, {
          position: "top-right",
        });
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
