import { Context, Next } from 'hono'
import { db } from '../lib/db'

export interface PackageFeatures {
  id: string
  name: 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE'
  ecommerce: {
    enabled: boolean
    maxProducts: number
    socialMediaImport: 'none' | 'manual' | 'oauth' | 'advanced'
    paymentMethods: string[]
    orderManagement: boolean
    platforms: string[]
  }
  ai: {
    enabled: boolean
    maxGenerations: number
  }
  storage: {
    maxPages: number
    maxTemplates: number
    maxMediaSize: number // in MB
  }
  features: {
    customDomain: boolean
    whiteLabel: boolean
    prioritySupport: boolean
    dedicatedManager: boolean
  }
}

export const PACKAGES: Record<string, PackageFeatures> = {
  FREE: {
    id: 'free',
    name: 'FREE',
    ecommerce: {
      enabled: false,
      maxProducts: 0,
      socialMediaImport: 'none',
      paymentMethods: [],
      orderManagement: false,
      platforms: []
    },
    ai: {
      enabled: false,
      maxGenerations: 0
    },
    storage: {
      maxPages: 3,
      maxTemplates: 0,
      maxMediaSize: 10
    },
    features: {
      customDomain: false,
      whiteLabel: false,
      prioritySupport: false,
      dedicatedManager: false
    }
  },
  STARTER: {
    id: 'starter',
    name: 'STARTER',
    ecommerce: {
      enabled: true,
      maxProducts: 50,
      socialMediaImport: 'manual', // Link-based import only
      paymentMethods: ['easypaisa', 'jazzcash', 'cod'],
      orderManagement: true,
      platforms: ['instagram', 'tiktok', 'facebook', 'any-url']
    },
    ai: {
      enabled: false,
      maxGenerations: 0
    },
    storage: {
      maxPages: 10,
      maxTemplates: 5,
      maxMediaSize: 100
    },
    features: {
      customDomain: false,
      whiteLabel: false,
      prioritySupport: false,
      dedicatedManager: false
    }
  },
  PRO: {
    id: 'pro',
    name: 'PRO',
    ecommerce: {
      enabled: true,
      maxProducts: 500,
      socialMediaImport: 'oauth', // Full OAuth integration
      paymentMethods: ['easypaisa', 'jazzcash', 'cod', 'stripe'],
      orderManagement: true,
      platforms: ['instagram', 'tiktok', 'facebook']
    },
    ai: {
      enabled: true,
      maxGenerations: 100
    },
    storage: {
      maxPages: 50,
      maxTemplates: 20,
      maxMediaSize: 500
    },
    features: {
      customDomain: true,
      whiteLabel: false,
      prioritySupport: true,
      dedicatedManager: false
    }
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'ENTERPRISE',
    ecommerce: {
      enabled: true,
      maxProducts: -1, // Unlimited
      socialMediaImport: 'advanced', // OAuth + WhatsApp Business
      paymentMethods: ['easypaisa', 'jazzcash', 'cod', 'stripe', 'custom'],
      orderManagement: true,
      platforms: ['instagram', 'tiktok', 'facebook', 'pinterest', 'whatsapp_business']
    },
    ai: {
      enabled: true,
      maxGenerations: -1 // Unlimited
    },
    storage: {
      maxPages: -1, // Unlimited
      maxTemplates: -1, // Unlimited
      maxMediaSize: -1 // Unlimited
    },
    features: {
      customDomain: true,
      whiteLabel: true,
      prioritySupport: true,
      dedicatedManager: true
    }
  }
}

export async function getUserPackage(userId: string, c: Context): Promise<PackageFeatures> {
  try {
    // Get user's subscription from database
    const user = await db.queryOne(c, 'SELECT subscription_tier FROM users WHERE id = ?', [userId])
    
    if (!user) {
      return PACKAGES.FREE
    }

    const tier = user.subscription_tier || 'FREE'
    return PACKAGES[tier] || PACKAGES.FREE
  } catch (error) {
    console.error('Error getting user package:', error)
    return PACKAGES.FREE
  }
}

