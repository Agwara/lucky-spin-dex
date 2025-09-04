import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, LogOut, Copy, ExternalLink } from "lucide-react"
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { toast } from "sonner"
import { useSendTransaction } from 'wagmi' 

export const WalletConnect = () => {
  const { address, isConnected, connector } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success("Address copied to clipboard!")
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <Card className="lottery-card w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Wallet className="w-5 h-5 text-primary" />
            Wallet Connected
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge className="bg-lottery-win text-white mb-2">Connected</Badge>
              <p className="font-mono text-sm break-all">{formatAddress(address)}</p>
              <p className="text-xs text-muted-foreground">via {connector?.name}</p>
            </div>
          </div>

          {/* Responsive button group */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyAddress}
              className="flex-1 p-1"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}
              className="flex-1 p-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Etherscan
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => disconnect()}
              className="flex-1 p-1"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="lottery-card w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Wallet className="w-5 h-5 text-primary" />
          Connect Wallet
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Connect your wallet to participate in the lottery
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {connectors.map((connector: any) => (
          <Button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
            className="w-full golden-button text-sm sm:text-base"
            variant="outline"
          >
            Connect with {connector.name}
            {isPending && connector.name && ' (connecting...)'}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
