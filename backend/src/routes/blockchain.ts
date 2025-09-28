import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { BlockchainService } from '../services/blockchainService'

const walletSchema = z.object({
  userId: z.string().uuid().optional(),
  websiteId: z.string().uuid().optional(),
  address: z.string().min(1),
  network: z.enum(['ETHEREUM', 'POLYGON', 'BINANCE_SMART_CHAIN', 'ARBITRUM', 'OPTIMISM', 'AVALANCHE', 'SOLANA', 'POLKADOT']),
  walletType: z.enum(['EXTERNAL', 'GENERATED', 'IMPORTED']),
  name: z.string().optional(),
  description: z.string().optional(),
  encryptionKey: z.string().optional()
})

const nftCollectionSchema = z.object({
  userId: z.string().uuid().optional(),
  websiteId: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  symbol: z.string().optional(),
  contractAddress: z.string().min(1),
  network: z.enum(['ETHEREUM', 'POLYGON', 'BINANCE_SMART_CHAIN', 'ARBITRUM', 'OPTIMISM', 'AVALANCHE', 'SOLANA', 'POLKADOT']),
  standard: z.enum(['ERC721', 'ERC1155', 'ERC4907', 'SPL_TOKEN']),
  imageUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
  totalSupply: z.number().positive().optional(),
  royaltyPercentage: z.number().min(0).max(100).optional(),
  royaltyRecipient: z.string().optional()
})

const smartContractSchema = z.object({
  userId: z.string().uuid().optional(),
  websiteId: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  contractAddress: z.string().min(1),
  network: z.enum(['ETHEREUM', 'POLYGON', 'BINANCE_SMART_CHAIN', 'ARBITRUM', 'OPTIMISM', 'AVALANCHE', 'SOLANA', 'POLKADOT']),
  abi: z.any(),
  sourceCode: z.string().optional(),
  compilerVersion: z.string().optional(),
  optimizationEnabled: z.boolean().optional()
})

const web3IntegrationSchema = z.object({
  userId: z.string().uuid().optional(),
  websiteId: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['MARKETPLACE', 'PAYMENT_PROCESSOR', 'ANALYTICS', 'STORAGE', 'IDENTITY', 'DEFI']),
  config: z.any(),
  apiKeys: z.any().optional()
})

const mintNFTSchema = z.object({
  tokenId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url().optional()
})

const contractInteractionSchema = z.object({
  method: z.string().min(1),
  parameters: z.any().optional(),
  txHash: z.string().min(1),
  blockNumber: z.number().positive(),
  userAddress: z.string().optional()
})

const transactionSchema = z.object({
  txHash: z.string().min(1),
  blockNumber: z.number().positive(),
  fromAddress: z.string().min(1),
  toAddress: z.string().min(1),
  value: z.number().positive(),
  type: z.enum(['TRANSFER', 'CONTRACT_CALL', 'CONTRACT_DEPLOYMENT', 'NFT_MINT', 'NFT_TRANSFER', 'SWAP', 'STAKE', 'UNSTAKE']),
  status: z.enum(['PENDING', 'CONFIRMED', 'FAILED', 'CANCELLED']).optional()
})

