import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth-token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const apiHelpers = {
  // Auth endpoints
  login: async (email: string, password: string) => {
    const response = await api.post('/v1/auth/login', { email, password })
    return response.data
  },

  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/v1/auth/register', { email, password, name })
    return response.data
  },

  logout: async () => {
    const response = await api.post('/v1/auth/logout')
    return response.data
  },

  // Website endpoints
  getWebsites: async () => {
    const response = await api.get('/v1/websites')
    return response.data
  },

  getWebsite: async (id: string) => {
    const response = await api.get(`/v1/websites/${id}`)
    return response.data
  },

  createWebsite: async (data: any) => {
    const response = await api.post('/v1/websites', data)
    return response.data
  },

  updateWebsite: async (id: string, data: any) => {
    const response = await api.put(`/v1/websites/${id}`, data)
    return response.data
  },

  deleteWebsite: async (id: string) => {
    const response = await api.delete(`/v1/websites/${id}`)
    return response.data
  },

  publishWebsite: async (id: string, customDomain?: string) => {
    const response = await api.post(`/v1/websites/${id}/publish`, { customDomain })
    return response.data
  },

  unpublishWebsite: async (id: string) => {
    const response = await api.post(`/v1/websites/${id}/unpublish`)
    return response.data
  },

  // Template endpoints
  getTemplates: async (params?: { limit?: number; category?: string; search?: string }) => {
    const response = await api.get('/api/templates', { params })
    return response.data
  },

  getTemplate: async (id: string) => {
    const response = await api.get(`/api/templates/${id}`)
    return response.data
  },

  getAdvancedTemplates: async (params?: { category?: string; search?: string; pricingModel?: string }) => {
    const response = await api.get('/api/templates/advanced', { params })
    return response.data
  },

  // User endpoints
  getUser: async () => {
    const response = await api.get('/api/user')
    return response.data
  },

  updateUser: async (data: any) => {
    const response = await api.put('/api/user', data)
    return response.data
  },

  // Analytics endpoints
  getAnalytics: async (websiteId: string, params?: { period?: string }) => {
    const response = await api.get(`/api/analytics/${websiteId}`, { params })
    return response.data
  },

  // Domain endpoints
  getDomains: async () => {
    const response = await api.get('/api/domains')
    return response.data
  },

  addDomain: async (domain: string) => {
    const response = await api.post('/api/domains', { domain })
    return response.data
  },

  // DNS Verification endpoints
  verifyDomainDNS: async (domain: string, expectedRecords?: any[]) => {
    const response = await api.post('/api/dns/verify', { domain, expectedRecords })
    return response.data
  },

  startDNSVerification: async (domainId: string, intervalMinutes?: number) => {
    const response = await api.post(`/api/dns/verify/${domainId}/start`, { intervalMinutes })
    return response.data
  },

  stopDNSVerification: async (domainId: string) => {
    const response = await api.post(`/api/dns/verify/${domainId}/stop`)
    return response.data
  },

  getDNSStats: async () => {
    const response = await api.get('/api/dns/stats')
    return response.data
  },

  getDNSProviders: async () => {
    const response = await api.get('/api/dns/providers')
    return response.data
  },

  testDNSProvider: async (provider: string, domain: string) => {
    const response = await api.post('/api/dns/test-provider', { provider, domain })
    return response.data
  },

  // Billing endpoints
  getBilling: async () => {
    const response = await api.get('/api/billing')
    return response.data
  },

  updateSubscription: async (planId: string) => {
    const response = await api.post('/api/billing/subscription', { planId })
    return response.data
  },

  // Subscription endpoints
  getSubscriptions: async () => {
    const response = await api.get('/api/subscriptions')
    return response.data
  },

  getSubscription: async (id: string) => {
    const response = await api.get(`/api/subscriptions/${id}`)
    return response.data
  },

  getDefaultSubscription: async () => {
    const response = await api.get('/api/subscriptions/default')
    return response.data
  },

  upgradeSubscription: async (data: {
    userId: string
    subscriptionId: string
    paymentGateway: string
    customerEmail: string
    customerPhone?: string
  }) => {
    const response = await api.post('/api/subscriptions/upgrade', data)
    return response.data
  },

  confirmSubscriptionUpgrade: async (paymentId: string) => {
    const response = await api.post('/api/subscriptions/confirm-upgrade', { paymentId })
    return response.data
  },

  getUserLimits: async (userId: string) => {
    const response = await api.get(`/api/subscriptions/limits/${userId}`)
    return response.data
  },

  resetAIQuota: async (userId: string) => {
    const response = await api.post(`/api/subscriptions/reset-ai-quota/${userId}`)
    return response.data
  },

  // Payment endpoints
  createPaymentIntent: async (data: {
    amount: number
    currency: string
    subscriptionId: string
    paymentMethod: string
  }) => {
    const response = await api.post('/api/payments/create-intent', data)
    return response.data
  },

  confirmPayment: async (data: {
    paymentIntentId: string
    subscriptionId?: string
  }) => {
    const response = await api.post('/api/payments/confirm', data)
    return response.data
  },

  getPaymentHistory: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get('/api/payments/history', { params })
    return response.data
  },

  // File upload
  uploadFile: async (file: File, type: 'image' | 'document' = 'image') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    
    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // AI endpoints
  generateContent: async (prompt: string, type: 'text' | 'image' | 'website') => {
    const response = await api.post('/api/ai/generate', { prompt, type })
    return response.data
  },

  generateWebsite: async (requirements: any) => {
    const response = await api.post('/api/ai/generate-website', requirements)
    return response.data
  },

  // User Profile endpoints
  updateProfile: async (data: any) => {
    const response = await api.put('/v1/auth/profile', data)
    return response.data
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.put('/v1/auth/change-password', data)
    return response.data
  },

  getUserProfile: async () => {
    const response = await api.get('/v1/users/profile')
    return response.data
  },

  // Notification preferences
  updateNotificationPreferences: async (userId: string, preferences: any) => {
    const response = await api.put(`/v1/notifications/preferences/${userId}`, preferences)
    return response.data
  },

  // Brand Kit endpoints
  getBrandKits: async () => {
    const response = await api.get('/api/brand-kits')
    return response.data
  },

  getGlobalBrandKit: async () => {
    const response = await api.get('/api/brand-kits/global')
    return response.data
  },

  getBrandKit: async (id: string) => {
    const response = await api.get(`/api/brand-kits/${id}`)
    return response.data
  },

  createBrandKit: async (data: any) => {
    const response = await api.post('/api/brand-kits', data)
    return response.data
  },

  updateBrandKit: async (id: string, data: any) => {
    const response = await api.put(`/api/brand-kits/${id}`, data)
    return response.data
  },

  deleteBrandKit: async (id: string) => {
    const response = await api.delete(`/api/brand-kits/${id}`)
    return response.data
  },

  duplicateBrandKit: async (id: string) => {
    const response = await api.post(`/api/brand-kits/${id}/duplicate`)
    return response.data
  },

  applyBrandKitToWebsite: async (brandKitId: string, websiteId: string) => {
    const response = await api.post(`/api/brand-kits/${brandKitId}/apply`, { websiteId })
    return response.data
  },

  exportBrandKit: async (id: string) => {
    const response = await api.get(`/api/brand-kits/${id}/export`)
    return response.data
  },

  uploadBrandAsset: async (brandKitId: string, assetData: any) => {
    const response = await api.post(`/api/brand-kits/${brandKitId}/assets`, assetData)
    return response.data
  },

  getBrandKitStats: async (id: string) => {
    const response = await api.get(`/api/brand-kits/${id}/stats`)
    return response.data
  },

  // SEO endpoints
  analyzeWebsiteSEO: async (websiteId: string, url?: string) => {
    const response = await api.post('/api/seo/analyze-website', { websiteId, url })
    return response.data
  },

  getSEOAnalysis: async (websiteId: string, options?: any) => {
    const response = await api.get(`/api/seo/analysis/${websiteId}`, { params: options })
    return response.data
  },

  generateSitemap: async (websiteId: string, options?: any) => {
    const response = await api.post('/api/seo/generate-sitemap', { websiteId, ...options })
    return response.data
  },

  researchKeywords: async (keyword: string, options?: any) => {
    const response = await api.post('/api/seo/keyword-research', { keyword, ...options })
    return response.data
  },

  updateMetaTags: async (data: any) => {
    const response = await api.put('/api/seo/meta-tags', data)
    return response.data
  },

  scheduleSocialMediaPost: async (data: any) => {
    const response = await api.post('/api/seo/social-media-post', data)
    return response.data
  },

  getSocialMediaPosts: async (websiteId: string) => {
    const response = await api.get(`/api/seo/social-media-posts/${websiteId}`)
    return response.data
  },

  optimizeSEO: async (data: any) => {
    const response = await api.post('/api/ai/optimize-seo', data)
    return response.data
  },
}

export default api
