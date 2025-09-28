'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Wallet, 
  Coins, 
  TrendingUp, 
  Activity,
  Plus,
  Eye,
  Settings,
  BarChart3,
  Zap,
  Shield,
  Link,
  Database,
  Loader2
} from 'lucide-react'
import { api } from '@/lib/api'

interface BlockchainDashboardProps {
  websiteId: string
  userId?: string
}

interface WalletData {
  id: string
  address: string
  network: string
  walletType: string
  status: string
  balance: number
  transactionCount: number
  createdAt: string
}

interface NFTCollectionData {
  id: string
  name: string
  contractAddress: string
  network: string
  standard: string
  status: string
  totalSupply: number
  mintedCount: number
  floorPrice: number
  createdAt: string
}

interface SmartContractData {
  id: string
  name: string
  contractAddress: string
  network: string
  status: string
  interactionCount: number
  createdAt: string
}

export function BlockchainDashboard({ websiteId, userId }: BlockchainDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [wallets, setWallets] = useState<WalletData[]>([])
  const [collections, setCollections] = useState<NFTCollectionData[]>([])
  const [contracts, setContracts] = useState<SmartContractData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadBlockchainData()
  }, [websiteId])

  const loadBlockchainData = async () => {
    try {
      setIsLoading(true)
      const [walletsData, collectionsData, contractsData] = await Promise.all([
        api.blockchain.getWallets(userId, websiteId),
        api.blockchain.getNFTCollections(userId, websiteId),
        api.blockchain.getSmartContracts(userId, websiteId)
      ])
      
      setWallets(walletsData.data || [])
      setCollections(collectionsData.data || [])
      setContracts(contractsData.data || [])
    } catch (error) {
      console.error('Failed to load blockchain data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getNetworkColor = (network: string) => {
    const colors: { [key: string]: string } = {
      ETHEREUM: 'bg-blue-900',
      POLYGON: 'bg-purple-500',
      BINANCE_SMART_CHAIN: 'bg-yellow-500',
      ARBITRUM: 'bg-cyan-500',
      OPTIMISM: 'bg-red-500',
      AVALANCHE: 'bg-orange-500',
      SOLANA: 'bg-green-500',
      POLKADOT: 'bg-pink-500'
    }
    return colors[network] || 'bg-gray-500'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500'
      case 'DRAFT': return 'bg-yellow-500'
      case 'DEPLOYED': return 'bg-blue-900'
      case 'VERIFIED': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  // Mock analytics data
  const analytics = {
    totalWallets: wallets.length,
    totalCollections: collections.length,
    totalContracts: contracts.length,
    totalTransactions: wallets.reduce((sum, wallet) => sum + wallet.transactionCount, 0),
    totalVolume: 125.5, // Mock data
    activeNetworks: [...new Set([...wallets, ...collections, ...contracts].map(item => item.network))].length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-purple-600 bg-clip-text text-transparent">
            Blockchain Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage wallets, NFTs, smart contracts, and Web3 integrations
          </p>
        </div>
        <Badge variant="secondary" className="bg-gradient-to-r from-slate-900 to-purple-500 text-white">
          <Zap className="w-4 h-4 mr-1" />
          Web3 Enabled
        </Badge>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wallets</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalWallets}</div>
            <p className="text-xs text-muted-foreground">
              Across {analytics.activeNetworks} networks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NFT Collections</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCollections}</div>
            <p className="text-xs text-muted-foreground">
              {collections.reduce((sum, col) => sum + col.mintedCount, 0)} NFTs minted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Smart Contracts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalContracts}</div>
            <p className="text-xs text-muted-foreground">
              {contracts.reduce((sum, contract) => sum + contract.interactionCount, 0)} interactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              Across all wallets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalVolume} ETH</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Networks</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeNetworks}</div>
            <p className="text-xs text-muted-foreground">
              Multi-chain support
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="nfts">NFTs</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Wallets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="w-5 h-5 mr-2" />
                  Recent Wallets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wallets.slice(0, 5).map((wallet) => (
                    <div key={wallet.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full ${getNetworkColor(wallet.network)} flex items-center justify-center`}>
                          <Wallet className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</p>
                          <p className="text-xs text-gray-500">{wallet.network}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{wallet.balance} ETH</p>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getStatusColor(wallet.status)} text-white`}
                        >
                          {wallet.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Collections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coins className="w-5 h-5 mr-2" />
                  Recent NFT Collections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collections.slice(0, 5).map((collection) => (
                    <div key={collection.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full ${getNetworkColor(collection.network)} flex items-center justify-center`}>
                          <Coins className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{collection.name}</p>
                          <p className="text-xs text-gray-500">{collection.standard}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{collection.mintedCount}/{collection.totalSupply}</p>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getStatusColor(collection.status)} text-white`}
                        >
                          {collection.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Network Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Network Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Network distribution chart coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallets Tab */}
        <TabsContent value="wallets">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Blockchain Wallets</CardTitle>
              <Button className="bg-gradient-to-r from-slate-900 to-purple-500 hover:from-slate-950 hover:to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Wallet
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wallets.map((wallet) => (
                  <div key={wallet.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full ${getNetworkColor(wallet.network)} flex items-center justify-center`}>
                        <Wallet className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}</h3>
                        <p className="text-sm text-gray-500">{wallet.network} • {wallet.walletType}</p>
                        <p className="text-xs text-gray-400">{wallet.transactionCount} transactions</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">{wallet.balance} ETH</p>
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(wallet.status)} text-white`}
                        >
                          {wallet.status}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NFTs Tab */}
        <TabsContent value="nfts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>NFT Collections</CardTitle>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Collection
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collections.map((collection) => (
                  <div key={collection.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full ${getNetworkColor(collection.network)} flex items-center justify-center`}>
                        <Coins className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{collection.name}</h3>
                        <p className="text-sm text-gray-500">{collection.standard} • {collection.network}</p>
                        <p className="text-xs text-gray-400">{collection.contractAddress.slice(0, 8)}...{collection.contractAddress.slice(-6)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">{collection.mintedCount}/{collection.totalSupply}</p>
                        <p className="text-sm text-gray-500">Floor: {collection.floorPrice} ETH</p>
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(collection.status)} text-white`}
                        >
                          {collection.status}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contracts Tab */}
        <TabsContent value="contracts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Smart Contracts</CardTitle>
              <Button className="bg-gradient-to-r from-green-500 to-slate-900 hover:from-green-600 hover:to-slate-950">
                <Plus className="w-4 h-4 mr-2" />
                Deploy Contract
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contracts.map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full ${getNetworkColor(contract.network)} flex items-center justify-center`}>
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{contract.name}</h3>
                        <p className="text-sm text-gray-500">{contract.network}</p>
                        <p className="text-xs text-gray-400">{contract.contractAddress.slice(0, 8)}...{contract.contractAddress.slice(-6)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">{contract.interactionCount} interactions</p>
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(contract.status)} text-white`}
                        >
                          {contract.status}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
