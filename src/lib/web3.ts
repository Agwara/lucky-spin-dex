import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, polygon, polygonMumbai } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'
// import { CONTRACT_ADDRESSES } from './contracts'

// Configure chains - add your preferred chains
export const config = createConfig({
  chains: [mainnet, sepolia, polygon, polygonMumbai],
  connectors: [
    metaMask()
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
  },
})

// Add chain configuration helper
export const getChainConfig = (chainId: number) => {
  const chain = config.chains.find(c => c.id === chainId)
  if (!chain) throw new Error(`Chain ${chainId} not configured`)
  return chain
}

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}