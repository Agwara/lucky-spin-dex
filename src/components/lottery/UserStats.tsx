import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Gift, TrendingUp } from "lucide-react"

interface UserStatsData {
  lastGiftRound: number
  consecutiveRounds: number
  totalBets: string
  totalWinnings: string
  isEligibleForGift: boolean
}

interface UserStatsProps {
  stats: UserStatsData | null
  loading?: boolean
}

export const UserStats = ({ stats, loading = false }: UserStatsProps) => {
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

  if (!stats) {
    return (
      <Card className="lottery-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Your Stats
          </CardTitle>
          <CardDescription>Connect your wallet to view your lottery statistics</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const totalBets = parseFloat(stats.totalBets) / 1e18
  const totalWinnings = parseFloat(stats.totalWinnings) / 1e18
  const winRate = totalBets > 0 ? ((totalWinnings / totalBets) * 100) : 0

  return (
    <Card className="lottery-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          Your Lottery Stats
        </CardTitle>
        <CardDescription>Your performance and achievements in the lottery</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">Total Bets</span>
            </div>
            <div className="text-2xl font-bold">{totalBets.toFixed(2)} PTK</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-lottery-win" />
              <span className="text-sm text-muted-foreground">Total Winnings</span>
            </div>
            <div className="text-2xl font-bold text-lottery-win">
              {totalWinnings.toFixed(2)} PTK
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Win Rate</span>
            </div>
            <div className="text-2xl font-bold">
              {winRate.toFixed(1)}%
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-secondary" />
              <span className="text-sm text-muted-foreground">Consecutive Rounds</span>
            </div>
            <div className="text-2xl font-bold text-secondary">
              {stats.consecutiveRounds}
            </div>
          </div>
        </div>

        {/* Gift Eligibility */}
        <div className="space-y-3">
          <h3 className="font-semibold">Gift Eligibility Status</h3>
          <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
            <Gift className="w-6 h-6 text-secondary" />
            <div className="flex-1">
              {stats.isEligibleForGift ? (
                <>
                  <Badge className="bg-lottery-win text-white mb-2">Eligible for Gifts!</Badge>
                  <p className="text-sm text-muted-foreground">
                    You've played {stats.consecutiveRounds} consecutive rounds and are eligible for gift distributions.
                  </p>
                </>
              ) : (
                <>
                  <Badge variant="outline" className="mb-2">Not Eligible</Badge>
                  <p className="text-sm text-muted-foreground">
                    Play 3 consecutive rounds to become eligible for gift distributions.
                    Current streak: {stats.consecutiveRounds} rounds.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="space-y-3">
          <h3 className="font-semibold">Achievements</h3>
          <div className="flex flex-wrap gap-2">
            {totalBets >= 100 && (
              <Badge className="bg-primary text-primary-foreground">
                High Roller (100+ PTK bet)
              </Badge>
            )}
            {totalWinnings > 0 && (
              <Badge className="bg-lottery-win text-white">
                Winner!
              </Badge>
            )}
            {stats.consecutiveRounds >= 5 && (
              <Badge className="bg-secondary text-secondary-foreground">
                Streak Master (5+ rounds)
              </Badge>
            )}
            {stats.consecutiveRounds >= 10 && (
              <Badge className="bg-lottery-jackpot text-white">
                Dedication (10+ rounds)
              </Badge>
            )}
            {winRate >= 150 && (
              <Badge className="bg-gradient-gold text-white">
                Profitable Player
              </Badge>
            )}
          </div>
        </div>

        {/* Fun Stats */}
        <div className="bg-muted/20 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-primary">Fun Facts:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Last gift received: Round #{stats.lastGiftRound || 'Never'}</li>
            <li>• Net result: {(totalWinnings - totalBets).toFixed(2)} PTK</li>
            <li>• Average bet: {totalBets > 0 ? (totalBets / Math.max(1, stats.consecutiveRounds)).toFixed(2) : '0'} PTK</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}