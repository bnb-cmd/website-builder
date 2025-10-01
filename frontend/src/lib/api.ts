import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'

// Debug environment variables
console.log('🔧 Environment Variables Debug:')
console.log('🔧 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)
console.log('🔧 Final API_URL:', API_URL)
console.log('🔧 NODE_ENV:', process.env.NODE_ENV)

export const api = axios.create({
  baseURL: `${API_URL}/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Debug axios configuration
console.log('🔧 Axios API instance created with:')
console.log('🔧 Base URL:', api.defaults.baseURL)
console.log('🔧 Timeout:', api.defaults.timeout)
console.log('🔧 Headers:', api.defaults.headers)
console.log('🔧 With Credentials:', api.defaults.withCredentials)

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('🔧 Axios Response:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('🔧 Axios Error:', error.message)
    console.error('🔧 Error Status:', error.response?.status)
    console.error('🔧 Error URL:', error.config?.url)
    console.error('🔧 Error Data:', error.response?.data)
    return Promise.reject(error)
  }
)

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Enable auth headers for real authentication
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refreshToken')
          if (refreshToken) {
            const response = await axios.post(`${API_URL}/v1/auth/refresh`, {
              refreshToken,
            })

            const { accessToken, refreshToken: newRefreshToken } = response.data.data
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', newRefreshToken)

            // Retry the original request
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            return api(originalRequest)
          }
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// API endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    changePassword: '/auth/change-password',
    verifyEmail: '/auth/verify-email',
    resendVerification: '/auth/resend-verification'
  },
  users: {
    profile: '/users/profile',
    updateProfile: '/users/profile',
    deleteAccount: '/users/delete',
    uploadAvatar: '/users/avatar',
    preferences: '/users/preferences'
  },
  websites: {
    list: '/websites',
    create: '/websites',
    get: (id: string) => `/websites/${id}`,
    update: (id: string) => `/websites/${id}`,
    delete: (id: string) => `/websites/${id}`,
    publish: (id: string) => `/websites/${id}/publish`,
    unpublish: (id: string) => `/websites/${id}/unpublish`,
    duplicate: (id: string) => `/websites/${id}/duplicate`,
    export: (id: string) => `/websites/${id}/export`,
    import: '/websites/import',
    analytics: (id: string) => `/websites/${id}/analytics`,
    settings: (id: string) => `/websites/${id}/settings`,
    backup: (id: string) => `/websites/${id}/backup`,
    restore: (id: string) => `/websites/${id}/restore`
  },
  templates: {
    list: '/templates',
    get: (id: string) => `/templates/${id}`,
    categories: '/templates/categories',
    featured: '/templates/featured',
    search: '/templates/search',
    favorites: '/templates/favorites',
    addFavorite: (id: string) => `/templates/${id}/favorite`,
    removeFavorite: (id: string) => `/templates/${id}/favorite`
  },
  ai: {
    generate: '/ai/generate',
    improve: '/ai/improve',
    translate: '/ai/translate',
    optimize: '/ai/optimize',
    suggest: '/ai/suggest',
    analyze: '/ai/analyze',
    generateContent: '/ai/content',
    generateImages: '/ai/images',
    generateCode: '/ai/code',
    chat: '/ai/chat',
    history: '/ai/history',
    quota: '/ai/quota'
  },
  payments: {
    createIntent: '/payments/create-intent',
    confirmPayment: '/payments/confirm',
    getHistory: '/payments/history',
    getInvoice: (id: string) => `/payments/invoice/${id}`,
    refund: '/payments/refund',
    webhook: '/payments/webhook'
  },
  subscriptions: {
    plans: '/subscriptions/plans',
    current: '/subscriptions/current',
    subscribe: '/subscriptions/subscribe',
    cancel: '/subscriptions/cancel',
    upgrade: '/subscriptions/upgrade',
    downgrade: '/subscriptions/downgrade',
    billing: '/subscriptions/billing',
    invoices: '/subscriptions/invoices'
  },
  domains: {
    list: '/domains',
    check: '/domains/check',
    register: '/domains/register',
    connect: '/domains/connect',
    disconnect: '/domains/disconnect',
    dns: (id: string) => `/domains/${id}/dns`,
    ssl: (id: string) => `/domains/${id}/ssl`
  },
  media: {
    upload: '/media/upload',
    list: '/media',
    get: (id: string) => `/media/${id}`,
    delete: (id: string) => `/media/${id}`,
    optimize: (id: string) => `/media/${id}/optimize`,
    resize: (id: string) => `/media/${id}/resize`,
    convert: (id: string) => `/media/${id}/convert`
  },
  analytics: {
    overview: '/analytics/overview',
    traffic: '/analytics/traffic',
    performance: '/analytics/performance',
    users: '/analytics/users',
    conversions: '/analytics/conversions',
    reports: '/analytics/reports',
    export: '/analytics/export'
  },
  integrations: {
    list: '/integrations',
    connect: (id: string) => `/integrations/${id}/connect`,
    disconnect: (id: string) => `/integrations/${id}/disconnect`,
    configure: (id: string) => `/integrations/${id}/configure`,
    status: (id: string) => `/integrations/${id}/status`
  },
  notifications: {
    list: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: '/notifications/read-all',
    delete: (id: string) => `/notifications/${id}`,
    preferences: '/notifications/preferences',
    subscribe: '/notifications/subscribe',
    unsubscribe: '/notifications/unsubscribe'
  },
  admin: {
    stats: '/admin/stats',
    users: '/admin/users',
    websites: '/admin/websites',
    templates: '/admin/templates',
    payments: '/admin/payments',
    analytics: '/admin/analytics',
    settings: '/admin/settings',
    logs: '/admin/logs'
  }
}

// Helper functions
export const apiHelpers = {
  // Handle API errors consistently
  handleError: (error: any) => {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.error?.message || 'An error occurred',
        code: error.response.data?.error?.code || 'UNKNOWN_ERROR',
        status: error.response.status
      }
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error - please check your connection',
        code: 'NETWORK_ERROR',
        status: 0
      }
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        status: 0
      }
    }
  },

  // Website API helpers
  getWebsites: async (params: any = {}) => {
    try {
      const queryParams = new URLSearchParams()
      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params.status) queryParams.append('status', params.status)
      
      const response = await api.get(`/websites?${queryParams.toString()}`)
      return response
    } catch (error) {
      console.error('Failed to fetch websites:', error)
      throw error
    }
  },

  createWebsite: async (data: any) => {
    try {
      const response = await api.post('/websites', data)
      return response
    } catch (error) {
      console.error('Failed to create website:', error)
      throw error
    }
  },

  getWebsite: async (id: string) => {
    try {
      const response = await api.get(`/websites/${id}`)
      return response
    } catch (error) {
      console.error('Failed to fetch website:', error)
      throw error
    }
  },

  updateWebsite: async (id: string, data: any) => {
    try {
      const response = await api.put(`/websites/${id}`, data)
      return response
    } catch (error) {
      console.error('Failed to update website:', error)
      throw error
    }
  },

  deleteWebsite: async (id: string) => {
    try {
      const response = await api.delete(`/websites/${id}`)
      return response
    } catch (error) {
      console.error('Failed to delete website:', error)
      throw error
    }
  },

  publishWebsite: async (id: string) => {
    try {
      const response = await api.post(`/websites/${id}/publish`)
      return response
    } catch (error) {
      console.error('Failed to publish website:', error)
      throw error
    }
  },

  // Template API helpers
  getTemplates: async (params: any = {}) => {
    try {
      console.log('🔧 API Helper: getTemplates called with params:', params)
      console.log('🔧 API Base URL:', api.defaults.baseURL)
      
      const queryParams = new URLSearchParams()
      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.category) queryParams.append('category', params.category)
      if (params.search) queryParams.append('search', params.search)
      if (params.featured) queryParams.append('featured', params.featured.toString())
      
      const url = `/templates?${queryParams.toString()}`
      console.log('🔧 Making request to:', url)
      
      const response = await api.get(url)
      console.log('🔧 API Response received:', response.status, response.statusText)
      console.log('🔧 Response data:', response.data)
      
      return response
    } catch (error) {
      console.error('🔧 API Helper Error:', error)
      console.error('🔧 Error response:', error.response)
      throw error
    }
  },

  getAdvancedTemplates: async (params: any = {}) => {
    try {
      const queryParams = new URLSearchParams()
      if (params.category) queryParams.append('category', params.category)
      if (params.search) queryParams.append('search', params.search)
      if (params.pricingModel) queryParams.append('pricingModel', params.pricingModel)
      queryParams.append('advanced', 'true')
      
      const response = await api.get(`/templates?${queryParams.toString()}`)
      return response
    } catch (error) {
      console.error('Failed to fetch advanced templates:', error)
      throw error
    }
  },

  getTemplate: async (id: string) => {
    try {
      const response = await api.get(`/templates/${id}`)
      return response
    } catch (error) {
      console.error('Failed to fetch template:', error)
      throw error
    }
  },

  getTemplateCategories: async () => {
    try {
      const response = await api.get('/templates/categories')
      return response
    } catch (error) {
      console.error('Failed to fetch template categories:', error)
      throw error
    }
  },

  // User profile helpers
  getProfile: async () => {
    try {
      const response = await api.get('/auth/me')
      return response
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      throw error
    }
  },

  updateProfile: async (data: any) => {
    try {
      const response = await api.put('/auth/profile', data)
      return response
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    }
  },

  // AI API helpers
  generateContent: async (data: any) => {
    try {
      const response = await api.post('/ai/generate', data)
      return response
    } catch (error) {
      console.error('Failed to generate content:', error)
      throw error
    }
  },

  improveContent: async (data: any) => {
    try {
      const response = await api.post('/ai/improve', data)
      return response
    } catch (error) {
      console.error('Failed to improve content:', error)
      throw error
    }
  },

  translateContent: async (data: any) => {
    try {
      const response = await api.post('/ai/translate', data)
      return response
    } catch (error) {
      console.error('Failed to translate content:', error)
      throw error
    }
  },

  // Analytics helpers
  getAnalytics: async (websiteId: string, params: any = {}) => {
    try {
      const queryParams = new URLSearchParams()
      if (params.startDate) queryParams.append('startDate', params.startDate)
      if (params.endDate) queryParams.append('endDate', params.endDate)
      if (params.metric) queryParams.append('metric', params.metric)
      
      const response = await api.get(`/websites/${websiteId}/analytics?${queryParams.toString()}`)
      return response
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      throw error
    }
  },

  // Media helpers
  uploadMedia: async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response
    } catch (error) {
      console.error('Failed to upload media:', error)
      throw error
    }
  },

  getMedia: async (params: any = {}) => {
    try {
      const queryParams = new URLSearchParams()
      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.type) queryParams.append('type', params.type)
      
      const response = await api.get(`/media?${queryParams.toString()}`)
      return response
    } catch (error) {
      console.error('Failed to fetch media:', error)
      throw error
    }
  },

  // Agency API helpers
  getMyAgency: async () => {
    try {
      const response = await api.get('/agency/my')
      return response
    } catch (error) {
      console.error('Failed to fetch agency:', error)
      throw error
    }
  },

  createAgency: async (data: any) => {
    try {
      const response = await api.post('/agency', data)
      return response
    } catch (error) {
      console.error('Failed to create agency:', error)
      throw error
    }
  },

  updateAgency: async (id: string, data: any) => {
    try {
      const response = await api.put(`/agency/${id}`, data)
      return response
    } catch (error) {
      console.error('Failed to update agency:', error)
      throw error
    }
  },

  getAgencyStats: async (agencyId: string) => {
    try {
      const response = await api.get(`/agency/${agencyId}/stats`)
      return response
    } catch (error) {
      console.error('Failed to fetch agency stats:', error)
      throw error
    }
  },

  // Subscription API helpers
  getSubscriptions: async () => {
    try {
      const response = await api.get('/subscriptions/plans')
      return response
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error)
      throw error
    }
  },

  getCurrentSubscription: async () => {
    try {
      const response = await api.get('/subscriptions/current')
      return response
    } catch (error) {
      console.error('Failed to fetch current subscription:', error)
      throw error
    }
  },

  upgradeSubscription: async (data: any) => {
    try {
      const response = await api.post('/subscriptions/upgrade', data)
      return response
    } catch (error) {
      console.error('Failed to upgrade subscription:', error)
      throw error
    }
  },

  // AI Onboarding API helpers
  createOnboardingProfile: async (data: any) => {
    try {
      const response = await api.post('/ai-onboarding/profile', data)
      return response
    } catch (error) {
      console.error('Failed to create onboarding profile:', error)
      throw error
    }
  },

  getOnboardingChecklist: async (userId: string) => {
    try {
      const response = await api.get(`/ai-onboarding/checklist/${userId}`)
      return response
    } catch (error) {
      console.error('Failed to fetch onboarding checklist:', error)
      throw error
    }
  },

  getOnboardingUsage: async (userId: string) => {
    try {
      const response = await api.get(`/ai-onboarding/usage/${userId}`)
      return response
    } catch (error) {
      console.error('Failed to fetch onboarding usage:', error)
      throw error
    }
  },

  getUserLimits: async (userId: string) => {
    try {
      const response = await api.get(`/subscriptions/limits/${userId}`)
      return response
    } catch (error) {
      console.error('Failed to fetch user limits:', error)
      throw error
    }
  },

  // Agency Client API helpers
  addAgencyClient: async (data: any) => {
    try {
      const response = await api.post('/agency/clients', data)
      return response
    } catch (error) {
      console.error('Failed to add agency client:', error)
      throw error
    }
  },

  getAgencyClients: async (agencyId: string) => {
    try {
      const response = await api.get(`/agency/${agencyId}/clients`)
      return response
    } catch (error) {
      console.error('Failed to fetch agency clients:', error)
      throw error
    }
  },

  updateAgencyClient: async (clientId: string, data: any) => {
    try {
      const response = await api.put(`/agency/clients/${clientId}`, data)
      return response
    } catch (error) {
      console.error('Failed to update agency client:', error)
      throw error
    }
  },

  deleteAgencyClient: async (clientId: string) => {
    try {
      const response = await api.delete(`/agency/clients/${clientId}`)
      return response
    } catch (error) {
      console.error('Failed to delete agency client:', error)
      throw error
    }
  },

  // Agency Team API helpers
  addAgencyTeamMember: async (data: any) => {
    try {
      const response = await api.post('/agency/team', data)
      return response
    } catch (error) {
      console.error('Failed to add team member:', error)
      throw error
    }
  },

  getAgencyTeam: async (agencyId: string) => {
    try {
      const response = await api.get(`/agency/${agencyId}/team`)
      return response
    } catch (error) {
      console.error('Failed to fetch agency team:', error)
      throw error
    }
  },

  updateAgencyTeamMember: async (memberId: string, data: any) => {
    try {
      const response = await api.put(`/agency/team/${memberId}`, data)
      return response
    } catch (error) {
      console.error('Failed to update team member:', error)
      throw error
    }
  },

  removeAgencyTeamMember: async (memberId: string) => {
    try {
      const response = await api.delete(`/agency/team/${memberId}`)
      return response
    } catch (error) {
      console.error('Failed to remove team member:', error)
      throw error
    }
  },

  // Agency Project API helpers
  createAgencyProject: async (data: any) => {
    try {
      const response = await api.post('/agency/projects', data)
      return response
    } catch (error) {
      console.error('Failed to create agency project:', error)
      throw error
    }
  },

  getAgencyProjects: async (agencyId: string) => {
    try {
      const response = await api.get(`/agency/${agencyId}/projects`)
      return response
    } catch (error) {
      console.error('Failed to fetch agency projects:', error)
      throw error
    }
  },

  updateAgencyProject: async (projectId: string, data: any) => {
    try {
      const response = await api.put(`/agency/projects/${projectId}`, data)
      return response
    } catch (error) {
      console.error('Failed to update agency project:', error)
      throw error
    }
  },

  deleteAgencyProject: async (projectId: string) => {
    try {
      const response = await api.delete(`/agency/projects/${projectId}`)
      return response
    } catch (error) {
      console.error('Failed to delete agency project:', error)
      throw error
    }
  },

  // Agency Plan API helpers
  upgradeAgencyPlan: async (agencyId: string, data: any) => {
    try {
      const response = await api.post(`/agency/${agencyId}/upgrade`, data)
      return response
    } catch (error) {
      console.error('Failed to upgrade agency plan:', error)
      throw error
    }
  },

  getAgencyPlans: async () => {
    try {
      const response = await api.get('/agency/plans')
      return response
    } catch (error) {
      console.error('Failed to fetch agency plans:', error)
      throw error
    }
  },

  // Agency Billing API helpers
  getAgencyBilling: async (agencyId: string) => {
    try {
      const response = await api.get(`/agency/${agencyId}/billing`)
      return response
    } catch (error) {
      console.error('Failed to fetch agency billing:', error)
      throw error
    }
  },

  updateAgencyBilling: async (agencyId: string, data: any) => {
    try {
      const response = await api.put(`/agency/${agencyId}/billing`, data)
      return response
    } catch (error) {
      console.error('Failed to update agency billing:', error)
      throw error
    }
  },

  // Agency Reports API helpers
  getAgencyReports: async (agencyId: string, params: any = {}) => {
    try {
      const queryParams = new URLSearchParams()
      if (params.startDate) queryParams.append('startDate', params.startDate)
      if (params.endDate) queryParams.append('endDate', params.endDate)
      if (params.type) queryParams.append('type', params.type)
      
      const response = await api.get(`/agency/${agencyId}/reports?${queryParams.toString()}`)
      return response
    } catch (error) {
      console.error('Failed to fetch agency reports:', error)
      throw error
    }
  },

  generateAgencyReport: async (agencyId: string, data: any) => {
    try {
      const response = await api.post(`/agency/${agencyId}/reports`, data)
      return response
    } catch (error) {
      console.error('Failed to generate agency report:', error)
      throw error
    }
  },

  // AI Chat API helpers
  getAISessions: async (websiteId?: string) => {
    try {
      const queryParams = new URLSearchParams()
      if (websiteId) queryParams.append('websiteId', websiteId)
      
      const response = await api.get(`/ai/sessions?${queryParams.toString()}`)
      return response
    } catch (error) {
      console.error('Failed to fetch AI sessions:', error)
      throw error
    }
  },

  createAISession: async (data: any) => {
    try {
      const response = await api.post('/ai/sessions', data)
      return response
    } catch (error) {
      console.error('Failed to create AI session:', error)
      throw error
    }
  },

  sendAIMessage: async (sessionId: string, data: any) => {
    try {
      const response = await api.post(`/ai/sessions/${sessionId}/messages`, data)
      return response
    } catch (error) {
      console.error('Failed to send AI message:', error)
      throw error
    }
  },

  getAIMessages: async (sessionId: string) => {
    try {
      const response = await api.get(`/ai/sessions/${sessionId}/messages`)
      return response
    } catch (error) {
      console.error('Failed to fetch AI messages:', error)
      throw error
    }
  },

  deleteAISession: async (sessionId: string) => {
    try {
      const response = await api.delete(`/ai/sessions/${sessionId}`)
      return response
    } catch (error) {
      console.error('Failed to delete AI session:', error)
      throw error
    }
  },

  // AI Content Generation API helpers
  generateAIContent: async (data: any) => {
    try {
      const response = await api.post('/ai/content/generate', data)
      return response
    } catch (error) {
      console.error('Failed to generate AI content:', error)
      throw error
    }
  },

  improveAIContent: async (data: any) => {
    try {
      const response = await api.post('/ai/content/improve', data)
      return response
    } catch (error) {
      console.error('Failed to improve AI content:', error)
      throw error
    }
  },

  translateAIContent: async (data: any) => {
    try {
      const response = await api.post('/ai/content/translate', data)
      return response
    } catch (error) {
      console.error('Failed to translate AI content:', error)
      throw error
    }
  },

  // AI Image Generation API helpers
  generateAIImage: async (data: any) => {
    try {
      const response = await api.post('/ai/images/generate', data)
      return response
    } catch (error) {
      console.error('Failed to generate AI image:', error)
      throw error
    }
  },

  editAIImage: async (data: any) => {
    try {
      const response = await api.post('/ai/images/edit', data)
      return response
    } catch (error) {
      console.error('Failed to edit AI image:', error)
      throw error
    }
  },

  // AI Code Generation API helpers
  generateAICode: async (data: any) => {
    try {
      const response = await api.post('/ai/code/generate', data)
      return response
    } catch (error) {
      console.error('Failed to generate AI code:', error)
      throw error
    }
  },

  optimizeAICode: async (data: any) => {
    try {
      const response = await api.post('/ai/code/optimize', data)
      return response
    } catch (error) {
      console.error('Failed to optimize AI code:', error)
      throw error
    }
  },

  // AI Analytics API helpers
  getAIAnalytics: async (params: any = {}) => {
    try {
      const queryParams = new URLSearchParams()
      if (params.startDate) queryParams.append('startDate', params.startDate)
      if (params.endDate) queryParams.append('endDate', params.endDate)
      if (params.userId) queryParams.append('userId', params.userId)
      
      const response = await api.get(`/ai/analytics?${queryParams.toString()}`)
      return response
    } catch (error) {
      console.error('Failed to fetch AI analytics:', error)
      throw error
    }
  },

  getAIUsageStats: async (userId: string) => {
    try {
      const response = await api.get(`/ai/usage/${userId}`)
      return response
    } catch (error) {
      console.error('Failed to fetch AI usage stats:', error)
      throw error
    }
  },

  // Analytics Insights API helpers
  getAnalyticsInsights: async (websiteId: string) => {
    try {
      const response = await api.get(`/analytics/${websiteId}/insights`)
      return response
    } catch (error) {
      console.error('Failed to fetch analytics insights:', error)
      throw error
    }
  },

  getAnalyticsReports: async (websiteId: string, params: any = {}) => {
    try {
      const queryParams = new URLSearchParams()
      if (params.startDate) queryParams.append('startDate', params.startDate)
      if (params.endDate) queryParams.append('endDate', params.endDate)
      if (params.metric) queryParams.append('metric', params.metric)
      if (params.dimension) queryParams.append('dimension', params.dimension)
      
      const response = await api.get(`/analytics/${websiteId}/reports?${queryParams.toString()}`)
      return response
    } catch (error) {
      console.error('Failed to fetch analytics reports:', error)
      throw error
    }
  },

  generateAnalyticsReport: async (websiteId: string, data: any) => {
    try {
      const response = await api.post(`/analytics/${websiteId}/reports`, data)
      return response
    } catch (error) {
      console.error('Failed to generate analytics report:', error)
      throw error
    }
  },

  getAnalyticsKPIs: async (websiteId: string) => {
    try {
      const response = await api.get(`/analytics/${websiteId}/kpis`)
      return response
    } catch (error) {
      console.error('Failed to fetch analytics KPIs:', error)
      throw error
    }
  },

  getAnalyticsSegments: async (websiteId: string) => {
    try {
      const response = await api.get(`/analytics/${websiteId}/segments`)
      return response
    } catch (error) {
      console.error('Failed to fetch analytics segments:', error)
      throw error
    }
  },

  createAnalyticsSegment: async (websiteId: string, data: any) => {
    try {
      const response = await api.post(`/analytics/${websiteId}/segments`, data)
      return response
    } catch (error) {
      console.error('Failed to create analytics segment:', error)
      throw error
    }
  },

  // BI Dashboard API helpers
  getBIDashboard: async (websiteId: string) => {
    try {
      const response = await api.get(`/bi/${websiteId}/dashboard`)
      return response
    } catch (error) {
      console.error('Failed to fetch BI dashboard:', error)
      throw error
    }
  },

  createBIDashboard: async (websiteId: string, data: any) => {
    try {
      const response = await api.post(`/bi/${websiteId}/dashboard`, data)
      return response
    } catch (error) {
      console.error('Failed to create BI dashboard:', error)
      throw error
    }
  },

  updateBIDashboard: async (dashboardId: string, data: any) => {
    try {
      const response = await api.put(`/bi/dashboard/${dashboardId}`, data)
      return response
    } catch (error) {
      console.error('Failed to update BI dashboard:', error)
      throw error
    }
  },

  getBIWidgets: async (dashboardId: string) => {
    try {
      const response = await api.get(`/bi/dashboard/${dashboardId}/widgets`)
      return response
    } catch (error) {
      console.error('Failed to fetch BI widgets:', error)
      throw error
    }
  },

  createBIWidget: async (dashboardId: string, data: any) => {
    try {
      const response = await api.post(`/bi/dashboard/${dashboardId}/widgets`, data)
      return response
    } catch (error) {
      console.error('Failed to create BI widget:', error)
      throw error
    }
  },

  updateBIWidget: async (widgetId: string, data: any) => {
    try {
      const response = await api.put(`/bi/widgets/${widgetId}`, data)
      return response
    } catch (error) {
      console.error('Failed to update BI widget:', error)
      throw error
    }
  },

  deleteBIWidget: async (widgetId: string) => {
    try {
      const response = await api.delete(`/bi/widgets/${widgetId}`)
      return response
    } catch (error) {
      console.error('Failed to delete BI widget:', error)
      throw error
    }
  },

  // AR/VR Content API helpers
  getARVRContent: async (websiteId: string) => {
    try {
      const response = await api.get(`/arvr/${websiteId}/content`)
      return response
    } catch (error) {
      console.error('Failed to fetch AR/VR content:', error)
      throw error
    }
  },

  createARVRContent: async (websiteId: string, data: any) => {
    try {
      const response = await api.post(`/arvr/${websiteId}/content`, data)
      return response
    } catch (error) {
      console.error('Failed to create AR/VR content:', error)
      throw error
    }
  },

  updateARVRContent: async (contentId: string, data: any) => {
    try {
      const response = await api.put(`/arvr/content/${contentId}`, data)
      return response
    } catch (error) {
      console.error('Failed to update AR/VR content:', error)
      throw error
    }
  },

  deleteARVRContent: async (contentId: string) => {
    try {
      const response = await api.delete(`/arvr/content/${contentId}`)
      return response
    } catch (error) {
      console.error('Failed to delete AR/VR content:', error)
      throw error
    }
  },

  // AR/VR Assets API helpers
  uploadARVRAsset: async (data: any) => {
    try {
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        formData.append(key, data[key])
      })
      
      const response = await api.post('/arvr/assets/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response
    } catch (error) {
      console.error('Failed to upload AR/VR asset:', error)
      throw error
    }
  },

  getARVRAssets: async (params: any = {}) => {
    try {
      const queryParams = new URLSearchParams()
      if (params.type) queryParams.append('type', params.type)
      if (params.limit) queryParams.append('limit', params.limit.toString())
      
      const response = await api.get(`/arvr/assets?${queryParams.toString()}`)
      return response
    } catch (error) {
      console.error('Failed to fetch AR/VR assets:', error)
      throw error
    }
  },

  // AR/VR Scenes API helpers
  getARVRScenes: async (websiteId: string) => {
    try {
      const response = await api.get(`/arvr/${websiteId}/scenes`)
      return response
    } catch (error) {
      console.error('Failed to fetch AR/VR scenes:', error)
      throw error
    }
  },

  createARVRScene: async (websiteId: string, data: any) => {
    try {
      const response = await api.post(`/arvr/${websiteId}/scenes`, data)
      return response
    } catch (error) {
      console.error('Failed to create AR/VR scene:', error)
      throw error
    }
  },

  updateARVRScene: async (sceneId: string, data: any) => {
    try {
      const response = await api.put(`/arvr/scenes/${sceneId}`, data)
      return response
    } catch (error) {
      console.error('Failed to update AR/VR scene:', error)
      throw error
    }
  },

  deleteARVRScene: async (sceneId: string) => {
    try {
      const response = await api.delete(`/arvr/scenes/${sceneId}`)
      return response
    } catch (error) {
      console.error('Failed to delete AR/VR scene:', error)
      throw error
    }
  },

  // AR/VR Analytics API helpers
  getARVRAnalytics: async (websiteId: string, params: any = {}) => {
    try {
      const queryParams = new URLSearchParams()
      if (params.startDate) queryParams.append('startDate', params.startDate)
      if (params.endDate) queryParams.append('endDate', params.endDate)
      if (params.sceneId) queryParams.append('sceneId', params.sceneId)
      
      const response = await api.get(`/arvr/${websiteId}/analytics?${queryParams.toString()}`)
      return response
    } catch (error) {
      console.error('Failed to fetch AR/VR analytics:', error)
      throw error
    }
  },

  // AR/VR Generation API helpers
  generateARVRContent: async (data: any) => {
    try {
      const response = await api.post('/arvr/generate', data)
      return response
    } catch (error) {
      console.error('Failed to generate AR/VR content:', error)
      throw error
    }
  },

  generateARVRScene: async (data: any) => {
    try {
      const response = await api.post('/arvr/scenes/generate', data)
      return response
    } catch (error) {
      console.error('Failed to generate AR/VR scene:', error)
      throw error
    }
  },

  optimizeARVRContent: async (contentId: string, data: any) => {
    try {
      const response = await api.post(`/arvr/content/${contentId}/optimize`, data)
      return response
    } catch (error) {
      console.error('Failed to optimize AR/VR content:', error)
      throw error
    }
  },

  processARVRContent: async (contentId: string) => {
    try {
      const response = await api.post(`/arvr/content/${contentId}/process`)
      return response
    } catch (error) {
      console.error('Failed to process AR/VR content:', error)
      throw error
    }
  },

  publishARVRContent: async (contentId: string) => {
    try {
      const response = await api.post(`/arvr/content/${contentId}/publish`)
      return response
    } catch (error) {
      console.error('Failed to publish AR/VR content:', error)
      throw error
    }
  },

  unpublishARVRContent: async (contentId: string) => {
    try {
      const response = await api.post(`/arvr/content/${contentId}/unpublish`)
      return response
    } catch (error) {
      console.error('Failed to unpublish AR/VR content:', error)
      throw error
    }
  },

  // Blockchain API helpers
  getBlockchainWallets: async (userId: string, websiteId?: string) => {
    try {
      const queryParams = new URLSearchParams()
      if (websiteId) queryParams.append('websiteId', websiteId)
      
      const response = await api.get(`/blockchain/${userId}/wallets?${queryParams.toString()}`)
      return response
    } catch (error) {
      console.error('Failed to fetch blockchain wallets:', error)
      throw error
    }
  },

  getNFTCollections: async (userId: string, websiteId?: string) => {
    try {
      const queryParams = new URLSearchParams()
      if (websiteId) queryParams.append('websiteId', websiteId)
      
      const response = await api.get(`/blockchain/${userId}/collections?${queryParams.toString()}`)
      return response
    } catch (error) {
      console.error('Failed to fetch NFT collections:', error)
      throw error
    }
  },

  getSmartContracts: async (userId: string, websiteId?: string) => {
    try {
      const queryParams = new URLSearchParams()
      if (websiteId) queryParams.append('websiteId', websiteId)
      
      const response = await api.get(`/blockchain/${userId}/contracts?${queryParams.toString()}`)
      return response
    } catch (error) {
      console.error('Failed to fetch smart contracts:', error)
      throw error
    }
  },

  createBlockchainWallet: async (userId: string, data: any) => {
    try {
      const response = await api.post(`/blockchain/${userId}/wallets`, data)
      return response
    } catch (error) {
      console.error('Failed to create blockchain wallet:', error)
      throw error
    }
  },

  createNFTCollection: async (userId: string, data: any) => {
    try {
      const response = await api.post(`/blockchain/${userId}/collections`, data)
      return response
    } catch (error) {
      console.error('Failed to create NFT collection:', error)
      throw error
    }
  },

  deploySmartContract: async (userId: string, data: any) => {
    try {
      const response = await api.post(`/blockchain/${userId}/contracts`, data)
      return response
    } catch (error) {
      console.error('Failed to deploy smart contract:', error)
      throw error
    }
  },

  getBlockchainTransactions: async (userId: string, params: any = {}) => {
    try {
      const queryParams = new URLSearchParams()
      if (params.walletId) queryParams.append('walletId', params.walletId)
      if (params.startDate) queryParams.append('startDate', params.startDate)
      if (params.endDate) queryParams.append('endDate', params.endDate)
      
      const response = await api.get(`/blockchain/${userId}/transactions?${queryParams.toString()}`)
      return response
    } catch (error) {
      console.error('Failed to fetch blockchain transactions:', error)
      throw error
    }
  },

  // Content Management API helpers
  getContents: async (websiteId: string, params: any = {}) => {
    try {
      const queryParams = new URLSearchParams()
      if (params.search) queryParams.append('search', params.search)
      if (params.status) queryParams.append('status', params.status)
      if (params.type) queryParams.append('type', params.type)
      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.offset) queryParams.append('offset', params.offset.toString())
      
      const response = await api.get(`/websites/${websiteId}/contents?${queryParams.toString()}`)
      return response
    } catch (error) {
      console.error('Failed to fetch contents:', error)
      throw error
    }
  },

  createContent: async (websiteId: string, data: any) => {
    try {
      const response = await api.post(`/websites/${websiteId}/contents`, data)
      return response
    } catch (error) {
      console.error('Failed to create content:', error)
      throw error
    }
  },

  updateContent: async (contentId: string, data: any) => {
    try {
      const response = await api.put(`/contents/${contentId}`, data)
      return response
    } catch (error) {
      console.error('Failed to update content:', error)
      throw error
    }
  },

  deleteContent: async (contentId: string) => {
    try {
      const response = await api.delete(`/contents/${contentId}`)
      return response
    } catch (error) {
      console.error('Failed to delete content:', error)
      throw error
    }
  },

  publishContent: async (contentId: string) => {
    try {
      const response = await api.post(`/contents/${contentId}/publish`)
      return response
    } catch (error) {
      console.error('Failed to publish content:', error)
      throw error
    }
  },

  unpublishContent: async (contentId: string) => {
    try {
      const response = await api.post(`/contents/${contentId}/unpublish`)
      return response
    } catch (error) {
      console.error('Failed to unpublish content:', error)
      throw error
    }
  },

  scheduleContent: async (contentId: string, data: any) => {
    try {
      const response = await api.post(`/contents/${contentId}/schedule`, data)
      return response
    } catch (error) {
      console.error('Failed to schedule content:', error)
      throw error
    }
  },

  getContentAnalytics: async (contentId: string, params: any = {}) => {
    try {
      const queryParams = new URLSearchParams()
      if (params.startDate) queryParams.append('startDate', params.startDate)
      if (params.endDate) queryParams.append('endDate', params.endDate)
      
      const response = await api.get(`/contents/${contentId}/analytics?${queryParams.toString()}`)
      return response
    } catch (error) {
      console.error('Failed to fetch content analytics:', error)
      throw error
    }
  },

  getContentCategories: async (websiteId: string) => {
    try {
      const response = await api.get(`/websites/${websiteId}/content-categories`)
      return response
    } catch (error) {
      console.error('Failed to fetch content categories:', error)
      throw error
    }
  },

  createContentCategory: async (websiteId: string, data: any) => {
    try {
      const response = await api.post(`/websites/${websiteId}/content-categories`, data)
      return response
    } catch (error) {
      console.error('Failed to create content category:', error)
      throw error
    }
  },

  updateContentCategory: async (categoryId: string, data: any) => {
    try {
      const response = await api.put(`/content-categories/${categoryId}`, data)
      return response
    } catch (error) {
      console.error('Failed to update content category:', error)
      throw error
    }
  },

  deleteContentCategory: async (categoryId: string) => {
    try {
      const response = await api.delete(`/content-categories/${categoryId}`)
      return response
    } catch (error) {
      console.error('Failed to delete content category:', error)
      throw error
    }
  },

  getContentTemplates: async () => {
    try {
      const response = await api.get('/content-templates')
      return response
    } catch (error) {
      console.error('Failed to fetch content templates:', error)
      throw error
    }
  },

  createContentFromTemplate: async (websiteId: string, templateId: string, data: any) => {
    try {
      const response = await api.post(`/websites/${websiteId}/contents/from-template`, {
        templateId,
        ...data
      })
      return response
    } catch (error) {
      console.error('Failed to create content from template:', error)
      throw error
    }
  },

  optimizeContentSEO: async (contentId: string) => {
    try {
      const response = await api.post(`/contents/${contentId}/optimize-seo`)
      return response
    } catch (error) {
      console.error('Failed to optimize content SEO:', error)
      throw error
    }
  },

  generateContentSuggestions: async (contentId: string, data: any) => {
    try {
      const response = await api.post(`/contents/${contentId}/suggestions`, data)
      return response
    } catch (error) {
      console.error('Failed to generate content suggestions:', error)
      throw error
    }
  },

  translateContent: async (contentId: string, data: any) => {
    try {
      const response = await api.post(`/contents/${contentId}/translate`, data)
      return response
    } catch (error) {
      console.error('Failed to translate content:', error)
      throw error
    }
  },

  // Create standardized API response
  createResponse: (data: any, message?: string) => ({
    success: true,
    data,
    message: message || 'Operation completed successfully',
    timestamp: new Date().toISOString()
  }),

  // Design System
  getDesignSystems: async (websiteId: string) => {
    try {
      const response = await api.get(`/design-systems/${websiteId}`)
      return response
    } catch (error) {
      console.error('Failed to get design systems:', error)
      throw error
    }
  },

  createDesignSystem: async (websiteId: string, data: any) => {
    try {
      const response = await api.post(`/design-systems/${websiteId}`, data)
      return response
    } catch (error) {
      console.error('Failed to create design system:', error)
      throw error
    }
  },

  updateDesignSystem: async (designSystemId: string, data: any) => {
    try {
      const response = await api.put(`/design-systems/${designSystemId}`, data)
      return response
    } catch (error) {
      console.error('Failed to update design system:', error)
      throw error
    }
  },

  deleteDesignSystem: async (designSystemId: string) => {
    try {
      const response = await api.delete(`/design-systems/${designSystemId}`)
      return response
    } catch (error) {
      console.error('Failed to delete design system:', error)
      throw error
    }
  },

  generateDesignSystem: async (websiteId: string, data: any) => {
    try {
      const response = await api.post(`/design-systems/${websiteId}/generate`, data)
      return response
    } catch (error) {
      console.error('Failed to generate design system:', error)
      throw error
    }
  },

  generateAIDesignSystem: async (websiteId: string, data: any) => {
    try {
      const response = await api.post(`/design-systems/${websiteId}/ai-generate`, data)
      return response
    } catch (error) {
      console.error('Failed to generate AI design system:', error)
      throw error
    }
  },

  applyDesignSystem: async (systemId: string, data: any) => {
    try {
      const response = await api.post(`/design-systems/${systemId}/apply`, data)
      return response
    } catch (error) {
      console.error('Failed to apply design system:', error)
      throw error
    }
  },

  // AI Website Assistant
  generateColors: async (data: any) => {
    try {
      const response = await api.post('/ai/website/colors', data)
      return response
    } catch (error) {
      console.error('Failed to generate colors:', error)
      throw error
    }
  },

  generateLayout: async (data: any) => {
    try {
      const response = await api.post('/ai/website/layout', data)
      return response
    } catch (error) {
      console.error('Failed to generate layout:', error)
      throw error
    }
  },

  generateContent: async (data: any) => {
    try {
      const response = await api.post('/ai/website/content', data)
      return response
    } catch (error) {
      console.error('Failed to generate content:', error)
      throw error
    }
  },

  generateImages: async (data: any) => {
    try {
      const response = await api.post('/ai/website/images', data)
      return response
    } catch (error) {
      console.error('Failed to generate images:', error)
      throw error
    }
  },

  generateWebsite: async (data: any) => {
    try {
      const response = await api.post('/ai/website/generate', data)
      return response
    } catch (error) {
      console.error('Failed to generate website:', error)
      throw error
    }
  },

  // PWA Settings
  getPwaSettings: async (websiteId: string) => {
    try {
      const response = await api.get(`/pwa/settings/${websiteId}`)
      return response
    } catch (error) {
      console.error('Failed to get PWA settings:', error)
      throw error
    }
  },

  updatePwaSettings: async (websiteId: string, data: any) => {
    try {
      const response = await api.put(`/pwa/settings/${websiteId}`, data)
      return response
    } catch (error) {
      console.error('Failed to update PWA settings:', error)
      throw error
    }
  },

  generatePwaManifest: async (websiteId: string) => {
    try {
      const response = await api.post(`/pwa/manifest/${websiteId}`)
      return response
    } catch (error) {
      console.error('Failed to generate PWA manifest:', error)
      throw error
    }
  },

  generateServiceWorker: async (websiteId: string) => {
    try {
      const response = await api.post(`/pwa/service-worker/${websiteId}`)
      return response
    } catch (error) {
      console.error('Failed to generate service worker:', error)
      throw error
    }
  },

  // Create standardized error response
  createErrorResponse: (message: string, code: string = 'UNKNOWN_ERROR') => ({
    success: false,
    error: {
      message,
      code,
      timestamp: new Date().toISOString()
    }
  }),

  // Check if response is successful
  isSuccess: (response: any) => response?.data?.success === true,

  // Extract data from response
  extractData: (response: any) => response?.data?.data,

  // Extract error from response
  extractError: (response: any) => response?.data?.error
}

// Export default API instance
export default api
