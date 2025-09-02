import { useState } from "react"
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Trophy, Gift, Settings, RefreshCw, Shield } from "lucide-react"
import { WalletConnect } from "@/components/wallet/WalletConnect"
import { CurrentRound } from "@/components/lottery/CurrentRound"
import { NumberSelector } from "@/components/lottery/NumberSelector"
import { StakingPanel } from "@/components/lottery/StakingPanel"
import { UserStats } from "@/components/lottery/UserStats"
import { AdminPanel } from "@/components/admin/AdminPanel"
import { useLottery } from "@/hooks/useLottery"
import { toast } from "sonner"

const Index = () => {
  const { isConnected, address } = useAccount()
  const {
    currentRound,
    userStats,
    tokenBalance,
    stakingInfo,
    isEligible,
    minStakeAmount,
    allowance,
    isLoading,
    isWritePending,
    approveBetting,
    placeBet,
    stakeTokens,
    unstakeTokens,
    refetch
  } = useLottery()

  // Mock admin check - replace with actual admin check from your contract
  const isAdmin = address?.toLowerCase() === "0x742d35cc6634c0532925a3b8d29ef515716065f1"

  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setTimeout(() => setRefreshing(false), 1000)
    toast.success("Data refreshed!")
  }

  const handlePlaceBet = async (numbers: number[], amount: string) => {
    if (!isEligible) {
      toast.error("You need to stake tokens first to participate!")
      return
    }

    const betAmount = parseFloat(amount)
    const userAllowance = parseFloat(allowance)

    if (userAllowance < betAmount) {
      toast.info("Approving tokens for betting...")
      await approveBetting((betAmount * 2).toString()) // Approve 2x for future bets
      return
    }

    await placeBet(numbers, amount)
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold jackpot-glow">Lucky Spin DEX</h1>
                <p className="text-muted-foreground">Decentralized Lottery Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              {isConnected && (
                <Badge className="bg-lottery-win text-white">
                  {isEligible ? "Eligible" : "Stake to Play"}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          /* Not Connected State */
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold jackpot-glow">
                🎰 Welcome to Lucky Spin DEX! 🎰
              </h2>
              <p className="text-xl text-muted-foreground">
                The ultimate decentralized lottery experience. Pick your numbers, place your bets, and win big!
              </p>
            </div>

            <WalletConnect />

            {/* Features Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="lottery-card text-center">
                <CardHeader>
                  <Trophy className="w-12 h-12 text-lottery-jackpot mx-auto mb-2" />
                  <CardTitle>Huge Jackpots</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Win up to 800x your bet with our progressive prize structure!
                  </p>
                </CardContent>
              </Card>

              <Card className="lottery-card text-center">
                <CardHeader>
                  <Gift className="w-12 h-12 text-secondary mx-auto mb-2" />
                  <CardTitle>Free Gifts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Play consecutive rounds to unlock gift distributions and bonuses!
                  </p>
                </CardContent>
              </Card>

              <Card className="lottery-card text-center">
                <CardHeader>
                  <Settings className="w-12 h-12 text-primary mx-auto mb-2" />
                  <CardTitle>Provably Fair</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Powered by Chainlink VRF for truly random and verifiable results!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Connected State - Main App */
          <div className="space-y-8">
            {/* Current Round - Always visible */}
            <CurrentRound round={currentRound} loading={isLoading} />

            <Tabs defaultValue="play" className="w-full">
              <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-4' : 'grid-cols-3'}`}>
                <TabsTrigger value="play" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Play Lottery
                </TabsTrigger>
                <TabsTrigger value="staking" className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Staking
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  My Stats
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger value="admin" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Admin
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="play" className="space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <NumberSelector
                      onPlaceBet={handlePlaceBet}
                      disabled={!isEligible || isWritePending}
                      minBetAmount="1"
                      maxBetAmount="1000"
                    />
                  </div>
                  <div>
                    <WalletConnect />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="staking" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <StakingPanel
                    balance={tokenBalance}
                    stakingInfo={stakingInfo}
                    isEligible={isEligible}
                    minStakeAmount={minStakeAmount}
                    onStake={stakeTokens}
                    onUnstake={unstakeTokens}
                    loading={isWritePending}
                  />
                  <WalletConnect />
                </div>
              </TabsContent>

              <TabsContent value="stats" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <UserStats stats={userStats} loading={isLoading} />
                  <WalletConnect />
                </div>
              </TabsContent>

              {isAdmin && (
                <TabsContent value="admin" className="space-y-6">
                  <AdminPanel isAdmin={isAdmin} loading={isLoading} />
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Lucky Spin DEX</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Powered by Ethereum • Chainlink VRF • Built with ❤️ for the community
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
