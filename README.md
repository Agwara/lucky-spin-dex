# Lucky Spin DEX - Decentralized Lottery Platform

A beautiful, fully-featured decentralized lottery game built with React, Vite, Tailwind CSS, and Web3 integration.

## 🎰 Features

- **Provably Fair Lottery**: Powered by Chainlink VRF for truly random number generation
- **Token Staking**: Stake PTK tokens to participate and earn rewards
- **Gift System**: Play consecutive rounds to unlock bonus distributions
- **Beautiful UI**: Dark theme with lottery-themed gradients and animations
- **Real-time Updates**: Live round tracking and instant notifications
- **Mobile Responsive**: Optimized for all device sizes

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd lucky-spin-dex
```

2. Install dependencies:
```bash
npm install
```

3. Configure your contract addresses in `src/lib/contracts.ts`:
```typescript
export const CONTRACT_ADDRESSES = {
  PLATFORM_TOKEN: 'YOUR_PLATFORM_TOKEN_ADDRESS',
  CORE_CONTRACT: 'YOUR_CORE_CONTRACT_ADDRESS', 
  GIFT_CONTRACT: 'YOUR_GIFT_CONTRACT_ADDRESS',
  ADMIN_CONTRACT: 'YOUR_ADMIN_CONTRACT_ADDRESS',
}
```

4. Start the development server:
```bash
npm run dev
```

## 🎮 How to Play

1. **Connect Wallet**: Connect your Web3 wallet (MetaMask recommended)
2. **Stake Tokens**: Stake at least 10 PTK tokens to become eligible
3. **Select Numbers**: Choose 5 numbers from 1-49
4. **Place Bet**: Set your bet amount and place your wager
5. **Wait for Results**: Numbers are drawn every 5 minutes using Chainlink VRF
6. **Claim Winnings**: Automatically claim your winnings if you match numbers

## 🏆 Prize Structure

- **5 matches**: 800x your bet (Jackpot!)
- **4 matches**: 80x your bet
- **3 matches**: 8x your bet  
- **2 matches**: 2x your bet

*All prizes subject to 5% house edge*

## 🎁 Gift System

- Play 3+ consecutive rounds to become eligible for gifts
- Random gift distributions to eligible players
- Creator rewards for platform sustainability

## 🛠 Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom lottery theme
- **Web3**: Wagmi, Viem for Ethereum integration
- **UI Components**: shadcn/ui with custom variants
- **Notifications**: Sonner for toast messages
- **Icons**: Lucide React

## 📱 Contract Integration

The app integrates with 4 main smart contracts:

1. **PlatformToken**: ERC20 token with staking functionality
2. **LotteryGameCore**: Main lottery logic and round management  
3. **LotteryGift**: Gift distribution system
4. **LotteryAdmin**: Administrative functions with timelock

## 🎨 Design System

The app features a custom lottery-themed design system with:

- **Royal Purple & Gold**: Primary color scheme
- **Dynamic Gradients**: Eye-catching background effects
- **Animated Elements**: Lottery balls, winning effects
- **Glassmorphism**: Modern card designs with backdrop blur
- **Responsive Layout**: Mobile-first approach

## 🔧 Configuration

### Web3 Setup

Update `src/lib/web3.ts` with your preferred chains and RPC endpoints.

### Contract ABIs

Contract ABIs are defined in `src/lib/contracts.ts`. Update them if your contracts have different interfaces.

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Deploy the `dist` folder to your preferred hosting platform.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🎯 Roadmap

- [ ] Mobile app version
- [ ] Multiple lottery games
- [ ] NFT prizes
- [ ] Social features
- [ ] Analytics dashboard

---

**Lucky Spin DEX** - Where luck meets technology! 🍀✨