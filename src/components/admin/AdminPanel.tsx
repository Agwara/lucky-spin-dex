import { useState } from "react"
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Settings, 
  DollarSign, 
  Gift, 
  Pause, 
  Play, 
  AlertTriangle,
  Clock,
  Users
} from "lucide-react"
import { toast } from "sonner"

interface AdminPanelProps {
  isAdmin: boolean
  loading?: boolean
}

export const AdminPanel = ({ isAdmin, loading }: AdminPanelProps) => {
  const { address } = useAccount()
  
  // Core Contract Admin States
  const [maxPayoutAmount, setMaxPayoutAmount] = useState("")
  const [isSchedulingPayout, setIsSchedulingPayout] = useState(false)
  const [isSettingPayout, setIsSettingPayout] = useState(false)
  const [isPausing, setIsPausing] = useState(false)
  const [isUnpausing, setIsUnpausing] = useState(false)
  const [emergencyWithdrawAmount, setEmergencyWithdrawAmount] = useState("")
  const [isEmergencyWithdraw, setIsEmergencyWithdraw] = useState(false)

  // Gift Contract Admin States
  const [giftRecipientsCount, setGiftRecipientsCount] = useState("")
  const [creatorGiftAmount, setCreatorGiftAmount] = useState("")
  const [userGiftAmount, setUserGiftAmount] = useState("")
  const [isUpdatingGiftSettings, setIsUpdatingGiftSettings] = useState(false)
  const [giftReserveFundAmount, setGiftReserveFundAmount] = useState("")
  const [isFundingReserve, setIsFundingReserve] = useState(false)

  // Platform Token Admin States
  const [authorizedBurner, setAuthorizedBurner] = useState("")
  const [isAuthorizingBurner, setIsAuthorizingBurner] = useState(false)
  const [authorizedTransferor, setAuthorizedTransferor] = useState("")
  const [isAuthorizingTransferor, setIsAuthorizingTransferor] = useState(false)
  const [isTogglingEmergencyWithdrawal, setIsTogglingEmergencyWithdrawal] = useState(false)

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have administrator privileges. Only authorized admin accounts can access this section.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const handleScheduleMaxPayoutChange = async () => {
    if (!maxPayoutAmount) {
      toast.error("Please enter a valid amount")
      return
    }

    setIsSchedulingPayout(true)
    try {
      // TODO: Integrate with smart contract
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      toast.success("Max payout change scheduled successfully (24h timelock)")
    } catch (error) {
      toast.error("Failed to schedule max payout change")
    } finally {
      setIsSchedulingPayout(false)
    }
  }

  const handleSetMaxPayout = async () => {
    setIsSettingPayout(true)
    try {
      // TODO: Integrate with smart contract
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success("Max payout updated successfully")
    } catch (error) {
      toast.error("Failed to update max payout")
    } finally {
      setIsSettingPayout(false)
    }
  }

  const handlePause = async () => {
    setIsPausing(true)
    try {
      // TODO: Integrate with smart contract
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success("System paused successfully")
    } catch (error) {
      toast.error("Failed to pause system")
    } finally {
      setIsPausing(false)
    }
  }

  const handleUnpause = async () => {
    setIsUnpausing(true)
    try {
      // TODO: Integrate with smart contract
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success("System unpaused successfully")
    } catch (error) {
      toast.error("Failed to unpause system")
    } finally {
      setIsUnpausing(false)
    }
  }

  const handleEmergencyWithdraw = async () => {
    if (!emergencyWithdrawAmount) {
      toast.error("Please enter a valid amount")
      return
    }

    setIsEmergencyWithdraw(true)
    try {
      // TODO: Integrate with smart contract
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success("Emergency withdrawal completed")
      setEmergencyWithdrawAmount("")
    } catch (error) {
      toast.error("Emergency withdrawal failed")
    } finally {
      setIsEmergencyWithdraw(false)
    }
  }

  const handleUpdateGiftSettings = async () => {
    if (!giftRecipientsCount || !creatorGiftAmount || !userGiftAmount) {
      toast.error("Please fill in all gift settings fields")
      return
    }

    setIsUpdatingGiftSettings(true)
    try {
      // TODO: Integrate with smart contract
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success("Gift settings updated successfully")
    } catch (error) {
      toast.error("Failed to update gift settings")
    } finally {
      setIsUpdatingGiftSettings(false)
    }
  }

  const handleFundGiftReserve = async () => {
    if (!giftReserveFundAmount) {
      toast.error("Please enter a valid amount")
      return
    }

    setIsFundingReserve(true)
    try {
      // TODO: Integrate with smart contract
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success("Gift reserve funded successfully")
      setGiftReserveFundAmount("")
    } catch (error) {
      toast.error("Failed to fund gift reserve")
    } finally {
      setIsFundingReserve(false)
    }
  }

  const handleAuthorizeburner = async (authorize: boolean) => {
    if (!authorizedBurner) {
      toast.error("Please enter a valid address")
      return
    }

    setIsAuthorizingBurner(true)
    try {
      // TODO: Integrate with smart contract
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success(`Burner ${authorize ? 'authorized' : 'deauthorized'} successfully`)
      if (authorize) setAuthorizedBurner("")
    } catch (error) {
      toast.error(`Failed to ${authorize ? 'authorize' : 'deauthorize'} burner`)
    } finally {
      setIsAuthorizingBurner(false)
    }
  }

  const handleAuthorizeTransferor = async (authorize: boolean) => {
    if (!authorizedTransferor) {
      toast.error("Please enter a valid address")
      return
    }

    setIsAuthorizingTransferor(true)
    try {
      // TODO: Integrate with smart contract
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success(`Transferor ${authorize ? 'authorized' : 'deauthorized'} successfully`)
      if (authorize) setAuthorizedTransferor("")
    } catch (error) {
      toast.error(`Failed to ${authorize ? 'authorize' : 'deauthorize'} transferor`)
    } finally {
      setIsAuthorizingTransferor(false)
    }
  }

  const handleToggleEmergencyWithdrawal = async () => {
    setIsTogglingEmergencyWithdrawal(true)
    try {
      // TODO: Integrate with smart contract
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success("Emergency withdrawal setting toggled")
    } catch (error) {
      toast.error("Failed to toggle emergency withdrawal")
    } finally {
      setIsTogglingEmergencyWithdrawal(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold jackpot-glow">Admin Panel</h2>
          <p className="text-muted-foreground">Manage lottery system settings</p>
        </div>
        <Badge variant="outline" className="border-lottery-win text-lottery-win">
          <Shield className="w-3 h-3 mr-1" />
          Administrator
        </Badge>
      </div>

      <Tabs defaultValue="core" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="core" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Core System
          </TabsTrigger>
          <TabsTrigger value="gifts" className="flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Gift System
          </TabsTrigger>
          <TabsTrigger value="token" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Token Settings
          </TabsTrigger>
        </TabsList>

        {/* Core System Management */}
        <TabsContent value="core" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Max Payout Management */}
            <Card className="lottery-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-lottery-jackpot" />
                  Max Payout Per Round
                </CardTitle>
                <CardDescription>
                  Schedule and execute max payout changes (24h timelock required)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="maxPayout">New Max Payout (PTK)</Label>
                  <Input
                    id="maxPayout"
                    type="number"
                    placeholder="e.g., 10000"
                    value={maxPayoutAmount}
                    onChange={(e) => setMaxPayoutAmount(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleScheduleMaxPayoutChange}
                    disabled={isSchedulingPayout || !maxPayoutAmount}
                    className="flex-1"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {isSchedulingPayout ? "Scheduling..." : "Schedule Change"}
                  </Button>
                  <Button
                    onClick={handleSetMaxPayout}
                    disabled={isSettingPayout}
                    variant="outline"
                  >
                    {isSettingPayout ? "Setting..." : "Execute"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Control */}
            <Card className="lottery-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-secondary" />
                  System Control
                </CardTitle>
                <CardDescription>
                  Pause/unpause the lottery system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={handlePause}
                    disabled={isPausing}
                    variant="destructive"
                    className="flex-1"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    {isPausing ? "Pausing..." : "Pause System"}
                  </Button>
                  <Button
                    onClick={handleUnpause}
                    disabled={isUnpausing}
                    variant="default"
                    className="flex-1"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isUnpausing ? "Unpausing..." : "Unpause System"}
                  </Button>
                </div>
                
                <Alert className="border-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Pausing will prevent all betting and staking operations.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Emergency Withdrawal */}
            <Card className="lottery-card md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  Emergency Withdrawal
                </CardTitle>
                <CardDescription>
                  Withdraw funds from the lottery contract in emergency situations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="emergencyAmount">Amount (PTK)</Label>
                  <Input
                    id="emergencyAmount"
                    type="number"
                    placeholder="e.g., 1000"
                    value={emergencyWithdrawAmount}
                    onChange={(e) => setEmergencyWithdrawAmount(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleEmergencyWithdraw}
                  disabled={isEmergencyWithdraw || !emergencyWithdrawAmount}
                  variant="destructive"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {isEmergencyWithdraw ? "Withdrawing..." : "Emergency Withdraw"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gift System Management */}
        <TabsContent value="gifts" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Gift Settings */}
            <Card className="lottery-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-secondary" />
                  Gift Distribution Settings
                </CardTitle>
                <CardDescription>
                  Configure gift amounts and recipients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="recipientsCount">Recipients Count</Label>
                  <Input
                    id="recipientsCount"
                    type="number"
                    placeholder="e.g., 10"
                    value={giftRecipientsCount}
                    onChange={(e) => setGiftRecipientsCount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="creatorAmount">Creator Gift Amount (PTK)</Label>
                  <Input
                    id="creatorAmount"
                    type="number"
                    placeholder="e.g., 100"
                    value={creatorGiftAmount}
                    onChange={(e) => setCreatorGiftAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="userAmount">User Gift Amount (PTK)</Label>
                  <Input
                    id="userAmount"
                    type="number"
                    placeholder="e.g., 50"
                    value={userGiftAmount}
                    onChange={(e) => setUserGiftAmount(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleUpdateGiftSettings}
                  disabled={isUpdatingGiftSettings}
                  className="w-full"
                >
                  {isUpdatingGiftSettings ? "Updating..." : "Update Settings"}
                </Button>
              </CardContent>
            </Card>

            {/* Gift Reserve Management */}
            <Card className="lottery-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-lottery-jackpot" />
                  Gift Reserve Fund
                </CardTitle>
                <CardDescription>
                  Manage the gift distribution reserve
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="reserveFund">Fund Amount (PTK)</Label>
                  <Input
                    id="reserveFund"
                    type="number"
                    placeholder="e.g., 5000"
                    value={giftReserveFundAmount}
                    onChange={(e) => setGiftReserveFundAmount(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleFundGiftReserve}
                  disabled={isFundingReserve || !giftReserveFundAmount}
                  className="w-full"
                >
                  {isFundingReserve ? "Funding..." : "Fund Reserve"}
                </Button>
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Current Reserve: Loading...</p>
                  <p>Cost Per Round: Loading...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Token Management */}
        <TabsContent value="token" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Authorized Burners */}
            <Card className="lottery-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-destructive" />
                  Authorized Burners
                </CardTitle>
                <CardDescription>
                  Manage addresses that can burn tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="burnerAddress">Burner Address</Label>
                  <Input
                    id="burnerAddress"
                    placeholder="0x..."
                    value={authorizedBurner}
                    onChange={(e) => setAuthorizedBurner(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAuthorizeburner(true)}
                    disabled={isAuthorizingBurner || !authorizedBurner}
                    className="flex-1"
                  >
                    {isAuthorizingBurner ? "Processing..." : "Authorize"}
                  </Button>
                  <Button
                    onClick={() => handleAuthorizeburner(false)}
                    disabled={isAuthorizingBurner || !authorizedBurner}
                    variant="outline"
                    className="flex-1"
                  >
                    Revoke
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Authorized Transferors */}
            <Card className="lottery-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-secondary" />
                  Authorized Transferors
                </CardTitle>
                <CardDescription>
                  Manage addresses that can transfer staked tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="transferorAddress">Transferor Address</Label>
                  <Input
                    id="transferorAddress"
                    placeholder="0x..."
                    value={authorizedTransferor}
                    onChange={(e) => setAuthorizedTransferor(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAuthorizeTransferor(true)}
                    disabled={isAuthorizingTransferor || !authorizedTransferor}
                    className="flex-1"
                  >
                    {isAuthorizingTransferor ? "Processing..." : "Authorize"}
                  </Button>
                  <Button
                    onClick={() => handleAuthorizeTransferor(false)}
                    disabled={isAuthorizingTransferor || !authorizedTransferor}
                    variant="outline"
                    className="flex-1"
                  >
                    Revoke
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Withdrawal Toggle */}
            <Card className="lottery-card md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  Emergency Withdrawal Mode
                </CardTitle>
                <CardDescription>
                  Allow users to unstake tokens immediately without waiting period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleToggleEmergencyWithdrawal}
                  disabled={isTogglingEmergencyWithdrawal}
                  variant="destructive"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {isTogglingEmergencyWithdrawal ? "Toggling..." : "Toggle Emergency Mode"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}