import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet,  } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAccount, } from 'wagmi'
import { useEffect, useState } from "react"
import { toast } from "sonner";
import { useLottery } from "@/hooks/useLottery"

export const ClaimWinnings = () => {
  const { address, } = useAccount()
  
  const { 
    rawBetData, 
    rawClaimableData, 
    isLoadingBet, 
    isLoadingClaimable, 
    betError, 
    fetchingClaimable,
    getUserbets, 
    getclaimableBet, 
    claimWinnings 
  } = useLottery()

  const [betRound, setBetRound] = useState("")
  const [toggleClicked, setToggleClicked] = useState(false)

  const checkField = (inputField:string) => {
    if (!inputField || isNaN(parseInt(inputField)) || parseInt(inputField) <= 0) {
      return true
    } else {
      return false
    }
  }

  const handleClaimWinnings = async () => {
    setToggleClicked(!toggleClicked)
    const roundBetTemp = parseInt(betRound);
    if (checkField(betRound)) {
      toast.error("Please enter a valid ID")
      return
    }
    getUserbets(roundBetTemp)
  }

  const handleGetclaimableBet = async () => {
    const roundBetTemp = parseInt(betRound);
    if (checkField(betRound)) {
      toast.error("Please enter a valid ID")
      return
    }
    getclaimableBet(roundBetTemp) 
  }

  useEffect(() => {

    if (rawBetData.length > 0) {
      console.log("running effect")
      claimWinnings(parseInt(betRound), rawBetData) 
    }

  }, [isLoadingBet, toggleClicked])

  console.log("rawBetData: ", rawBetData)

  return (
    <Card className="lottery-card w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Wallet className="w-5 h-5 text-primary" />
          Claim Winnings
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Claim your winnings here
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="round-id">Bet Round ID</Label>
          <Input
            id="round-id"
            type="number"
            value={betRound}
            onChange={(e) => setBetRound(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Button
            className="w-full text-sm"
            disabled={isLoadingBet || isLoadingClaimable || fetchingClaimable}
            onClick={handleGetclaimableBet}
          >
            {isLoadingClaimable ? "Processing" : "Get Claimable Winnings"}
          </Button>
          <Button
            className="w-full text-sm"
            onClick={handleClaimWinnings}
            disabled={isLoadingBet || isLoadingClaimable || fetchingClaimable}
          >
            {isLoadingBet || fetchingClaimable ? "Processing" : "Claim Winnings"}
          </Button>
        </div>

        <div className="text-xs sm:text-sm text-muted-foreground space-y-1 pt-2 border-t">
          <p>Total Winnings for round {betRound}: {rawClaimableData[0]} PTK</p>
          <p>Bet Positions: {rawClaimableData[1].map((elem:any) => <span>{elem}</span>)}</p>
        </div>
        
      </CardContent>
    </Card>
  )
}
