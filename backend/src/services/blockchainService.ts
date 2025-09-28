import { 
  BlockchainWallet, 
  NFTCollection, 
  NFT, 
  SmartContract, 
  SmartContractInteraction, 
  Web3Integration, 
  BlockchainTransaction,
  BlockchainNetwork,
  WalletType,
  WalletStatus,
  NFTStandard,
  CollectionStatus,
  ContractStatus,
  Web3IntegrationType,
  TransactionType,
  TransactionStatus
} from '@prisma/client'
import { BaseService } from './baseService'

export interface WalletData {
  userId?: string
  websiteId?: string
  address: string
  network: BlockchainNetwork
  walletType: WalletType
  name?: string
  description?: string
  encryptionKey?: string
}

export interface NFTCollectionData {
  userId?: string
  websiteId?: string
  name: string
  description?: string
  symbol?: string
  contractAddress: string
  network: BlockchainNetwork
  standard: NFTStandard
  imageUrl?: string
  bannerUrl?: string
  websiteUrl?: string
  totalSupply?: number
  royaltyPercentage?: number
  royaltyRecipient?: string
}

export interface SmartContractData {
  userId?: string
  websiteId?: string
  name: string
  description?: string
  contractAddress: string
  network: BlockchainNetwork
  abi: any
  sourceCode?: string
  compilerVersion?: string
  optimizationEnabled?: boolean
}

export interface Web3IntegrationData {
  userId?: string
  websiteId?: string
  name: string
  description?: string
  type: Web3IntegrationType
  config: any
  apiKeys?: any
}

export class BlockchainService extends BaseService<BlockchainWallet> {
  
  protected getModelName(): string {
    return 'blockchainWallet'
  }

