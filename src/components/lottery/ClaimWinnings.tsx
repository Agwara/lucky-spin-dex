import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Wallet,  } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAccount, } from 'wagmi'
import { toast } from "sonner";
import { useLottery } from "@/hooks/useLottery"
import { useState } from "react"
import { formatEther } from "viem";

export const ClaimWinnings = () => {
  
  const {  
    rawClaimableData,  
    isLoadingClaimable, 
    betError, 
    fetchingClaimable,
    gettingBetDetails,
    currentBetId,
    setCurrentBetId, 
    getclaimableBet, 
    getBetDetails,
    claimWinnings 
  } = useLottery()

  const [userBets, setUserBets] = useState<any[]>([])
  const [showBetModal, setShowBetModal] = useState(false);

  const checkField = (inputField:number) => {
    if (!inputField || isNaN(inputField) || inputField <= 0) {
      return true
    } else {
      return false
    }
  }

  const handleGetclaimableBet = async () => {
    const roundBetTemp = currentBetId;
    if (checkField(currentBetId)) {
      toast.error("Please enter a valid ID")
      return
    }
    getclaimableBet(roundBetTemp) 
  }


  const handleClaimWinnings = () => {
    if (checkField(currentBetId)) {
      toast.error("Please enter a valid ID")
      return
    }
    claimWinnings(currentBetId)
  }

  const handleGetDetails = async () => {
    const roundBetTemp = currentBetId;
    if (checkField(currentBetId)) {
      toast.error("Please enter a valid ID")
      return
    }
    const data = await getBetDetails(roundBetTemp)
    setUserBets(data)
    setShowBetModal(true)
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <>
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
              value={currentBetId}
              onChange={(e) => setCurrentBetId(parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Button
              className="w-full text-sm"
              disabled={ isLoadingClaimable}
              onClick={handleGetclaimableBet}
            >
              {isLoadingClaimable ? "Processing" : "Get Claimable Winnings"}
            </Button>
            <Button
              className="w-full text-sm"
              onClick={handleClaimWinnings}
              disabled={fetchingClaimable}
            >
              { fetchingClaimable ? "Processing" : "Claim Winnings"}
            </Button>
            <Button
              className="w-full text-sm"
              onClick={handleGetDetails}
              disabled={gettingBetDetails}
            >
              Check Bets
            </Button>
          </div>

          <div className="text-xs sm:text-sm text-muted-foreground space-y-1 pt-2 border-t">
            <p>Total Winnings for round {currentBetId}: {rawClaimableData[0]} PTK</p>
            <p>Bet Positions: {rawClaimableData[1].map((elem:any) => <span>{elem}</span>)}</p>
          </div>
          
        </CardContent>
      </Card>
      {/* Modal for showing bets */}
      <Dialog open={showBetModal} onOpenChange={setShowBetModal}>
        <DialogContent className="w-[95%] max-w-lg sm:w-full sm:rounded-lg p-4">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Bets for Round {currentBetId}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {userBets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No bets found.</p>
            ) : (
              userBets.map((bet, idx) => (
                <div
                  key={idx}
                  className="border rounded-md p-3 text-sm space-y-1 bg-muted/40"
                >
                  <p>
                    <span className="font-medium">Amount:</span>{" "}
                    {formatEther(bet.amount)}PTK
                  </p>
                  <p>
                    <span className="font-medium">Numbers:</span>{" "}
                    {bet.numbers.join(", ")}
                  </p>
                  <p>
                    <span className="font-medium">Match Count:</span>{" "}
                    {bet.matchCount}
                  </p>
                  <p>
                    <span className="font-medium">Claimed:</span>{" "}
                    {bet.claimed ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-medium">User:</span>{" "}
                    {formatAddress(bet.user)}
                  </p>
                  <p>
                    <span className="font-medium">Timestamp:</span>{" "}
                    {new Date(Number(bet.timestamp) * 1000).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end pt-3">
            <Button
              className="w-full sm:w-auto"
              onClick={() => setShowBetModal(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
