import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sparkles, Gift, Coins, Gamepad2, LinkIcon } from "lucide-react";
import { useLottery } from "@/hooks/useLottery";
import { toast } from "sonner";

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);

  const { isEligibleForBonus, claimBonusAndStake } = useLottery();

  const [isClaimingBonus, setIsClaimingBonus] = useState(false);

  const handleClaimBonus = async () => {
    if (!isEligibleForBonus) {
      toast.error("You have used your welcome bonus or are not eligible.");
      setOpen(false);
      return;
    }

    setIsClaimingBonus(true);
    try {
      await claimBonusAndStake();
    } catch (error: any) {
      toast.error(
        `Failed to claim and stake bonus: ${error?.message || error.toString()}`
      );
    } finally {
      localStorage.setItem("hasSeenWelcome", "true");
      setIsClaimingBonus(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenIntro) {
      const timer = setTimeout(() => setOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          w-[90%] sm:w-[85%] md:w-full max-w-lg 
          bg-gradient-to-br from-purple-900/95 to-black/90 
          border border-purple-700/50 
          rounded-2xl text-white shadow-2xl 
          backdrop-blur-lg 
          transition-all duration-300 
          p-5 sm:p-6 md:p-8
        "
      >
        <DialogHeader>
          <DialogTitle
            className="
              text-xl sm:text-2xl md:text-3xl font-bold 
               flex items-center justify-center gap-2
              leading-tight
            "
          >
            <span className="break-words text-center">Welcome</span>
          </DialogTitle>
          <DialogDescription
            className="
              text-center text-gray-300 
              text-sm sm:text-base mt-2
            "
          >
            The decentralized lottery platform where{" "}
            <span className="text-yellow-400 font-medium">
              luck meets technology
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 sm:mt-3 space-y-3 sm:space-y-4 text-gray-300">
          <Feature
            icon={
              <Gamepad2 className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />
            }
            title="Provably Fair Lottery"
            desc="Play with true randomness powered by Chainlink VRF."
          />
          <Feature
            icon={<Gift className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />}
            title="Bonus Gifts"
            desc="Play consecutive rounds to unlock random bonuses."
          />
        </div>

        <div className="mt-2 border-t border-purple-800/50 pt-4 space-y-2 text-gray-300 text-xs sm:text-sm">
          <p>
            ⚙️ <span className="text-yellow-400 font-semibold">Note:</span> You
            need to be connected to the{" "}
            <span className="text-yellow-400 font-medium">Sepolia Testnet</span>{" "}
            and also need platform tokens to play.
          </p>
          <p>
            🌐 Get Sepolia ETH from{" "}
            <a
              href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-yellow-400 hover:underline"
            >
              Google Cloud Faucet <LinkIcon size={14} />
            </a>
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleClaimBonus}
            disabled={isClaimingBonus}
            className="
              bg-yellow-500 hover:bg-yellow-400 
              text-black font-semibold 
              px-5 py-2 sm:px-6 sm:py-3 
              rounded-full transition-all duration-200 
              hover:scale-105 text-sm sm:text-base
            "
          >
            Get Free Tokens
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-purple-800/50 rounded-xl shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="font-medium text-white text-sm sm:text-base">{title}</p>
        <p className="text-gray-400 text-xs sm:text-sm leading-snug">{desc}</p>
      </div>
    </div>
  );
}
