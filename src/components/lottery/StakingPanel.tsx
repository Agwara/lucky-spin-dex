import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock, Unlock, TrendingUp, Gift, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface StakingInfo {
  staked: string
  timestamp: number
  canUnstake: boolean
}

interface StakingPanelProps {
  balance: string
  stakingInfo: StakingInfo | null
  isEligible: boolean
  minStakeAmount: string
  onStake: (amount: string) => void
  onUnstake: (amount: string) => void
  loading?: boolean
}

export const StakingPanel = ({
  balance,
  stakingInfo,
  isEligible,
  minStakeAmount,
  onStake,
  onUnstake,
  loading = false
}: StakingPanelProps) => {
  const [stakeAmount, setStakeAmount] = useState(minStakeAmount)
  const [unstakeAmount, setUnstakeAmount] = useState("0")

  const handleStake = () => {
    const amount = parseFloat(stakeAmount)
    const userBalance = parseFloat(balance) / 1e18
    
    if (amount < parseFloat(minStakeAmount)) {
      toast.error(`Minimum stake amount is ${minStakeAmount} PTK`)
      return
    }
    
    if (amount > userBalance) {
      toast.error("Insufficient balance")
      return
    }

    onStake(stakeAmount)
  }

  const handleUnstake = () => {
    const amount = parseFloat(unstakeAmount)
    const stakedBalance = stakingInfo ? parseFloat(stakingInfo.staked) / 1e18 : 0
    
    if (amount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }
    
    if (amount > stakedBalance) {
      toast.error("Insufficient staked balance")
      return
    }

    if (!stakingInfo?.canUnstake) {
      toast.error("You must wait 24 hours before unstaking")
      return
    }

    onUnstake(unstakeAmount)
  }

  const stakedBalance = stakingInfo ? parseFloat(stakingInfo.staked) / 1e18 : 0
  const userBalance = parseFloat(balance) / 1e18

  return (
    <Card className="lottery-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Staking Panel
        </CardTitle>
        <CardDescription>
          Stake PTK tokens to unlock lottery participation and earn rewards
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Wallet Balance</Label>
            <div className="text-2xl font-bold">{userBalance.toFixed(2)} PTK</div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Staked Balance</Label>
            <div className="text-2xl font-bold text-primary">{stakedBalance.toFixed(2)} PTK</div>
          </div>
        </div>

        {/* Eligibility Status */}
        <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
          {isEligible ? (
            <>
              <Gift className="w-6 h-6 text-lottery-win" />
              <div>
                <Badge className="bg-lottery-win text-white mb-1">Eligible</Badge>
                <p className="text-sm text-muted-foreground">
                  You can participate in lottery games and receive gifts!
                </p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-6 h-6 text-destructive" />
              <div>
                <Badge variant="destructive" className="mb-1">Not Eligible</Badge>
                <p className="text-sm text-muted-foreground">
                  Stake at least {minStakeAmount} PTK to participate in lottery games
                </p>
              </div>
            </>
          )}
        </div>

        {/* Staking Actions */}
        <Tabs defaultValue="stake" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stake" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Stake
            </TabsTrigger>
            <TabsTrigger value="unstake" className="flex items-center gap-2">
              <Unlock className="w-4 h-4" />
              Unstake
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stake" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stake-amount">Amount to Stake (PTK)</Label>
              <Input
                id="stake-amount"
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                min={minStakeAmount}
                max={userBalance.toString()}
                step="0.01"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Available: {userBalance.toFixed(2)} PTK | Min: {minStakeAmount} PTK
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStakeAmount((userBalance / 2).toString())}
                disabled={loading}
                size="sm"
              >
                50%
              </Button>
              <Button
                variant="outline"
                onClick={() => setStakeAmount(userBalance.toString())}
                disabled={loading}
                size="sm"
              >
                Max
              </Button>
            </div>

            <Button
              onClick={handleStake}
              disabled={loading || parseFloat(stakeAmount) <= 0}
              className="w-full golden-button"
            >
              <Lock className="w-4 h-4 mr-2" />
              Stake {stakeAmount} PTK
            </Button>
          </TabsContent>

          <TabsContent value="unstake" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="unstake-amount">Amount to Unstake (PTK)</Label>
              <Input
                id="unstake-amount"
                type="number"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                min="0"
                max={stakedBalance.toString()}
                step="0.01"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Staked: {stakedBalance.toFixed(2)} PTK
                {stakingInfo && !stakingInfo.canUnstake && " | Must wait 24h to unstake"}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setUnstakeAmount((stakedBalance / 2).toString())}
                disabled={loading || !stakingInfo?.canUnstake}
                size="sm"
              >
                50%
              </Button>
              <Button
                variant="outline"
                onClick={() => setUnstakeAmount(stakedBalance.toString())}
                disabled={loading || !stakingInfo?.canUnstake}
                size="sm"
              >
                Max
              </Button>
            </div>

            <Button
              onClick={handleUnstake}
              disabled={loading || !stakingInfo?.canUnstake || parseFloat(unstakeAmount) <= 0}
              className="w-full"
              variant="outline"
            >
              <Unlock className="w-4 h-4 mr-2" />
              Unstake {unstakeAmount} PTK
            </Button>
          </TabsContent>
        </Tabs>

        {/* Info Box */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-primary">Staking Benefits:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Access to lottery games</li>
            <li>• Eligibility for gift distributions</li>
            <li>• Higher staking weight = better rewards</li>
            <li>• 24-hour minimum staking period</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}