  // Wallet Management
  async createWallet(data: WalletData): Promise<BlockchainWallet> {
    try {
      this.validateId(data.address)
      
      return await this.prisma.blockchainWallet.create({
        data: {
          ...data,
          status: WalletStatus.ACTIVE,
          balance: 0,
          transactionCount: 0
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async getWallets(userId?: string, websiteId?: string): Promise<BlockchainWallet[]> {
    try {
      const where: any = {}
      if (userId) where.userId = userId
      if (websiteId) where.websiteId = websiteId
      
      return await this.prisma.blockchainWallet.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async updateWalletBalance(walletId: string, balance: number): Promise<BlockchainWallet> {
    try {
      this.validateId(walletId)
      
      return await this.prisma.blockchainWallet.update({
        where: { id: walletId },
        data: { 
          balance,
          lastSyncAt: new Date()
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  // NFT Collection Management
  async createNFTCollection(data: NFTCollectionData): Promise<NFTCollection> {
    try {
      this.validateId(data.contractAddress)
      
      return await this.prisma.nFTCollection.create({
        data: {
          ...data,
          status: CollectionStatus.DRAFT,
          totalSupply: data.totalSupply || 0,
          mintedCount: 0,
          floorPrice: 0,
          volumeTraded: 0,
          royaltyPercentage: data.royaltyPercentage || 0,
          isVerified: false
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async getNFTCollections(userId?: string, websiteId?: string): Promise<NFTCollection[]> {
    try {
      const where: any = {}
      if (userId) where.userId = userId
      if (websiteId) where.websiteId = websiteId
      
      return await this.prisma.nFTCollection.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          nfts: {
            take: 5,
            orderBy: { createdAt: 'desc' }
          }
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async mintNFT(collectionId: string, tokenId: string, name: string, description?: string, imageUrl?: string): Promise<NFT> {
    try {
      this.validateId(collectionId)
      
      // Create NFT
      const nft = await this.prisma.nFT.create({
        data: {
          collectionId,
          tokenId,
          name,
          description,
          imageUrl,
          mintPrice: 0,
          lastSalePrice: 0
        }
      })

      // Update collection minted count
      await this.prisma.nFTCollection.update({
        where: { id: collectionId },
        data: {
          mintedCount: {
            increment: 1
          }
        }
      })

      return nft
    } catch (error) {
      this.handleError(error)
    }
  }

  // Smart Contract Management
  async createSmartContract(data: SmartContractData): Promise<SmartContract> {
    try {
      this.validateId(data.contractAddress)
      
      return await this.prisma.smartContract.create({
        data: {
          ...data,
          status: ContractStatus.DRAFT,
          isVerified: false,
          interactionCount: 0
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async getSmartContracts(userId?: string, websiteId?: string): Promise<SmartContract[]> {
    try {
      const where: any = {}
      if (userId) where.userId = userId
      if (websiteId) where.websiteId = websiteId
      
      return await this.prisma.smartContract.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          interactions: {
            take: 5,
            orderBy: { createdAt: 'desc' }
          }
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async interactWithContract(
    contractId: string, 
    method: string, 
    parameters: any, 
    txHash: string, 
    blockNumber: number,
    userAddress?: string
  ): Promise<SmartContractInteraction> {
    try {
      this.validateId(contractId)
      
      const interaction = await this.prisma.smartContractInteraction.create({
        data: {
          contractId,
          method,
          parameters,
          txHash,
          blockNumber,
          userAddress,
          success: true // Assume success for now
        }
      })

      // Update contract interaction count
      await this.prisma.smartContract.update({
        where: { id: contractId },
        data: {
          interactionCount: {
            increment: 1
          },
          lastInteractionAt: new Date()
        }
      })

      return interaction
    } catch (error) {
      this.handleError(error)
    }
  }

  // Web3 Integration Management
  async createWeb3Integration(data: Web3IntegrationData): Promise<Web3Integration> {
    try {
      return await this.prisma.web3Integration.create({
        data: {
          ...data,
          status: 'ACTIVE' as any,
          isEnabled: true,
          usageCount: 0,
          errorCount: 0
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async getWeb3Integrations(userId?: string, websiteId?: string): Promise<Web3Integration[]> {
    try {
      const where: any = {}
      if (userId) where.userId = userId
      if (websiteId) where.websiteId = websiteId
      
      return await this.prisma.web3Integration.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  // Transaction Management
  async recordTransaction(
    walletId: string,
    txHash: string,
    blockNumber: number,
    fromAddress: string,
    toAddress: string,
    value: number,
    type: TransactionType,
    status: TransactionStatus = TransactionStatus.PENDING
  ): Promise<BlockchainTransaction> {
    try {
      this.validateId(walletId)
      
      const transaction = await this.prisma.blockchainTransaction.create({
        data: {
          walletId,
          txHash,
          blockNumber,
          fromAddress,
          toAddress,
          value,
          type,
          status,
          confirmations: 0
        }
      })

      // Update wallet transaction count
      await this.prisma.blockchainWallet.update({
        where: { id: walletId },
        data: {
          transactionCount: {
            increment: 1
          }
        }
      })

      return transaction
    } catch (error) {
      this.handleError(error)
    }
  }

  async getTransactions(walletId: string, limit: number = 50): Promise<BlockchainTransaction[]> {
    try {
      this.validateId(walletId)
      
      return await this.prisma.blockchainTransaction.findMany({
        where: { walletId },
        orderBy: { createdAt: 'desc' },
        take: limit
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  // Blockchain Analytics
  async getWalletAnalytics(walletId: string): Promise<{
    totalTransactions: number
    totalVolume: number
    averageGasPrice: number
    successRate: number
    topContracts: any[]
  }> {
    try {
      this.validateId(walletId)
      
      const transactions = await this.prisma.blockchainTransaction.findMany({
        where: { walletId }
      })

      const totalTransactions = transactions.length
      const totalVolume = transactions.reduce((sum, tx) => sum + tx.value.toNumber(), 0)
      const averageGasPrice = transactions.reduce((sum, tx) => sum + (tx.gasPrice?.toNumber() || 0), 0) / totalTransactions
      const successRate = transactions.filter(tx => tx.status === TransactionStatus.CONFIRMED).length / totalTransactions

      // Mock top contracts data
      const topContracts = [
        { address: '0x1234...', interactions: 15, volume: 1.5 },
        { address: '0x5678...', interactions: 8, volume: 0.8 },
        { address: '0x9abc...', interactions: 5, volume: 0.3 }
      ]

      return {
        totalTransactions,
        totalVolume,
        averageGasPrice,
        successRate,
        topContracts
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  // Required abstract methods from BaseService
  async create(data: any): Promise<BlockchainWallet> {
    return this.prisma.blockchainWallet.create({ data })
  }
  
  async findById(id: string): Promise<BlockchainWallet | null> {
    return this.prisma.blockchainWallet.findUnique({ where: { id } })
  }
  
  async findAll(filters?: any): Promise<BlockchainWallet[]> {
    return this.prisma.blockchainWallet.findMany({ where: filters })
  }
  
  async update(id: string, data: Partial<BlockchainWallet>): Promise<BlockchainWallet> {
    return this.prisma.blockchainWallet.update({ where: { id }, data })
  }
  
  async delete(id: string): Promise<boolean> {
    await this.prisma.blockchainWallet.delete({ where: { id } })
    return true
  }
}
