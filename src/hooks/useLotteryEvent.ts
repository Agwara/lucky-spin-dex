import { useEffect } from 'react'
import { useWatchContractEvent } from 'wagmi'
import { toast } from 'sonner'
import { CONTRACT_ADDRESSES, LOTTERY_CORE_ABI, PLATFORM_TOKEN_ABI } from '../lib/contracts'
import { formatEther } from 'viem'

export const useLotteryEvents = (userAddress?: string, onEventReceived?: () => void) => {
  // Watch for bet placed events
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.CORE_CONTRACT,
    abi: LOTTERY_CORE_ABI,
    eventName: 'BetPlaced',
    onLogs(logs) {
      logs.forEach((log:any) => {
        const { user, numbers, amount, roundId } = log.args
        if (user?.toLowerCase() === userAddress?.toLowerCase()) {
          toast.success(
            `Bet placed for Round ${roundId}: [${numbers?.join(', ')}] - ${formatEther(amount || 0n)} PTK`
          )
          onEventReceived?.()
        }
      })
    },
  })

  // Watch for numbers drawn events
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.CORE_CONTRACT,
    abi: LOTTERY_CORE_ABI,
    eventName: 'NumbersDrawn',
    onLogs(logs) {
      logs.forEach((log:any) => {
        const { roundId, winningNumbers } = log.args
        toast.info(
          `Round ${roundId} Results: [${winningNumbers?.join(', ')}]`,
          {
            duration: 10000, // Show longer for results
          }
        )
        onEventReceived?.()
      })
    },
  })

  // Watch for winnings claimed events
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.CORE_CONTRACT,
    abi: LOTTERY_CORE_ABI,
    eventName: 'WinningsClaimed',
    onLogs(logs) {
      logs.forEach((log:any) => {
        const { user, amount, roundId, matchCount } = log.args
        if (user?.toLowerCase() === userAddress?.toLowerCase()) {
          toast.success(
            `🎉 Winnings claimed! ${formatEther(amount || 0n)} PTK for ${matchCount} matches in Round ${roundId}`
          )
          onEventReceived?.()
        }
      })
    },
  })

  // Watch for round started events
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.CORE_CONTRACT,
    abi: LOTTERY_CORE_ABI,
    eventName: 'RoundStarted',
    onLogs(logs) {
      logs.forEach((log:any) => {
        const { roundId } = log.args
        toast.info(`🎰 New Round ${roundId} Started!`)
        onEventReceived?.()
      })
    },
  })

  // Watch for staking events
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
    abi: PLATFORM_TOKEN_ABI,
    eventName: 'TokensStaked',
    onLogs(logs) {
      logs.forEach((log:any) => {
        const { user, amount } = log.args
        if (user?.toLowerCase() === userAddress?.toLowerCase()) {
          toast.success(`Staked ${formatEther(amount || 0n)} PTK successfully!`)
          onEventReceived?.()
        }
      })
    },
  })

  // Watch for unstaking events
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.PLATFORM_TOKEN,
    abi: PLATFORM_TOKEN_ABI,
    eventName: 'TokensUnstaked',
    onLogs(logs) {
      logs.forEach((log:any) => {
        const { user, amount } = log.args
        if (user?.toLowerCase() === userAddress?.toLowerCase()) {
          toast.success(`Unstaked ${formatEther(amount || 0n)} PTK successfully!`)
          onEventReceived?.()
        }
      })
    },
  })
}