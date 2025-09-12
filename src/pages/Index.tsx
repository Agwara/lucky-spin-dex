import { useState } from "react"
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Trophy, Gift, Settings, RefreshCw, Shield } from "lucide-react"
import { WalletConnect } from "@/components/wallet/WalletConnect"
import { CurrentRound } from "@/components/lottery/CurrentRound"
import { ClaimWinnings } from "@/components/lottery/ClaimWinnings"
import { NumberSelector } from "@/components/lottery/NumberSelector"
import { StakingPanel } from "@/components/lottery/StakingPanel"
import { UserStats } from "@/components/lottery/UserStats"
import { AdminPanel } from "@/components/admin/AdminPanel"
import { useLottery } from "@/hooks/useLottery"
import { toast } from "sonner"
import { useLotteryEvents } from "@/hooks/useLotteryEvent"

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
    giftReserveStatus,
    approveBetting,
    placeBet,
    stakeTokens,
    unstakeTokens,
    refetch
  } = useLottery()

  // Automatically set up in your main component
  useLotteryEvents(address, refetch)

  // Mock admin check - replace with actual admin check from your contract
  const isAdmin = address?.toLowerCase() === "0x6cC2753524B3D63203f001Ab1cF19f2b525E76b7".toLowerCase();

  const handleRefresh = async () => {
    await refetch();
  }

  const handlePlaceBet = async (numbers: number[], amount: string) => {
    if (!isEligible) {
      toast.error("You need to stake tokens first to participate!")
      return
    }

    try {
      const betAmount = parseFloat(amount)
      const userAllowance = parseFloat(allowance)

      if (userAllowance < betAmount) {
        toast.info("Approving tokens for betting...")
        await approveBetting((betAmount * 2).toString()) // Approve 2x for future bets
        // After approval, the user needs to place the bet again
        toast.info("Approval complete! Please place your bet again.")
        return
      }

      await placeBet(numbers, amount)
    } catch (error) {
      console.error('Bet placement failed:', error)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col justify-between md:flex-row md:items-center gap-[10px]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold jackpot-glow">Crystal Chain</h1>
                <p className="text-muted-foreground">Decentralized Lottery Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 justify-between">
              {
                isConnected &&
                <Button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              }
              
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
                🎰 Welcome to Crystal Chain! 🎰
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
          <div className="space-y-8 w-99%">
            {/* Current Round - Always visible */}
            <CurrentRound giftReserveStatus={giftReserveStatus?.reserve} round={currentRound} loading={isLoading} />

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
                    {/* <SendTransaction /> */}
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
                  <div className="grid grid-rows-2 gap-y-[20px]">
                    <ClaimWinnings />
                    <WalletConnect />
                  </div>
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
              <span className="text-xl font-bold">Crystal Chain</span>
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
