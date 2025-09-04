import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, DollarSign, Trophy } from "lucide-react"
import { LotteryBall } from "./LotteryBall"
import { useState, useRef, useEffect } from "react"

interface Round {
  roundId: number
  startTime: number
  endTime: number
  winningNumbers: number[]
  numbersDrawn: boolean
  totalBets: string
  totalPrizePool: string
  participants: string[]
}

interface CurrentRoundProps {
  round: Round | null
  loading?: boolean
}

export const CurrentRound = ({ round, loading = false }: CurrentRoundProps) => {
  if (loading) {
    return (
      <Card className="lottery-card">
        <CardHeader>
          <div className="animate-pulse space-y-2">
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardHeader>
      </Card>
    )
  }

  if (!round) {
    return (
      <Card className="lottery-card">
        <CardHeader>
          <CardTitle className="text-destructive">No Active Round</CardTitle>
          <CardDescription>Waiting for the next lottery round to begin...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const [remaining, setRemaining] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const isActive = remaining > 0 && !round.numbersDrawn

  useEffect(() => {
    if (!round) return

    const updateTime = () => {
      const now = Date.now()
      const msLeft = round.endTime * 1000 - now
      setRemaining(Math.max(0, msLeft))
    }

    updateTime() // initial run

    // only update once per second
    timerRef.current = setInterval(updateTime, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [round?.endTime])

  
  // Format time remaining
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Main Round Info */}
      <Card className="lottery-card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">
                Round #{round.roundId}
                {round.numbersDrawn && (
                  <Badge className="ml-3 bg-lottery-win text-white">
                    Complete
                  </Badge>
                )}
                {isActive && (
                  <Badge className="ml-3 bg-primary text-primary-foreground animate-pulse">
                    Live
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                {isActive 
                  ? "Place your bets now - time is running out!"
                  : round.numbersDrawn 
                    ? "Winning numbers have been drawn!"
                    : "Waiting for results..."
                }
              </CardDescription>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {formatTime(remaining)}
              </div>
              <div className="text-sm text-muted-foreground">Time left</div>
            </div>
            
          </div>
        </CardHeader>

        <CardContent className="relative space-y-6">
          {/* Winning Numbers */}
          {round.numbersDrawn && (
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-center jackpot-glow">
                🎉 Winning Numbers 🎉
              </h3>
              <div className="flex justify-center gap-4">
                {round.winningNumbers.map((number, index) => (
                  <LotteryBall
                    key={`winning-${index}`}
                    number={number}
                    winning={true}
                    size="lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Round Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
              <Clock className="w-8 h-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Duration</div>
                <div className="font-semibold">5 minutes</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
              <Users className="w-8 h-8 text-accent" />
              <div>
                <div className="text-sm text-muted-foreground">Players</div>
                <div className="font-semibold">{round.participants.length}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
              <DollarSign className="w-8 h-8 text-secondary" />
              <div>
                <div className="text-sm text-muted-foreground">Total Bets</div>
                <div className="font-semibold">
                  {parseFloat(round.totalBets) / 1e18} PTK
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg col-span-2 md:col-span-3">
              <Trophy className="w-8 h-8 text-lottery-jackpot" />
              <div>
                <div className="text-sm text-muted-foreground">Prize Pool</div>
                <div className="font-semibold text-2xl text-lottery-jackpot">
                  {parseFloat(round.totalPrizePool) / 1e18} PTK
                </div>
              </div>
            </div>
          </div>

          {/* Prize Structure */}
          <div className="bg-muted/20 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Prize Structure:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>5 matches: <span className="text-lottery-jackpot font-bold">800x bet</span></div>
              <div>4 matches: <span className="text-secondary font-bold">80x bet</span></div>
              <div>3 matches: <span className="text-primary font-bold">8x bet</span></div>
              <div>2 matches: <span className="text-accent font-bold">2x bet</span></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              * All prizes subject to 5% house edge
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}