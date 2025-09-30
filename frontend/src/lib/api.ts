import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'

export const api = axios.create({
  baseURL: `${API_URL}/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

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

  // Create standardized API response
  createResponse: (data: any, message?: string) => ({
    success: true,
    data,
    message: message || 'Operation completed successfully',
    timestamp: new Date().toISOString()
  }),

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
