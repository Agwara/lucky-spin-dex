import { cn } from "@/lib/utils"

interface LotteryBallProps {
  number: number
  selected?: boolean
  winning?: boolean
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
}

export const LotteryBall = ({ 
  number, 
  selected = false, 
  winning = false,
  size = 'md', 
  onClick, 
  disabled = false 
}: LotteryBallProps) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-20 h-20 text-2xl'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "lottery-ball flex items-center justify-center font-bold text-foreground cursor-pointer select-none",
        sizeClasses[size],
        selected && "selected bg-gradient-primary text-primary-foreground",
        winning && "winning-number bg-gradient-jackpot text-white animate-float",
        disabled && "opacity-50 cursor-not-allowed",
        !selected && !winning && "bg-gradient-card hover:scale-105"
      )}
    >
      {number}
    </button>
  )
}