export async function blockchainRoutes(fastify: FastifyInstance) {
  const blockchainService = new BlockchainService(fastify.prisma)

  // Wallet Management
  fastify.post('/wallets', {
    schema: {
      body: walletSchema,
      response: {
        201: z.object({
          id: z.string(),
          address: z.string(),
          network: z.string(),
          walletType: z.string(),
          status: z.string(),
          createdAt: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
      const wallet = await blockchainService.createWallet(request.body)
      reply.code(201).send(wallet)
    } catch (error) {
      reply.code(500).send({ error: 'Failed to create wallet' })
    }
  })

  fastify.get('/wallets', {
    schema: {
      querystring: z.object({
        userId: z.string().uuid().optional(),
        websiteId: z.string().uuid().optional()
      }),
      response: {
        200: z.array(z.object({
          id: z.string(),
          address: z.string(),
          network: z.string(),
          walletType: z.string(),
          status: z.string(),
          balance: z.number(),
          transactionCount: z.number(),
          createdAt: z.string()
        }))
      }
    }
  }, async (request, reply) => {
    try {
      const { userId, websiteId } = request.query as { userId?: string, websiteId?: string }
      const wallets = await blockchainService.getWallets(userId, websiteId)
      reply.send(wallets)
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch wallets' })
    }
  })

  fastify.put('/wallets/:walletId/balance', {
    schema: {
      params: z.object({
        walletId: z.string().uuid()
      }),
      body: z.object({
        balance: z.number().min(0)
      }),
      response: {
        200: z.object({
          id: z.string(),
          balance: z.number(),
          lastSyncAt: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
      const { walletId } = request.params as { walletId: string }
      const { balance } = request.body as { balance: number }
      const wallet = await blockchainService.updateWalletBalance(walletId, balance)
      reply.send(wallet)
    } catch (error) {
      reply.code(500).send({ error: 'Failed to update wallet balance' })
    }
  })

  // NFT Collection Management
  fastify.post('/nft-collections', {
    schema: {
      body: nftCollectionSchema,
      response: {
        201: z.object({
          id: z.string(),
          name: z.string(),
          contractAddress: z.string(),
          network: z.string(),
          standard: z.string(),
          status: z.string(),
          createdAt: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
      const collection = await blockchainService.createNFTCollection(request.body)
      reply.code(201).send(collection)
    } catch (error) {
      reply.code(500).send({ error: 'Failed to create NFT collection' })
    }
  })

  fastify.get('/nft-collections', {
    schema: {
      querystring: z.object({
        userId: z.string().uuid().optional(),
        websiteId: z.string().uuid().optional()
      }),
      response: {
        200: z.array(z.object({
          id: z.string(),
          name: z.string(),
          contractAddress: z.string(),
          network: z.string(),
          standard: z.string(),
          status: z.string(),
          totalSupply: z.number(),
          mintedCount: z.number(),
          floorPrice: z.number(),
          createdAt: z.string()
        }))
      }
    }
  }, async (request, reply) => {
    try {
      const { userId, websiteId } = request.query as { userId?: string, websiteId?: string }
      const collections = await blockchainService.getNFTCollections(userId, websiteId)
      reply.send(collections)
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch NFT collections' })
    }
  })

  fastify.post('/nft-collections/:collectionId/mint', {
    schema: {
      params: z.object({
        collectionId: z.string().uuid()
      }),
      body: mintNFTSchema,
      response: {
        201: z.object({
          id: z.string(),
          tokenId: z.string(),
          name: z.string(),
          description: z.string().optional(),
          imageUrl: z.string().optional(),
          createdAt: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
      const { collectionId } = request.params as { collectionId: string }
      const { tokenId, name, description, imageUrl } = request.body as {
        tokenId: string
        name: string
        description?: string
        imageUrl?: string
      }
      const nft = await blockchainService.mintNFT(collectionId, tokenId, name, description, imageUrl)
      reply.code(201).send(nft)
    } catch (error) {
      reply.code(500).send({ error: 'Failed to mint NFT' })
    }
  })

  // Smart Contract Management
  fastify.post('/smart-contracts', {
    schema: {
      body: smartContractSchema,
      response: {
        201: z.object({
          id: z.string(),
          name: z.string(),
          contractAddress: z.string(),
          network: z.string(),
          status: z.string(),
          createdAt: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
      const contract = await blockchainService.createSmartContract(request.body)
      reply.code(201).send(contract)
    } catch (error) {
      reply.code(500).send({ error: 'Failed to create smart contract' })
    }
  })

  fastify.get('/smart-contracts', {
    schema: {
      querystring: z.object({
        userId: z.string().uuid().optional(),
        websiteId: z.string().uuid().optional()
      }),
      response: {
        200: z.array(z.object({
          id: z.string(),
          name: z.string(),
          contractAddress: z.string(),
          network: z.string(),
          status: z.string(),
          interactionCount: z.number(),
          createdAt: z.string()
        }))
      }
    }
  }, async (request, reply) => {
    try {
      const { userId, websiteId } = request.query as { userId?: string, websiteId?: string }
      const contracts = await blockchainService.getSmartContracts(userId, websiteId)
      reply.send(contracts)
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch smart contracts' })
    }
  })

  fastify.post('/smart-contracts/:contractId/interact', {
    schema: {
      params: z.object({
        contractId: z.string().uuid()
      }),
      body: contractInteractionSchema,
      response: {
        201: z.object({
          id: z.string(),
          method: z.string(),
          txHash: z.string(),
          blockNumber: z.number(),
          success: z.boolean(),
          createdAt: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
      const { contractId } = request.params as { contractId: string }
      const { method, parameters, txHash, blockNumber, userAddress } = request.body as {
        method: string
        parameters?: any
        txHash: string
        blockNumber: number
        userAddress?: string
      }
      const interaction = await blockchainService.interactWithContract(
        contractId, method, parameters, txHash, blockNumber, userAddress
      )
      reply.code(201).send(interaction)
    } catch (error) {
      reply.code(500).send({ error: 'Failed to interact with contract' })
    }
  })

  // Web3 Integration Management
  fastify.post('/web3-integrations', {
    schema: {
      body: web3IntegrationSchema,
      response: {
        201: z.object({
          id: z.string(),
          name: z.string(),
          type: z.string(),
          status: z.string(),
          createdAt: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
      const integration = await blockchainService.createWeb3Integration(request.body)
      reply.code(201).send(integration)
    } catch (error) {
      reply.code(500).send({ error: 'Failed to create Web3 integration' })
    }
  })

  fastify.get('/web3-integrations', {
    schema: {
      querystring: z.object({
        userId: z.string().uuid().optional(),
        websiteId: z.string().uuid().optional()
      }),
      response: {
        200: z.array(z.object({
          id: z.string(),
          name: z.string(),
          type: z.string(),
          status: z.string(),
          isEnabled: z.boolean(),
          usageCount: z.number(),
          createdAt: z.string()
        }))
      }
    }
  }, async (request, reply) => {
    try {
      const { userId, websiteId } = request.query as { userId?: string, websiteId?: string }
      const integrations = await blockchainService.getWeb3Integrations(userId, websiteId)
      reply.send(integrations)
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch Web3 integrations' })
    }
  })

  // Transaction Management
  fastify.post('/transactions', {
    schema: {
      body: z.object({
        walletId: z.string().uuid(),
        ...transactionSchema.shape
      }),
      response: {
        201: z.object({
          id: z.string(),
          txHash: z.string(),
          blockNumber: z.number(),
          type: z.string(),
          status: z.string(),
          createdAt: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
      const { walletId, txHash, blockNumber, fromAddress, toAddress, value, type, status } = request.body as {
        walletId: string
        txHash: string
        blockNumber: number
        fromAddress: string
        toAddress: string
        value: number
        type: any
        status?: any
      }
      const transaction = await blockchainService.recordTransaction(
        walletId, txHash, blockNumber, fromAddress, toAddress, value, type, status
      )
      reply.code(201).send(transaction)
    } catch (error) {
      reply.code(500).send({ error: 'Failed to record transaction' })
    }
  })

  fastify.get('/wallets/:walletId/transactions', {
    schema: {
      params: z.object({
        walletId: z.string().uuid()
      }),
      querystring: z.object({
        limit: z.number().positive().optional()
      }),
      response: {
        200: z.array(z.object({
          id: z.string(),
          txHash: z.string(),
          blockNumber: z.number(),
          fromAddress: z.string(),
          toAddress: z.string(),
          value: z.number(),
          type: z.string(),
          status: z.string(),
          createdAt: z.string()
        }))
      }
    }
  }, async (request, reply) => {
    try {
      const { walletId } = request.params as { walletId: string }
      const { limit } = request.query as { limit?: number }
      const transactions = await blockchainService.getTransactions(walletId, limit)
      reply.send(transactions)
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch transactions' })
    }
  })

  // Analytics
  fastify.get('/wallets/:walletId/analytics', {
    schema: {
      params: z.object({
        walletId: z.string().uuid()
      }),
      response: {
        200: z.object({
          totalTransactions: z.number(),
          totalVolume: z.number(),
          averageGasPrice: z.number(),
          successRate: z.number(),
          topContracts: z.array(z.object({
            address: z.string(),
            interactions: z.number(),
            volume: z.number()
          }))
        })
      }
    }
  }, async (request, reply) => {
    try {
      const { walletId } = request.params as { walletId: string }
      const analytics = await blockchainService.getWalletAnalytics(walletId)
      reply.send(analytics)
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch wallet analytics' })
    }
  })
}
