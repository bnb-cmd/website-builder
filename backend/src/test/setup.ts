import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { PrismaClient } from '@prisma/client'

// Mock Prisma client for testing
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || 'postgresql://postgres:password@localhost:5432/website_builder_test',
    },
  },
})

// Global test setup
beforeAll(async () => {
  // Connect to test database
  await prisma.$connect()
})

afterAll(async () => {
  // Clean up test database
  await prisma.$disconnect()
})

beforeEach(async () => {
  // Clean up test data before each test
  await prisma.user.deleteMany()
  await prisma.website.deleteMany()
  await prisma.template.deleteMany()
})

afterEach(async () => {
  // Clean up test data after each test
  await prisma.user.deleteMany()
  await prisma.website.deleteMany()
  await prisma.template.deleteMany()
})

// Mock environment variables
Object.defineProperty(process.env, 'NODE_ENV', {
  value: 'test',
  writable: true,
})

Object.defineProperty(process.env, 'JWT_SECRET', {
  value: 'test-jwt-secret',
  writable: true,
})

Object.defineProperty(process.env, 'DATABASE_URL', {
  value: 'postgresql://postgres:password@localhost:5432/website_builder_test',
  writable: true,
})

Object.defineProperty(process.env, 'REDIS_URL', {
  value: 'redis://localhost:6379',
  writable: true,
})

// Mock external services
vi.mock('@/services/aiService', () => ({
  AIService: vi.fn().mockImplementation(() => ({
    generateContent: vi.fn().mockResolvedValue({
      content: 'Generated content',
      tokens: 100,
      cost: 0.01,
      model: 'gpt-4',
      generationId: 'test-generation-id',
    }),
    optimizeSEO: vi.fn().mockResolvedValue({
      title: 'Optimized title',
      description: 'Optimized description',
      keywords: ['keyword1', 'keyword2'],
      suggestions: ['suggestion1', 'suggestion2'],
    }),
    generateColors: vi.fn().mockResolvedValue({
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#F59E0B',
      neutral: '#6B7280',
      palette: ['#3B82F6', '#1E40AF', '#F59E0B', '#6B7280'],
      suggestions: ['suggestion1', 'suggestion2'],
    }),
    suggestTemplates: vi.fn().mockResolvedValue({
      templates: [
        {
          id: 'template-1',
          name: 'Business Template',
          description: 'Professional business template',
          category: 'business',
          features: ['responsive', 'seo'],
          matchScore: 0.95,
        },
      ],
      recommendations: ['recommendation1', 'recommendation2'],
    }),
    getStats: vi.fn().mockResolvedValue({
      totalGenerations: 100,
      generationsByType: { content: 50, seo: 30, colors: 20 },
      totalTokens: 10000,
      totalCost: 10.0,
      averageCostPerGeneration: 0.1,
    }),
  })),
}))

vi.mock('@/services/integrationService', () => ({
  IntegrationService: vi.fn().mockImplementation(() => ({
    getIntegrations: vi.fn().mockResolvedValue([]),
    installIntegration: vi.fn().mockResolvedValue({ id: 'integration-1' }),
    uninstallIntegration: vi.fn().mockResolvedValue(true),
    testIntegration: vi.fn().mockResolvedValue({ status: 'connected' }),
  })),
}))

vi.mock('@/services/websiteService', () => ({
  WebsiteService: vi.fn().mockImplementation(() => ({
    createWebsite: vi.fn().mockResolvedValue({ id: 'website-1' }),
    getWebsite: vi.fn().mockResolvedValue({ id: 'website-1', title: 'Test Website' }),
    updateWebsite: vi.fn().mockResolvedValue({ id: 'website-1' }),
    deleteWebsite: vi.fn().mockResolvedValue(true),
    publishWebsite: vi.fn().mockResolvedValue({ url: 'https://test.com' }),
  })),
}))

// Export mocked prisma for use in tests
export { prisma }