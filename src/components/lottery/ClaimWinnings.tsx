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
  
  const { rawBetData, isLoadingBet, betError, getUserbets } = useLottery()

  const [betRound, setBetRound] = useState("")
  const [claimingBet, setClaimingBet] = useState(false)

  const checkField = (inputField:string) => {
    if (!inputField || isNaN(parseInt(inputField)) || parseInt(inputField) <= 0) {
      return true
    } else {
      return false
    }
  }

  const handleClaimWinnings = async () => {
    const roundBetTemp = parseInt(betRound);
    if (checkField(betRound)) {
      toast.error("Please enter a valid ID")
      return
    }
    console.log("betRound: ", betRound)
    getUserbets(roundBetTemp)
  }


  console.log("rawBetData: ", rawBetData)
  console.log("betError: ", betError)

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
        <Button
          className="w-full golden-button text-sm sm:text-base"
          variant="outline"
          onClick={handleClaimWinnings}
          disabled={isLoadingBet}
        >
          {isLoadingBet ? "Processing" : "Claim Winnings"}
        </Button>
        
      </CardContent>
    </Card>
  )
}
