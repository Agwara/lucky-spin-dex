import { useState } from "react"
import { LotteryBall } from "./LotteryBall"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shuffle, Trash2, Play } from "lucide-react"
import { toast } from "sonner"

interface NumberSelectorProps {
  onPlaceBet: (numbers: number[], amount: string) => void
  disabled?: boolean
  minBetAmount?: string
  maxBetAmount?: string
}

export const NumberSelector = ({ 
  onPlaceBet, 
  disabled = false, 
  minBetAmount = "1",
  maxBetAmount = "1000"
}: NumberSelectorProps) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [betAmount, setBetAmount] = useState(minBetAmount)

  const toggleNumber = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number))
    } else if (selectedNumbers.length < 5) {
      setSelectedNumbers([...selectedNumbers, number].sort((a, b) => a - b))
    } else {
      toast.error("You can only select 5 numbers!")
    }
  }

  const generateRandomNumbers = () => {
    const numbers: number[] = []
    while (numbers.length < 5) {
      const randomNum = Math.floor(Math.random() * 49) + 1
      if (!numbers.includes(randomNum)) {
        numbers.push(randomNum)
      }
    }
    setSelectedNumbers(numbers.sort((a, b) => a - b))
  }

  const clearSelection = () => {
    setSelectedNumbers([])
  }

  const handlePlaceBet = () => {
    if (selectedNumbers.length !== 5) {
      toast.error("Please select exactly 5 numbers!")
      return
    }
    
    const amount = parseFloat(betAmount)
    if (amount < parseFloat(minBetAmount)) {
      toast.error(`Minimum bet amount is ${minBetAmount} PTK`)
      return
    }
    
    if (amount > parseFloat(maxBetAmount)) {
      toast.error(`Maximum bet amount is ${maxBetAmount} PTK`)
      return
    }

    onPlaceBet(selectedNumbers, betAmount)
  }

  return (
    <Card className="lottery-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Play className="w-6 h-6 text-primary" />
          Select Your Lucky Numbers
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Choose 5 numbers from 1 to 49. The more numbers you match, the bigger your prize!
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Number Grid */}
        <div className="grid grid-cols-7 gap-3 p-4 bg-muted/20 rounded-lg">
          {Array.from({ length: 49 }, (_, i) => i + 1).map((number) => (
            <LotteryBall
              key={number}
              number={number}
              selected={selectedNumbers.includes(number)}
              onClick={() => toggleNumber(number)}
              disabled={disabled}
              size="sm"
            />
          ))}
        </div>

        {/* Selected Numbers Display */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold">Your Selection:</Label>
          <div className="flex items-center gap-3 min-h-[60px] p-4 bg-muted/20 rounded-lg">
            {selectedNumbers.length === 0 ? (
              <span className="text-muted-foreground italic">No numbers selected</span>
            ) : (
              selectedNumbers.map((number, index) => (
                <LotteryBall
                  key={`selected-${number}-${index}`}
                  number={number}
                  selected={true}
                  size="sm"
                />
              ))
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={generateRandomNumbers}
            disabled={disabled}
            className="flex-1"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Lucky Dip
          </Button>
          
          <Button
            variant="outline"
            onClick={clearSelection}
            disabled={disabled || selectedNumbers.length === 0}
            className="flex-1"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>

        {/* Bet Amount */}
        <div className="space-y-2">
          <Label htmlFor="bet-amount" className="text-lg font-semibold">
            Bet Amount (PTK):
          </Label>
          <Input
            id="bet-amount"
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            min={minBetAmount}
            max={maxBetAmount}
            step="0.01"
            disabled={disabled}
            className="text-lg"
          />
          <p className="text-sm text-muted-foreground">
            Min: {minBetAmount} PTK | Max: {maxBetAmount} PTK per round
          </p>
        </div>

        {/* Place Bet Button */}
        <Button
          onClick={handlePlaceBet}
          disabled={disabled || selectedNumbers.length !== 5}
          className="w-full golden-button text-lg py-6"
          size="lg"
        >
          <Play className="w-5 h-5 mr-2" />
          Place Bet ({betAmount} PTK)
        </Button>
      </CardContent>
    </Card>
  )
}