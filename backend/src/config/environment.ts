import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

export interface DatabaseConfig {
  url: string
  provider: 'postgresql' | 'mysql' | 'sqlite'
  ssl: boolean
  pool: {
    min: number
    max: number
  }
}

export interface RedisConfig {
  url: string
  password?: string
  db?: number
}

export interface AIConfig {
  openai: {
    apiKey: string
    model: string
  }
  anthropic: {
    apiKey: string
    model: string
  }
  google: {
    apiKey: string
    model: string
  }
}

export interface StorageConfig {
  provider: 'cloudinary' | 's3' | 'local'
  cloudinary?: {
    cloudName: string
    apiKey: string
    apiSecret: string
  }
  s3?: {
    bucket: string
    region: string
    accessKey: string
    secretKey: string
  }
  local?: {
    uploadPath: string
  }
}

export interface PaymentConfig {
  stripe: {
    secretKey: string
    publishableKey: string
    webhookSecret: string
  }
  jazzcash: {
    merchantId: string
    password: string
    returnUrl: string
    cancelUrl: string
  }
  easypaisa: {
    merchantId: string
    password: string
    returnUrl: string
    cancelUrl: string
  }
}

export interface EmailConfig {
  provider: 'resend' | 'sendgrid' | 'nodemailer'
  resend?: {
    apiKey: string
  }
  sendgrid?: {
    apiKey: string
  }
  nodemailer?: {
    host: string
    port: number
    secure: boolean
    auth: {
      user: string
      pass: string
    }
  }
}

export interface AuthConfig {
  jwtSecret: string
  jwtExpiresIn: string
  refreshTokenExpiresIn: string
  bcryptRounds: number
}

export interface ServerConfig {
  port: number
  host: string
  nodeEnv: string
  clientUrl: string
  enableCors: boolean
  enableSwagger: boolean
  enableLogging: boolean
  enableMetrics: boolean
}

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  skipSuccessfulRequests: boolean
  skipFailedRequests: boolean
}

export interface FileUploadConfig {
  maxFileSize: number
  allowedMimeTypes: string[]
  uploadPath: string
}

export interface Config {
  server: ServerConfig
  database: DatabaseConfig
  redis: RedisConfig
  ai: AIConfig
  storage: StorageConfig
  payment: PaymentConfig
  email: EmailConfig
  auth: AuthConfig
  rateLimit: RateLimitConfig
  fileUpload: FileUploadConfig
}

export const config: Config = {
  server: {
    port: parseInt(process.env.PORT || '3001'),
    host: process.env.HOST || '0.0.0.0',
    nodeEnv: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    enableCors: process.env.ENABLE_CORS === 'true',
    enableSwagger: process.env.ENABLE_SWAGGER === 'true',
    enableLogging: process.env.ENABLE_LOGGING === 'true',
    enableMetrics: process.env.ENABLE_METRICS === 'true'
  },
  
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/website_builder',
    provider: (process.env.DATABASE_PROVIDER as any) || 'postgresql',
    ssl: process.env.NODE_ENV === 'production',
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || '2'),
      max: parseInt(process.env.DB_POOL_MAX || '10')
    }
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0')
  },
  
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: process.env.OPENAI_MODEL || 'gpt-4'
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet'
    },
    google: {
      apiKey: process.env.GOOGLE_AI_API_KEY || '',
      model: process.env.GOOGLE_AI_MODEL || 'gemini-pro'
    }
  },
  
  storage: {
    provider: (process.env.STORAGE_PROVIDER as any) || 'cloudinary',
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
      apiKey: process.env.CLOUDINARY_API_KEY || '',
      apiSecret: process.env.CLOUDINARY_API_SECRET || ''
    },
    s3: {
      bucket: process.env.S3_BUCKET || '',
      region: process.env.S3_REGION || 'us-east-1',
      accessKey: process.env.S3_ACCESS_KEY || '',
      secretKey: process.env.S3_SECRET_KEY || ''
    },
    local: {
      uploadPath: process.env.UPLOAD_PATH || './uploads'
    }
  },
  
  payment: {
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
    },
    jazzcash: {
      merchantId: process.env.JAZZCASH_MERCHANT_ID || '',
      password: process.env.JAZZCASH_PASSWORD || '',
      returnUrl: process.env.JAZZCASH_RETURN_URL || '',
      cancelUrl: process.env.JAZZCASH_CANCEL_URL || ''
    },
    easypaisa: {
      merchantId: process.env.EASYPAISA_MERCHANT_ID || '',
      password: process.env.EASYPAISA_PASSWORD || '',
      returnUrl: process.env.EASYPAISA_RETURN_URL || '',
      cancelUrl: process.env.EASYPAISA_CANCEL_URL || ''
    }
  },
  
  email: {
    provider: (process.env.EMAIL_PROVIDER as any) || 'resend',
    resend: {
      apiKey: process.env.RESEND_API_KEY || ''
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY || ''
    },
    nodemailer: {
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    }
  },
  
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12')
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESS === 'true',
    skipFailedRequests: process.env.RATE_LIMIT_SKIP_FAILED === 'true'
  },
  
  fileUpload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    allowedMimeTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml').split(','),
    uploadPath: process.env.UPLOAD_PATH || './uploads'
  }
}

// Validation function
export function validateConfig(): void {
  const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET'
  ]
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }
  
  // Validate AI configuration
  if (!config.ai.openai.apiKey && !config.ai.anthropic.apiKey && !config.ai.google.apiKey) {
    console.warn('Warning: No AI service API keys configured. AI features will be disabled.')
  }
  
  // Validate storage configuration
  if (config.storage.provider === 'cloudinary' && !config.storage.cloudinary?.cloudName) {
    throw new Error('Cloudinary configuration is incomplete')
  }
  
  if (config.storage.provider === 's3' && !config.storage.s3?.bucket) {
    throw new Error('S3 configuration is incomplete')
  }
}

// Export individual configs for convenience
export const {
  server: serverConfig,
  database: databaseConfig,
  redis: redisConfig,
  ai: aiConfig,
  storage: storageConfig,
  payment: paymentConfig,
  email: emailConfig,
  auth: authConfig,
  rateLimit: rateLimitConfig,
  fileUpload: fileUploadConfig
} = config
