import { useEffect, useState } from "react"
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
  Users,
  History,
  Info
} from "lucide-react"
import { toast } from "sonner"
import { useAdmin } from "@/hooks/useAdmin"

interface AdminPanelProps {
  isAdmin: boolean
  loading?: boolean
}

export const AdminPanel = ({ isAdmin, loading }: AdminPanelProps) => {
  const { address } = useAccount()
  const { getRound, roundData, isLoadingRound, roundError } = useAdmin();
 
  const [roundeID, setRoundId] = useState("")

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

  console.log("roundData: ", roundData)
  console.log("isLoadingRound: ", isLoadingRound)
  console.log("roundError: ", roundError)

  useEffect(() => {
    getRound(1);
  }, [])


  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4">
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

  const handleFetchRound = () => {
    const roundIdTemp = parseInt(roundeID);
    if (isNaN(roundIdTemp) || roundIdTemp <= 0) {
      toast.error('Please enter a valid round ID');
      return;
    }
    getRound(roundIdTemp);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  return (
    <div className="space-y-4 px-4 sm:px-6 lg:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold jackpot-glow">Admin Panel</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Manage lottery system settings</p>
        </div>
        <Badge variant="outline" className="border-lottery-win text-lottery-win self-start sm:self-auto">
          <Shield className="w-3 h-3 mr-1" />
          Administrator
        </Badge>
      </div>

      <Tabs defaultValue="core" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="core" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-1.5">
            <Settings className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Core System</span>
          </TabsTrigger>
          <TabsTrigger value="gifts" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-1.5">
            <Gift className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Gift System</span>
          </TabsTrigger>
          <TabsTrigger value="token" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-1.5">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Token Settings</span>
          </TabsTrigger>

          <TabsTrigger value="history" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-1.5">
            <History className="w-4 h-4" />
            <span className="text-xs sm:text-sm">History</span>
          </TabsTrigger>
        </TabsList>

        {/* Core System Management */}
        <TabsContent value="core" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Max Payout Management */}
            <Card className="lottery-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-lottery-jackpot" />
                  Max Payout Per Round
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Schedule and execute max payout changes (24h timelock required)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="maxPayout" className="text-sm">New Max Payout (PTK)</Label>
                  <Input
                    id="maxPayout"
                    type="number"
                    placeholder="e.g., 10000"
                    value={maxPayoutAmount}
                    onChange={(e) => setMaxPayoutAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={handleScheduleMaxPayoutChange}
                    disabled={isSchedulingPayout || !maxPayoutAmount}
                    className="flex-1 text-sm p-1"
                    size="sm"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {isSchedulingPayout ? "Scheduling..." : "Schedule Change"}
                  </Button>
                  <Button
                    onClick={handleSetMaxPayout}
                    disabled={isSettingPayout}
                    variant="outline"
                    className="text-sm"
                    size="sm"
                  >
                    {isSettingPayout ? "Setting..." : "Execute"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Control */}
            <Card className="lottery-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                  System Control
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Pause/unpause the lottery system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={handlePause}
                    disabled={isPausing}
                    variant="destructive"
                    className="flex-1 text-sm p-1"
                    size="sm"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    {isPausing ? "Pausing..." : "Pause System"}
                  </Button>
                  <Button
                    onClick={handleUnpause}
                    disabled={isUnpausing}
                    variant="default"
                    className="flex-1 text-sm p-1"
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isUnpausing ? "Unpausing..." : "Unpause System"}
                  </Button>
                </div>
                
                <Alert className="border-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs sm:text-sm">
                    Pausing will prevent all betting and staking operations.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Emergency Withdrawal */}
            <Card className="lottery-card lg:col-span-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-destructive text-base sm:text-lg">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Emergency Withdrawal
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Withdraw funds from the lottery contract in emergency situations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-w-sm">
                  <Label htmlFor="emergencyAmount" className="text-sm">Amount (PTK)</Label>
                  <Input
                    id="emergencyAmount"
                    type="number"
                    placeholder="e.g., 1000"
                    value={emergencyWithdrawAmount}
                    onChange={(e) => setEmergencyWithdrawAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleEmergencyWithdraw}
                  disabled={isEmergencyWithdraw || !emergencyWithdrawAmount}
                  variant="destructive"
                  size="sm"
                  className="text-sm"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {isEmergencyWithdraw ? "Withdrawing..." : "Emergency Withdraw"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gift System Management */}
        <TabsContent value="gifts" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Gift Settings */}
            <Card className="lottery-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                  Gift Distribution Settings
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Configure gift amounts and recipients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="recipientsCount" className="text-sm">Recipients Count</Label>
                  <Input
                    id="recipientsCount"
                    type="number"
                    placeholder="e.g., 10"
                    value={giftRecipientsCount}
                    onChange={(e) => setGiftRecipientsCount(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="creatorAmount" className="text-sm">Creator Gift Amount (PTK)</Label>
                  <Input
                    id="creatorAmount"
                    type="number"
                    placeholder="e.g., 100"
                    value={creatorGiftAmount}
                    onChange={(e) => setCreatorGiftAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="userAmount" className="text-sm">User Gift Amount (PTK)</Label>
                  <Input
                    id="userAmount"
                    type="number"
                    placeholder="e.g., 50"
                    value={userGiftAmount}
                    onChange={(e) => setUserGiftAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleUpdateGiftSettings}
                  disabled={isUpdatingGiftSettings}
                  className="w-full text-sm"
                  size="sm"
                >
                  {isUpdatingGiftSettings ? "Updating..." : "Update Settings"}
                </Button>
              </CardContent>
            </Card>

            {/* Gift Reserve Management */}
            <Card className="lottery-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-lottery-jackpot" />
                  Gift Reserve Fund
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Manage the gift distribution reserve
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="reserveFund" className="text-sm">Fund Amount (PTK)</Label>
                  <Input
                    id="reserveFund"
                    type="number"
                    placeholder="e.g., 5000"
                    value={giftReserveFundAmount}
                    onChange={(e) => setGiftReserveFundAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleFundGiftReserve}
                  disabled={isFundingReserve || !giftReserveFundAmount}
                  className="w-full text-sm"
                  size="sm"
                >
                  {isFundingReserve ? "Funding..." : "Fund Reserve"}
                </Button>
                
                <div className="text-xs sm:text-sm text-muted-foreground space-y-1 pt-2 border-t">
                  <p>Current Reserve: Loading...</p>
                  <p>Cost Per Round: Loading...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Token Management */}
        <TabsContent value="token" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Authorized Burners */}
            <Card className="lottery-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
                  Authorized Burners
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Manage addresses that can burn tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="burnerAddress" className="text-sm">Burner Address</Label>
                  <Input
                    id="burnerAddress"
                    placeholder="0x..."
                    value={authorizedBurner}
                    onChange={(e) => setAuthorizedBurner(e.target.value)}
                    className="mt-1 font-mono text-sm"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={() => handleAuthorizeburner(true)}
                    disabled={isAuthorizingBurner || !authorizedBurner}
                    className="flex-1 text-sm p-1"
                    size="sm"
                  >
                    {isAuthorizingBurner ? "Processing..." : "Authorize"}
                  </Button>
                  <Button
                    onClick={() => handleAuthorizeburner(false)}
                    disabled={isAuthorizingBurner || !authorizedBurner}
                    variant="outline"
                    className="flex-1 text-sm p-1"
                    size="sm"
                  >
                    Revoke
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Authorized Transferors */}
            <Card className="lottery-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                  Authorized Transferors
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Manage addresses that can transfer staked tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="transferorAddress" className="text-sm">Transferor Address</Label>
                  <Input
                    id="transferorAddress"
                    placeholder="0x..."
                    value={authorizedTransferor}
                    onChange={(e) => setAuthorizedTransferor(e.target.value)}
                    className="mt-1 font-mono text-sm"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={() => handleAuthorizeTransferor(true)}
                    disabled={isAuthorizingTransferor || !authorizedTransferor}
                    className="flex-1 text-sm p-1"
                    size="sm"
                  >
                    {isAuthorizingTransferor ? "Processing..." : "Authorize"}
                  </Button>
                  <Button
                    onClick={() => handleAuthorizeTransferor(false)}
                    disabled={isAuthorizingTransferor || !authorizedTransferor}
                    variant="outline"
                    className="flex-1 text-sm p-1"
                    size="sm"
                  >
                    Revoke
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Withdrawal Toggle */}
            <Card className="lottery-card lg:col-span-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-destructive text-base sm:text-lg">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Emergency Withdrawal Mode
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Allow users to unstake tokens immediately without waiting period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleToggleEmergencyWithdrawal}
                  disabled={isTogglingEmergencyWithdrawal}
                  variant="destructive"
                  size="sm"
                  className="text-sm"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {isTogglingEmergencyWithdrawal ? "Toggling..." : "Toggle Emergency Mode"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Max Payout Management */}
            <Card className="lottery-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <History className="w-4 h-4 sm:w-5 sm:h-5 text-lottery-jackpot" />
                  Get Round Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="roundId" className="text-sm">Round Number</Label>
                  <Input
                    id="roundId"
                    type="number"
                    placeholder="e.g., Enter Round Number"
                    value={roundeID}
                    onChange={(e) => setRoundId(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={handleFetchRound}
                    disabled={isLoadingRound}
                    className="flex-1 text-sm p-1"
                    size="sm"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {isLoadingRound ? "Fetching Round Data..." : "Fetch Round Data"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {
              isLoadingRound ?
              <Card className="lottery-card">
                <CardHeader>
                  <div className="animate-pulse space-y-2">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </CardHeader>
              </Card> : roundError || !roundData ? 
              <Card className="lottery-card">
                <CardContent className="space-y-4 flex h-[100%] justify-center items-center">
                  <div className="font-semibold text-red-500">Error Loading Data</div>
                </CardContent>
              </Card> :
              <Card className="lottery-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                    Round Information
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Information for round {roundData?.roundId}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <strong>Round ID:</strong> {roundData.roundId.toString()}
                    </div>
                    <div>
                      <strong>Start Time:</strong> {formatTimestamp(roundData.startTime)}
                    </div>
                    <div>
                      <strong>End Time:</strong> {formatTimestamp(roundData.endTime)}
                    </div>
                    <div>
                      <strong>Numbers Drawn:</strong> {roundData.numbersDrawn ? 'Yes' : 'No'}
                    </div>
                    <div>
                      <strong>Total Bets:</strong> {roundData.totalBets.toString()} PTK
                    </div>
                    <div>
                      <strong>Total Prize Pool:</strong> {roundData.totalPrizePool.toString()} PTK
                    </div>
                    <div>
                      <strong>Gifts Distributed:</strong> {roundData.giftsDistributed ? 'Yes' : 'No'}
                    </div>
                  </div>

                {/* Winning Numbers */}
                  <div className="mt-4">
                    <strong>Winning Numbers:</strong>
                    <div className="flex gap-2 mt-2">
                      {roundData?.winningNumbers.map((num, index) => (
                        <span 
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                        >
                          {num.toString()}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            }

          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}