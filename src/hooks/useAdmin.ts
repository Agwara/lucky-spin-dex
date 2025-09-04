import { useWriteContract, useReadContract, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { toast } from 'sonner'
import { CONTRACT_ADDRESSES, LOTTERY_CORE_ABI, GIFT_CONTRACT_ABI } from '../lib/contracts'

export const useAdmin = () => {
  const { writeContract, isPending, error } = useWriteContract();
  const { address, chain } = useAccount();

  // Read admin-specific data
  const { data: giftReserveStatus } = useReadContract({
    address: CONTRACT_ADDRESSES.GIFT_CONTRACT,
    abi: GIFT_CONTRACT_ABI,
    functionName: 'getGiftReserveStatus',
  })

  const endCurrentRound = async () => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.CORE_CONTRACT,
        abi: LOTTERY_CORE_ABI,
        functionName: 'endRound',
        account: address,
        chain: chain, 
      })
      toast.success('End round transaction submitted!')
    } catch (error: any) {
      toast.error(`End round failed: ${error.shortMessage || error.message}`)
      throw error
    }
  }

  const fundGiftReserve = async (amount: string) => {
    try {
      const amountBigInt = parseEther(amount)
      await writeContract({
        address: CONTRACT_ADDRESSES.GIFT_CONTRACT,
        abi: GIFT_CONTRACT_ABI,
        functionName: 'fundGiftReserve',
        args: [amountBigInt],
        account: address,
        chain: chain, 
      })
      toast.success('Gift reserve funding transaction submitted!')
    } catch (error: any) {
      toast.error(`Gift reserve funding failed: ${error.shortMessage || error.message}`)
      throw error
    }
  }

  const distributeGifts = async (roundId: number) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.GIFT_CONTRACT,
        abi: GIFT_CONTRACT_ABI,
        functionName: 'distributeGifts',
        args: [BigInt(roundId)],
        account: address,
        chain: chain, 
      })
      toast.success('Gift distribution transaction submitted!')
    } catch (error: any) {
      toast.error(`Gift distribution failed: ${error.shortMessage || error.message}`)
      throw error
    }
  }

  return {
    // Data
    giftReserveStatus,
    
    // Loading state
    isAdminActionPending: isPending,
    adminError: error,
    
    // Functions
    endCurrentRound,
    fundGiftReserve,
    distributeGifts,
  }
}