export async function requireEcommerceFeature(feature: 'orders' | 'social_oauth' | 'whatsapp') {
  return async (c: Context, next: Next) => {
    const userId = c.get('user')?.userId
    
    if (!userId) {
      return c.json({ 
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    const userPackage = await getUserPackage(userId, c)
    
    // Check if user's package includes this feature
    if (feature === 'orders' && !userPackage.ecommerce.enabled) {
      return c.json({ 
        success: false,
        error: {
          message: 'Upgrade to STARTER for e-commerce features',
          code: 'PACKAGE_UPGRADE_REQUIRED',
          requiredPackage: 'STARTER'
        }
      }, 403)
    }
    
    if (feature === 'social_oauth' && userPackage.ecommerce.socialMediaImport !== 'oauth' && userPackage.ecommerce.socialMediaImport !== 'advanced') {
      return c.json({ 
        success: false,
        error: {
          message: 'Upgrade to PRO for OAuth integration',
          code: 'PACKAGE_UPGRADE_REQUIRED',
          requiredPackage: 'PRO'
        }
      }, 403)
    }
    
    if (feature === 'whatsapp' && userPackage.ecommerce.socialMediaImport !== 'advanced') {
      return c.json({ 
        success: false,
        error: {
          message: 'Upgrade to ENTERPRISE for WhatsApp Business',
          code: 'PACKAGE_UPGRADE_REQUIRED',
          requiredPackage: 'ENTERPRISE'
        }
      }, 403)
    }

    // Store package info in context for use in route handlers
    c.set('userPackage', userPackage)
    
    await next()
  }
}

export async function requirePackage(requiredTier: 'STARTER' | 'PRO' | 'ENTERPRISE') {
  return async (c: Context, next: Next) => {
    const userId = c.get('user')?.userId
    
    if (!userId) {
      return c.json({ 
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    const userPackage = await getUserPackage(userId, c)
    
    // Check if user has required tier or higher
    const tierOrder = ['FREE', 'STARTER', 'PRO', 'ENTERPRISE']
    const userTierIndex = tierOrder.indexOf(userPackage.name)
    const requiredTierIndex = tierOrder.indexOf(requiredTier)
    
    if (userTierIndex < requiredTierIndex) {
      return c.json({ 
        success: false,
        error: {
          message: `Upgrade to ${requiredTier} to access this feature`,
          code: 'PACKAGE_UPGRADE_REQUIRED',
          requiredPackage: requiredTier,
          currentPackage: userPackage.name
        }
      }, 403)
    }

    c.set('userPackage', userPackage)
    
    await next()
  }
}

export async function checkProductLimit(websiteId: string) {
  return async (c: Context, next: Next) => {
    const userId = c.get('user')?.userId
    
    if (!userId) {
      return c.json({ 
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    const userPackage = await getUserPackage(userId, c)
    
    // Check if user has unlimited products
    if (userPackage.ecommerce.maxProducts === -1) {
      await next()
      return
    }

    // Get current product count for this website
    const result = await db.queryOne(c, 'SELECT COUNT(*) as count FROM products WHERE website_id = ?', [websiteId])
    const currentCount = result?.count || 0

    if (currentCount >= userPackage.ecommerce.maxProducts) {
      return c.json({ 
        success: false,
        error: {
          message: `You've reached the product limit for your ${userPackage.name} package`,
          code: 'PRODUCT_LIMIT_EXCEEDED',
          currentPackage: userPackage.name,
          maxProducts: userPackage.maxProducts,
          currentCount
        }
      }, 403)
    }

    c.set('userPackage', userPackage)
    
    await next()
  }
}

export async function checkPageLimit(websiteId: string) {
  return async (c: Context, next: Next) => {
    const userId = c.get('user')?.userId
    
    if (!userId) {
      return c.json({ 
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    const userPackage = await getUserPackage(userId, c)
    
    // Check if user has unlimited pages
    if (userPackage.storage.maxPages === -1) {
      await next()
      return
    }

    // Get current page count for this website
    const result = await db.queryOne(c, 'SELECT COUNT(*) as count FROM pages WHERE website_id = ?', [websiteId])
    const currentCount = result?.count || 0

    if (currentCount >= userPackage.storage.maxPages) {
      return c.json({ 
        success: false,
        error: {
          message: `You've reached the page limit for your ${userPackage.name} package`,
          code: 'PAGE_LIMIT_EXCEEDED',
          currentPackage: userPackage.name,
          maxPages: userPackage.storage.maxPages,
          currentCount
        }
      }, 403)
    }

    c.set('userPackage', userPackage)
    
    await next()
  }
}

export async function checkAIFeature() {
  return async (c: Context, next: Next) => {
    const userId = c.get('user')?.userId
    
    if (!userId) {
      return c.json({ 
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    const userPackage = await getUserPackage(userId, c)
    
    if (!userPackage.ai.enabled) {
      return c.json({ 
        success: false,
        error: {
          message: 'Upgrade to PRO for AI features',
          code: 'PACKAGE_UPGRADE_REQUIRED',
          requiredPackage: 'PRO'
        }
      }, 403)
    }

    c.set('userPackage', userPackage)
    
    await next()
  }
}

export async function checkCustomDomain() {
  return async (c: Context, next: Next) => {
    const userId = c.get('user')?.userId
    
    if (!userId) {
      return c.json({ 
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    const userPackage = await getUserPackage(userId, c)
    
    if (!userPackage.features.customDomain) {
      return c.json({ 
        success: false,
        error: {
          message: 'Upgrade to PRO for custom domain',
          code: 'PACKAGE_UPGRADE_REQUIRED',
          requiredPackage: 'PRO'
        }
      }, 403)
    }

    c.set('userPackage', userPackage)
    
    await next()
  }
}

export async function checkWhiteLabel() {
  return async (c: Context, next: Next) => {
    const userId = c.get('user')?.userId
    
    if (!userId) {
      return c.json({ 
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    const userPackage = await getUserPackage(userId, c)
    
    if (!userPackage.features.whiteLabel) {
      return c.json({ 
        success: false,
        error: {
          message: 'Upgrade to ENTERPRISE for white-label features',
          code: 'PACKAGE_UPGRADE_REQUIRED',
          requiredPackage: 'ENTERPRISE'
        }
      }, 403)
    }

    c.set('userPackage', userPackage)
    
    await next()
  }
}

// Helper function to get upgrade suggestions
export function getUpgradeSuggestion(currentPackage: PackageFeatures, feature: string): string {
  switch (feature) {
    case 'ecommerce':
      if (!currentPackage.ecommerce.enabled) {
        return 'Upgrade to STARTER to add e-commerce to your site'
      }
      break
    case 'social_oauth':
      if (currentPackage.ecommerce.socialMediaImport === 'manual') {
        return 'Upgrade to PRO for automatic Instagram/TikTok sync'
      }
      break
    case 'whatsapp':
      if (currentPackage.ecommerce.socialMediaImport !== 'advanced') {
        return 'Upgrade to ENTERPRISE for WhatsApp Business integration'
      }
      break
    case 'ai':
      if (!currentPackage.ai.enabled) {
        return 'Upgrade to PRO for AI-powered content generation'
      }
      break
    case 'custom_domain':
      if (!currentPackage.features.customDomain) {
        return 'Upgrade to PRO for custom domain'
      }
      break
    case 'white_label':
      if (!currentPackage.features.whiteLabel) {
        return 'Upgrade to ENTERPRISE for white-label features'
      }
      break
  }
  
  return ''
}

// Helper function to check if user can access a specific platform
export function canAccessPlatform(userPackage: PackageFeatures, platform: string): boolean {
  return userPackage.ecommerce.platforms.includes(platform) || userPackage.ecommerce.platforms.includes('any-url')
}

// Helper function to check if user can use a specific payment method
export function canUsePaymentMethod(userPackage: PackageFeatures, method: string): boolean {
  return userPackage.ecommerce.paymentMethods.includes(method)
}
