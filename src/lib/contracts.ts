// Contract addresses - Replace with your deployed addresses
export const CONTRACT_ADDRESSES = {
  PLATFORM_TOKEN: '0x1234567890123456789012345678901234567890' as const, // Replace with your PLATFORM_TOKEN_ADDRESS
  CORE_CONTRACT: '0x1234567890123456789012345678901234567891' as const,  // Replace with your CORE_CONTRACT_ADDRESS
  GIFT_CONTRACT: '0x1234567890123456789012345678901234567892' as const,  // Replace with your GIFT_CONTRACT_ADDRESS
  ADMIN_CONTRACT: '0x1234567890123456789012345678901234567893' as const, // Replace with your ADMIN_CONTRACT_ADDRESS
}

// Lottery Game Core ABI (essential functions)
export const LOTTERY_CORE_ABI = [
  // Read functions
  'function getCurrentRound() external view returns (tuple(uint256 roundId, uint256 startTime, uint256 endTime, uint256[5] winningNumbers, bool numbersDrawn, uint256 totalBets, uint256 totalPrizePool, address[] participants, bool giftsDistributed, uint256 vrfRequestId))',
  'function getUserStats(address user) external view returns (tuple(uint256 lastGiftRound, uint256 consecutiveRounds, uint256 totalBets, uint256 totalWinnings, bool isEligibleForGift))',
  'function getUserRoundBets(uint256 roundId, address user) external view returns (uint256[] memory)',
  'function getBet(uint256 roundId, uint256 betIndex) external view returns (tuple(address user, uint256[5] numbers, uint256 amount, uint256 timestamp, uint8 matchCount, bool claimed))',
  'function getClaimableWinnings(uint256 roundId, address user) external view returns (uint256 totalWinnings, uint256[] memory claimableBets)',
  'function getRound(uint256 roundId) external view returns (tuple(uint256 roundId, uint256 startTime, uint256 endTime, uint256[5] winningNumbers, bool numbersDrawn, uint256 totalBets, uint256 totalPrizePool, address[] participants, bool giftsDistributed, uint256 vrfRequestId))',
  
  // Write functions
  'function placeBet(uint256[5] calldata numbers, uint256 amount) external',
  'function claimWinnings(uint256 roundId, uint256[] calldata betIndices) external',
  'function endRound() external',
  
  // Events
  'event BetPlaced(uint256 indexed roundId, address indexed user, uint256[5] numbers, uint256 amount)',
  'event NumbersDrawn(uint256 indexed roundId, uint256[5] winningNumbers)',
  'event WinningsClaimed(uint256 indexed roundId, address indexed user, uint256 amount, uint8 matchCount)',
  'event RoundStarted(uint256 indexed roundId, uint256 startTime, uint256 endTime)',
] as const

// Platform Token ABI (essential functions)
export const PLATFORM_TOKEN_ABI = [
  // ERC20 standard
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function totalSupply() external view returns (uint256)',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)',
  
  // Staking functions
  'function stake(uint256 amount) external',
  'function unstake(uint256 amount) external',
  'function stakedBalance(address user) external view returns (uint256)',
  'function getStakingInfo(address user) external view returns (uint256 staked, uint256 timestamp, bool canUnstake)',
  'function isEligibleForBenefits(address user) external view returns (bool)',
  'function getStakingWeight(address user) external view returns (uint256)',
  'function getSupplyStats() external view returns (uint256 circulating, uint256 staked, uint256 burned)',
  
  // Constants
  'function MIN_STAKE_AMOUNT() external view returns (uint256)',
  
  // Events
  'event TokensStaked(address indexed user, uint256 amount, uint256 totalStaked)',
  'event TokensUnstaked(address indexed user, uint256 amount, uint256 totalStaked)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
] as const

// Gift Contract ABI (essential functions)
export const GIFT_CONTRACT_ABI = [
  'function giftReserve() external view returns (uint256)',
  'function giftRecipientsCount() external view returns (uint256)',
  'function creatorGiftAmount() external view returns (uint256)',
  'function userGiftAmount() external view returns (uint256)',
  'function getGiftReserveStatus() external view returns (uint256 reserve, uint256 costPerRound)',
  'function fundGiftReserve(uint256 amount) external',
  'function distributeGifts(uint256 roundId) external',
  
  'event GiftDistributed(uint256 indexed roundId, address indexed recipient, uint256 amount, bool isCreator)',
  'event GiftReserveFunded(address indexed funder, uint256 amount)',
] as const

// Utility function to get contract config
export const getContractConfig = (contractName: keyof typeof CONTRACT_ADDRESSES) => {
  const address = CONTRACT_ADDRESSES[contractName]
  
  switch (contractName) {
    case 'PLATFORM_TOKEN':
      return { address, abi: PLATFORM_TOKEN_ABI }
    case 'CORE_CONTRACT':
      return { address, abi: LOTTERY_CORE_ABI }
    case 'GIFT_CONTRACT':
      return { address, abi: GIFT_CONTRACT_ABI }
    default:
      throw new Error(`Unknown contract: ${contractName}`)
  }
}