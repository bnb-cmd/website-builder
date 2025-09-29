import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'

export const api = axios.create({
  baseURL: `${API_URL}/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Enable auth headers for real authentication
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
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
    profile: '/auth/profile',
    changePassword: '/auth/change-password',
  },
  websites: {
    list: '/websites',
    create: '/websites',
    get: (id: string) => `/websites/${id}`,
    update: (id: string) => `/websites/${id}`,
    delete: (id: string) => `/websites/${id}`,
    publish: (id: string) => `/websites/${id}/publish`,
    duplicate: (id: string) => `/websites/${id}/duplicate`,
  },
  templates: {
    list: '/templates',
    get: (id: string) => `/templates/${id}`,
  },
  advancedTemplates: {
    list: '/advanced-templates/catalog',
    get: (id: string) => `/advanced-templates/templates/${id}`,
  },
  ai: {
    generateContent: '/ai/generate-content',
    optimizeSEO: '/ai/optimize-seo',
    generateColors: '/ai/generate-colors',
    suggestTemplates: '/ai/suggest-templates',
    stats: '/ai/stats',
  },
  users: {
    profile: '/users/profile',
    subscription: '/users/subscription',
  },
  payments: {
    createIntent: '/payments/create-intent',
    confirm: '/payments/confirm',
    history: '/payments/history',
  },
  admin: {
    stats: '/admin/stats',
    users: '/admin/users',
  },
  
  pwa: {
    settings: (websiteId: string) => `/${websiteId}/pwa`,
  },
  
  analytics: {
    data: (websiteId: string) => `/${websiteId}`,
    insights: (websiteId: string) => `/${websiteId}/insights`,
  },
  
  marketing: {
    campaigns: (websiteId: string) => `/${websiteId}/campaigns`,
    campaignStatus: (campaignId: string) => `/campaigns/${campaignId}/status`,
    campaignMetrics: (campaignId: string) => `/campaigns/${campaignId}/metrics`,
    messages: '/messages',
  },
  
  integrations: {
    list: '/',
    installed: (websiteId: string) => `/${websiteId}/installed`,
    install: (websiteId: string) => `/${websiteId}/install`,
    config: (websiteIntegrationId: string) => `/website/${websiteIntegrationId}/config`,
    toggle: (websiteIntegrationId: string) => `/website/${websiteIntegrationId}/toggle`,
    uninstall: (websiteIntegrationId: string) => `/website/${websiteIntegrationId}`,
    test: (websiteIntegrationId: string) => `/website/${websiteIntegrationId}/test`,
  },
  
  media: {
    assets: (websiteId: string) => `/${websiteId}/assets`,
    aiGenerate: (websiteId: string) => `/${websiteId}/ai-generate`,
    videoProjects: (websiteId: string) => `/${websiteId}/video-projects`,
    updateProject: (projectId: string) => `/video-projects/${projectId}`,
    addClip: (projectId: string) => `/video-projects/${projectId}/clips`,
    updateClip: (clipId: string) => `/video-clips/${clipId}`,
    deleteClip: (clipId: string) => `/video-clips/${clipId}`,
    exportVideo: (projectId: string) => `/video-projects/${projectId}/export`,
  },
  
  designSystems: {
    list: (websiteId: string) => `/${websiteId}`,
    create: (websiteId: string) => `/${websiteId}`,
    aiGenerate: (websiteId: string) => `/${websiteId}/ai-generate`,
    update: (designSystemId: string) => `/${designSystemId}`,
    apply: (designSystemId: string) => `/${designSystemId}/apply`,
  },
  
  agency: {
    create: '/',
    myAgency: '/my-agency',
    update: (agencyId: string) => `/${agencyId}`,
    clients: (agencyId: string) => `/${agencyId}/clients`,
    addClient: '/clients',
    updateClient: (clientId: string) => `/clients/${clientId}`,
    removeClient: (clientId: string) => `/clients/${clientId}`,
    stats: (agencyId: string) => `/${agencyId}/stats`,
    whiteLabelConfig: (agencyId: string) => `/${agencyId}/white-label-config`,
    upgradePlan: (agencyId: string) => `/${agencyId}/upgrade-plan`,
  },
  
  advancedAI: {
    aiSessions: (websiteId: string) => `/ai-sessions/${websiteId}`,
    createAISession: '/ai-sessions',
    sendAIMessage: (sessionId: string) => `/ai-sessions/${sessionId}/message`,
    arvrContent: (websiteId: string) => `/arvr-content/${websiteId}`,
    createARVRContent: '/arvr-content',
    processARVRContent: (contentId: string) => `/arvr-content/${contentId}/process`,
    generateARVRContent: '/arvr-content/generate',
    generateCode: '/generate-code',
    analyzeWebsite: '/analyze-website',
  },
  
  blockchain: {
    wallets: '/wallets',
    createWallet: '/wallets',
    updateWalletBalance: (walletId: string) => `/wallets/${walletId}/balance`,
    nftCollections: '/nft-collections',
    createNFTCollection: '/nft-collections',
    mintNFT: (collectionId: string) => `/nft-collections/${collectionId}/mint`,
    smartContracts: '/smart-contracts',
    createSmartContract: '/smart-contracts',
    interactWithContract: (contractId: string) => `/smart-contracts/${contractId}/interact`,
    web3Integrations: '/web3-integrations',
    createWeb3Integration: '/web3-integrations',
    transactions: '/transactions',
    getTransactions: (walletId: string) => `/wallets/${walletId}/transactions`,
    getWalletAnalytics: (walletId: string) => `/wallets/${walletId}/analytics`,
  },
  
  notifications: {
    create: '/notifications',
    createFromTemplate: '/notifications/template',
    getNotifications: '/notifications',
    markAsRead: (notificationId: string) => `/notifications/${notificationId}/read`,
    markAllAsRead: '/notifications/read-all',
    getPreferences: (userId: string) => `/preferences/${userId}`,
    updatePreferences: (userId: string) => `/preferences/${userId}`,
    createTemplate: '/templates',
    createDigest: '/digests',
    getAnalytics: (userId: string) => `/analytics/${userId}`,
  },

  content: {
    createContent: (websiteId: string) => `/websites/${websiteId}/contents`,
    getContents: (websiteId: string) => `/websites/${websiteId}/contents`,
    updateContent: (contentId: string) => `/contents/${contentId}`,
    deleteContent: (contentId: string) => `/contents/${contentId}`,
    getCategories: (websiteId: string) => `/websites/${websiteId}/content-categories`,
    createCategory: (websiteId: string) => `/websites/${websiteId}/content-categories`,
    scheduleContent: (contentId: string) => `/contents/${contentId}/schedule`,
    optimizeSEO: (contentId: string) => `/contents/${contentId}/optimize-seo`,
    getTemplates: '/content-templates',
    createTemplate: '/content-templates',
    useTemplate: (templateId: string) => `/content-templates/${templateId}/use`,
    getAnalytics: (contentId: string) => `/contents/${contentId}/analytics`,
    updateAnalytics: (contentId: string) => `/contents/${contentId}/analytics`,
    getInsights: (websiteId: string) => `/websites/${websiteId}/content-insights`,
  },

  integrations: {
    list: '/integrations',
    get: (id: string) => `/integrations/${id}`,
    install: (websiteId: string) => `/websites/${websiteId}/integrations`,
    configure: (id: string) => `/website-integrations/${id}`,
    uninstall: (id: string) => `/website-integrations/${id}`,
    getWebsite: (websiteId: string) => `/websites/${websiteId}/integrations`,
    sync: (id: string) => `/website-integrations/${id}/sync`,
    createWebhook: (integrationId: string) => `/website-integrations/${integrationId}/webhooks`,
    getLogs: (integrationId: string) => `/website-integrations/${integrationId}/logs`,
    createReview: (integrationId: string) => `/integrations/${integrationId}/reviews`,
    getCategories: '/integration-categories',
    getAnalytics: (integrationId: string) => `/website-integrations/${integrationId}/analytics`,
  },

  performance: {
    optimizeImage: '/optimize-image',
    generateVariants: '/generate-image-variants',
    minifyJS: '/minify/javascript',
    minifyCSS: '/minify/css',
    bundleAnalysis: (websiteId: string) => `/websites/${websiteId}/bundle-analysis`,
    coreWebVitals: (websiteId: string) => `/websites/${websiteId}/core-web-vitals`,
    recommendations: (websiteId: string) => `/websites/${websiteId}/performance-recommendations`,
    lazyLoading: (websiteId: string) => `/websites/${websiteId}/implement-lazy-loading`,
    criticalCSS: '/extract-critical-css',
    resourceHints: (websiteId: string) => `/websites/${websiteId}/resource-hints`,
    monitoring: (websiteId: string) => `/websites/${websiteId}/setup-monitoring`,
    autoOptimize: (websiteId: string) => `/websites/${websiteId}/auto-optimize`,
    cdnUpload: '/cdn/upload',
    cdnPurge: '/cdn/purge-cache',
  },

  templates: {
    create: '/templates',
    list: '/templates',
    get: (id: string) => `/templates/${id}`,
    update: (id: string) => `/templates/${id}`,
    delete: (id: string) => `/templates/${id}`,
    generateAI: '/templates/generate-ai',
    getGenerationStatus: (generationId: string) => `/templates/ai-generations/${generationId}`,
    createCustomization: (templateId: string) => `/templates/${templateId}/customizations`,
    applyCustomization: (customizationId: string) => `/template-customizations/${customizationId}/apply`,
    createReview: (templateId: string) => `/templates/${templateId}/reviews`,
    purchase: (templateId: string) => `/templates/${templateId}/purchase`,
    getAnalytics: (templateId: string) => `/templates/${templateId}/analytics`,
    getCategories: '/template-categories',
    search: '/templates/search',
  },
}

// API helper functions
export const apiHelpers = {
  // Auth helpers
  login: (email: string, password: string) =>
    api.post(endpoints.auth.login, { email, password }),
  
  register: (data: any) =>
    api.post(endpoints.auth.register, data),
  
  logout: () =>
    api.post(endpoints.auth.logout),
  
  getProfile: () =>
    api.get(endpoints.auth.me),
  
  updateProfile: (data: any) =>
    api.put(endpoints.auth.profile, data),
  
  changePassword: (data: any) =>
    api.put(endpoints.auth.changePassword, data),

  // Website helpers
  getWebsites: (params?: any) =>
    api.get(endpoints.websites.list, { params }),
  
  createWebsite: (data: any) =>
    api.post(endpoints.websites.create, data),
  
  getWebsite: (id: string) =>
    api.get(endpoints.websites.get(id)),
  
  updateWebsite: (id: string, data: any) =>
    api.put(endpoints.websites.update(id), data),
  
  deleteWebsite: (id: string) =>
    api.delete(endpoints.websites.delete(id)),
  
  publishWebsite: (id: string) =>
    api.post(endpoints.websites.publish(id)),
  
  duplicateWebsite: (id: string, name: string) =>
    api.post(endpoints.websites.duplicate(id), { name }),

  // Template helpers
  getTemplates: (params?: any) =>
    api.get(endpoints.templates.list, { params }),
  
  getTemplate: (id: string) =>
    api.get(endpoints.templates.get(id)),

  getAdvancedTemplates: (params?: any) =>
    api.get(endpoints.advancedTemplates.list, { params }),

  getAdvancedTemplate: (id: string) =>
    api.get(endpoints.advancedTemplates.get(id)),

  // AI helpers
  generateContent: (data: any) =>
    api.post(endpoints.ai.generateContent, data),
  
  optimizeSEO: (data: any) =>
    api.post(endpoints.ai.optimizeSEO, data),
  
  generateColors: (data: any) =>
    api.post(endpoints.ai.generateColors, data),
  
  suggestTemplates: (data: any) =>
    api.post(endpoints.ai.suggestTemplates, data),
  
  getAIStats: () =>
    api.get(endpoints.ai.stats),

  // Payment helpers
  createPaymentIntent: (data: any) =>
    api.post(endpoints.payments.createIntent, data),
  
  confirmPayment: (data: any) =>
    api.post(endpoints.payments.confirm, data),
  
  getPaymentHistory: (params?: any) =>
    api.get(endpoints.payments.history, { params }),
    
  // PWA helpers
  getPwaSettings: (websiteId: string) =>
    api.get(endpoints.pwa.settings(websiteId)),
    
  updatePwaSettings: (websiteId: string, data: any) =>
    api.post(endpoints.pwa.settings(websiteId), data),
    
  // Analytics helpers
  getAnalytics: (websiteId: string, params: any) =>
    api.get(endpoints.analytics.data(websiteId), { params }),
    
  getAnalyticsInsights: (websiteId: string) =>
    api.get(endpoints.analytics.insights(websiteId)),
    
  // Marketing helpers
  getMarketingCampaigns: (websiteId: string) =>
    api.get(endpoints.marketing.campaigns(websiteId)),
    
  createMarketingCampaign: (websiteId: string, data: any) =>
    api.post(endpoints.marketing.campaigns(websiteId), data),
    
  updateCampaignStatus: (campaignId: string, data: any) =>
    api.put(endpoints.marketing.campaignStatus(campaignId), data),
    
  getCampaignMetrics: (campaignId: string) =>
    api.get(endpoints.marketing.campaignMetrics(campaignId)),
    
  sendMarketingMessage: (data: any) =>
    api.post(endpoints.marketing.messages, data),
    
  // Integration helpers
  getIntegrations: (params: any) =>
    api.get(endpoints.integrations.list, { params }),
    
  getInstalledIntegrations: (websiteId: string) =>
    api.get(endpoints.integrations.installed(websiteId)),
    
  installIntegration: (websiteId: string, data: any) =>
    api.post(endpoints.integrations.install(websiteId), data),
    
  updateIntegrationConfig: (websiteIntegrationId: string, data: any) =>
    api.put(endpoints.integrations.config(websiteIntegrationId), data),
    
  toggleIntegration: (websiteIntegrationId: string, data: any) =>
    api.put(endpoints.integrations.toggle(websiteIntegrationId), data),
    
  uninstallIntegration: (websiteIntegrationId: string) =>
    api.delete(endpoints.integrations.uninstall(websiteIntegrationId)),
    
  testIntegration: (websiteIntegrationId: string) =>
    api.post(endpoints.integrations.test(websiteIntegrationId)),
    
  // Media helpers
  getMediaAssets: (websiteId: string, params?: any) =>
    api.get(endpoints.media.assets(websiteId), { params }),
    
  generateAIMedia: (websiteId: string, data: any) =>
    api.post(endpoints.media.aiGenerate(websiteId), data),
    
  getVideoProjects: (websiteId: string) =>
    api.get(endpoints.media.videoProjects(websiteId)),
    
  createVideoProject: (websiteId: string, data: any) =>
    api.post(endpoints.media.videoProjects(websiteId), data),
    
  updateVideoProject: (projectId: string, data: any) =>
    api.put(endpoints.media.updateProject(projectId), data),
    
  addVideoClip: (projectId: string, data: any) =>
    api.post(endpoints.media.addClip(projectId), data),
    
  updateVideoClip: (clipId: string, data: any) =>
    api.put(endpoints.media.updateClip(clipId), data),
    
  deleteVideoClip: (clipId: string) =>
    api.delete(endpoints.media.deleteClip(clipId)),
    
  exportVideo: (projectId: string, data: any) =>
    api.post(endpoints.media.exportVideo(projectId), data),
    
  // Design System helpers
  getDesignSystems: (websiteId: string) =>
    api.get(endpoints.designSystems.list(websiteId)),
    
  createDesignSystem: (websiteId: string, data: any) =>
    api.post(endpoints.designSystems.create(websiteId), data),
    
  generateAIDesignSystem: (websiteId: string, data: any) =>
    api.post(endpoints.designSystems.aiGenerate(websiteId), data),
    
  updateDesignSystem: (designSystemId: string, data: any) =>
    api.put(endpoints.designSystems.update(designSystemId), data),
    
  applyDesignSystem: (designSystemId: string, data: any) =>
    api.post(endpoints.designSystems.apply(designSystemId), data),
    
  // Agency helpers
  createAgency: (data: any) =>
    api.post(endpoints.agency.create, data),
    
  getMyAgency: () =>
    api.get(endpoints.agency.myAgency),
    
  updateAgency: (agencyId: string, data: any) =>
    api.put(endpoints.agency.update(agencyId), data),
    
  getAgencyClients: (agencyId: string) =>
    api.get(endpoints.agency.clients(agencyId)),
    
  addAgencyClient: (data: any) =>
    api.post(endpoints.agency.addClient, data),
    
  updateAgencyClient: (clientId: string, data: any) =>
    api.put(endpoints.agency.updateClient(clientId), data),
    
  removeAgencyClient: (clientId: string) =>
    api.delete(endpoints.agency.removeClient(clientId)),
    
  getAgencyStats: (agencyId: string) =>
    api.get(endpoints.agency.stats(agencyId)),
    
  getWhiteLabelConfig: (agencyId: string) =>
    api.get(endpoints.agency.whiteLabelConfig(agencyId)),
    
  upgradeAgencyPlan: (agencyId: string, data: any) =>
    api.put(endpoints.agency.upgradePlan(agencyId), data),

  // Advanced AI helpers
  getAISessions: (websiteId: string) =>
    api.get(endpoints.advancedAI.aiSessions(websiteId)),
    
  createAISession: (data: any) =>
    api.post(endpoints.advancedAI.createAISession, data),
    
  sendAIMessage: (sessionId: string, message: string) =>
    api.post(endpoints.advancedAI.sendAIMessage(sessionId), { message }),
    
  getARVRContent: (websiteId: string) =>
    api.get(endpoints.advancedAI.arvrContent(websiteId)),
    
  createARVRContent: (data: any) =>
    api.post(endpoints.advancedAI.createARVRContent, data),
    
  processARVRContent: (contentId: string) =>
    api.post(endpoints.advancedAI.processARVRContent(contentId)),
    
  generateARVRContent: (data: any) =>
    api.post(endpoints.advancedAI.generateARVRContent, data),
    
  generateCodeFromDescription: (description: string, language: string) =>
    api.post(endpoints.advancedAI.generateCode, { description, language }),
    
  analyzeWebsitePerformance: (websiteId: string) =>
    api.post(endpoints.advancedAI.analyzeWebsite, { websiteId }),

  // Blockchain helpers
  getWallets: (userId?: string, websiteId?: string) =>
    api.get(endpoints.blockchain.wallets, { params: { userId, websiteId } }),
    
  createWallet: (data: any) =>
    api.post(endpoints.blockchain.createWallet, data),
    
  updateWalletBalance: (walletId: string, balance: number) =>
    api.put(endpoints.blockchain.updateWalletBalance(walletId), { balance }),
    
  getNFTCollections: (userId?: string, websiteId?: string) =>
    api.get(endpoints.blockchain.nftCollections, { params: { userId, websiteId } }),
    
  createNFTCollection: (data: any) =>
    api.post(endpoints.blockchain.createNFTCollection, data),
    
  mintNFT: (collectionId: string, data: any) =>
    api.post(endpoints.blockchain.mintNFT(collectionId), data),
    
  getSmartContracts: (userId?: string, websiteId?: string) =>
    api.get(endpoints.blockchain.smartContracts, { params: { userId, websiteId } }),
    
  createSmartContract: (data: any) =>
    api.post(endpoints.blockchain.createSmartContract, data),
    
  interactWithContract: (contractId: string, data: any) =>
    api.post(endpoints.blockchain.interactWithContract(contractId), data),
    
  getWeb3Integrations: (userId?: string, websiteId?: string) =>
    api.get(endpoints.blockchain.web3Integrations, { params: { userId, websiteId } }),
    
  createWeb3Integration: (data: any) =>
    api.post(endpoints.blockchain.createWeb3Integration, data),
    
  recordTransaction: (data: any) =>
    api.post(endpoints.blockchain.transactions, data),
    
  getTransactions: (walletId: string, limit?: number) =>
    api.get(endpoints.blockchain.getTransactions(walletId), { params: { limit } }),
    
  getWalletAnalytics: (walletId: string) =>
    api.get(endpoints.blockchain.getWalletAnalytics(walletId)),

  // Notification helpers
  createNotification: (data: any) =>
    api.post(endpoints.notifications.create, data),
    
  createNotificationFromTemplate: (data: any) =>
    api.post(endpoints.notifications.createFromTemplate, data),
    
  getNotifications: (userId: string, options?: any) =>
    api.get(endpoints.notifications.getNotifications, { 
      params: { userId, ...options } 
    }),
    
  markAsRead: (notificationId: string) =>
    api.put(endpoints.notifications.markAsRead(notificationId)),
    
  markAllAsRead: (userId: string) =>
    api.put(endpoints.notifications.markAllAsRead, { userId }),
    
  getPreferences: (userId: string) =>
    api.get(endpoints.notifications.getPreferences(userId)),
    
  updatePreferences: (userId: string, data: any) =>
    api.put(endpoints.notifications.updatePreferences(userId), data),
    
  createTemplate: (data: any) =>
    api.post(endpoints.notifications.createTemplate, data),
    
  createDigest: (data: any) =>
    api.post(endpoints.notifications.createDigest, data),
    
  getAnalytics: (userId: string, options?: any) =>
    api.get(endpoints.notifications.getAnalytics(userId), { params: options }),

  // Content Management helpers
  createContent: (websiteId: string, data: any) =>
    api.post(endpoints.content.createContent(websiteId), data),

  getContents: (websiteId: string, params?: any) =>
    api.get(endpoints.content.getContents(websiteId), { params }),

  updateContent: (contentId: string, data: any) =>
    api.put(endpoints.content.updateContent(contentId), data),

  deleteContent: (contentId: string) =>
    api.delete(endpoints.content.deleteContent(contentId)),

  getContentCategories: (websiteId: string) =>
    api.get(endpoints.content.getCategories(websiteId)),

  createContentCategory: (websiteId: string, data: any) =>
    api.post(endpoints.content.createCategory(websiteId), data),

  scheduleContent: (contentId: string, data: any) =>
    api.post(endpoints.content.scheduleContent(contentId), data),

  optimizeContentSEO: (contentId: string) =>
    api.post(endpoints.content.optimizeSEO(contentId)),

  getContentTemplates: (params?: any) =>
    api.get(endpoints.content.getTemplates, { params }),

  createContentTemplate: (data: any) =>
    api.post(endpoints.content.createTemplate, data),

  useContentTemplate: (templateId: string) =>
    api.post(endpoints.content.useTemplate(templateId)),

  getContentAnalytics: (contentId: string) =>
    api.get(endpoints.content.getAnalytics(contentId)),

  updateContentAnalytics: (contentId: string, data: any) =>
    api.put(endpoints.content.updateAnalytics(contentId), data),

  getContentInsights: (websiteId: string, params?: any) =>
    api.get(endpoints.content.getInsights(websiteId), { params }),

  // Integration Marketplace helpers
  getIntegrations: (params?: any) =>
    api.get(endpoints.integrations.list, { params }),

  getIntegration: (id: string) =>
    api.get(endpoints.integrations.get(id)),

  installIntegration: (websiteId: string, data: any) =>
    api.post(endpoints.integrations.install(websiteId), data),

  configureIntegration: (id: string, data: any) =>
    api.put(endpoints.integrations.configure(id), data),

  uninstallIntegration: (id: string) =>
    api.delete(endpoints.integrations.uninstall(id)),

  getWebsiteIntegrations: (websiteId: string) =>
    api.get(endpoints.integrations.getWebsite(websiteId)),

  syncIntegration: (id: string) =>
    api.post(endpoints.integrations.sync(id)),

  createWebhook: (integrationId: string, data: any) =>
    api.post(endpoints.integrations.createWebhook(integrationId), data),

  getIntegrationLogs: (integrationId: string, params?: any) =>
    api.get(endpoints.integrations.getLogs(integrationId), { params }),

  createIntegrationReview: (integrationId: string, data: any) =>
    api.post(endpoints.integrations.createReview(integrationId), data),

  getIntegrationCategories: () =>
    api.get(endpoints.integrations.getCategories),

  getIntegrationAnalytics: (integrationId: string, params?: any) =>
    api.get(endpoints.integrations.getAnalytics(integrationId), { params }),

  // Performance Optimization helpers
  optimizeImage: (formData: FormData) =>
    api.post(endpoints.performance.optimizeImage, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  generateImageVariants: (formData: FormData) =>
    api.post(endpoints.performance.generateVariants, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  minifyJavaScript: (data: { code: string }) =>
    api.post(endpoints.performance.minifyJS, data),

  minifyCSS: (data: { css: string }) =>
    api.post(endpoints.performance.minifyCSS, data),

  getBundleAnalysis: (websiteId: string) =>
    api.get(endpoints.performance.bundleAnalysis(websiteId)),

  getCoreWebVitals: (websiteId: string, params?: any) =>
    api.get(endpoints.performance.coreWebVitals(websiteId), { params }),

  getPerformanceRecommendations: (websiteId: string) =>
    api.get(endpoints.performance.recommendations(websiteId)),

  implementLazyLoading: (websiteId: string) =>
    api.post(endpoints.performance.lazyLoading(websiteId)),

  extractCriticalCSS: (data: { html: string; css: string }) =>
    api.post(endpoints.performance.criticalCSS, data),

  getResourceHints: (websiteId: string) =>
    api.get(endpoints.performance.resourceHints(websiteId)),

  setupPerformanceMonitoring: (websiteId: string) =>
    api.post(endpoints.performance.monitoring(websiteId)),

  runAutomatedOptimization: (websiteId: string) =>
    api.post(endpoints.performance.autoOptimize(websiteId)),

  uploadToCDN: (formData: FormData) =>
    api.post(endpoints.performance.cdnUpload, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  purgeCDNCache: (data: { urls: string[] }) =>
    api.post(endpoints.performance.cdnPurge, data),

  // Advanced Template Engine helpers
  createAdvancedTemplate: (data: any) =>
    api.post(endpoints.templates.create, data),

  getAdvancedTemplates: (params?: any) =>
    api.get(endpoints.templates.list, { params }),

  getAdvancedTemplate: (id: string) =>
    api.get(endpoints.templates.get(id)),

  updateAdvancedTemplate: (id: string, data: any) =>
    api.put(endpoints.templates.update(id), data),

  deleteAdvancedTemplate: (id: string) =>
    api.delete(endpoints.templates.delete(id)),

  generateTemplateWithAI: (data: any) =>
    api.post(endpoints.templates.generateAI, data),

  getAIGenerationStatus: (generationId: string) =>
    api.get(endpoints.templates.getGenerationStatus(generationId)),

  createTemplateCustomization: (templateId: string, data: any) =>
    api.post(endpoints.templates.createCustomization(templateId), data),

  applyTemplateCustomization: (customizationId: string) =>
    api.post(endpoints.templates.applyCustomization(customizationId)),

  createTemplateReview: (templateId: string, data: any) =>
    api.post(endpoints.templates.createReview(templateId), data),

  purchaseTemplate: (templateId: string) =>
    api.post(endpoints.templates.purchase(templateId)),

  getTemplateAnalytics: (templateId: string) =>
    api.get(endpoints.templates.getAnalytics(templateId)),

  getTemplateCategories: () =>
    api.get(endpoints.templates.getCategories),

  searchTemplates: (params?: any) =>
    api.get(endpoints.templates.search, { params }),

  // Admin helpers
  getAdminStats: () =>
    api.get(endpoints.admin.stats),
  
  getUsers: (params?: any) =>
    api.get(endpoints.admin.users, { params }),
}

export default api
