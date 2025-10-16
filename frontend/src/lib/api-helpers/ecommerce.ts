import { api } from './api'

export interface ProductFilters {
  websiteId?: string
  status?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface OrderFilters {
  websiteId?: string
  status?: string
  paymentStatus?: string
  customerEmail?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CustomerFilters {
  websiteId?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface AnalyticsFilters {
  websiteId?: string
  period?: 'day' | 'week' | 'month' | 'year'
  dateFrom?: string
  dateTo?: string
}

export const ecommerceApi = {
  // Products
  getProducts: async (filters: ProductFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })
    
    const response = await api.get(`/products?${params}`)
    return response.data
  },

  getProduct: async (id: string) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  createProduct: async (productData: any) => {
    const response = await api.post('/products', productData)
    return response.data
  },

  updateProduct: async (id: string, productData: any) => {
    const response = await api.put(`/products/${id}`, productData)
    return response.data
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },

  addProductVariants: async (id: string, variants: any[]) => {
    const response = await api.post(`/products/${id}/variants`, { variants })
    return response.data
  },

  bulkUpdateProducts: async (productIds: string[], updates: any) => {
    const response = await api.put('/products/bulk-update', { productIds, updates })
    return response.data
  },

  // Orders
  getOrders: async (filters: OrderFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })
    
    const response = await api.get(`/orders?${params}`)
    return response.data
  },

  getOrder: async (id: string) => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  createOrder: async (orderData: any) => {
    const response = await api.post('/orders', orderData)
    return response.data
  },

  updateOrderStatus: async (id: string, status: string, notes?: string) => {
    const response = await api.put(`/orders/${id}/status`, { status, notes })
    return response.data
  },

  addOrderTracking: async (id: string, trackingData: any) => {
    const response = await api.put(`/orders/${id}/tracking`, trackingData)
    return response.data
  },

  getOrderAnalytics: async (filters: AnalyticsFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })
    
    const response = await api.get(`/orders/analytics?${params}`)
    return response.data
  },

  // Customers
  getCustomers: async (filters: CustomerFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })
    
    const response = await api.get(`/customers?${params}`)
    return response.data
  },

  getCustomer: async (id: string) => {
    const response = await api.get(`/customers/${id}`)
    return response.data
  },

  getCustomerOrders: async (id: string, filters: any = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })
    
    const response = await api.get(`/customers/${id}/orders?${params}`)
    return response.data
  },

  updateCustomer: async (id: string, customerData: any) => {
    const response = await api.put(`/customers/${id}`, customerData)
    return response.data
  },

  // E-commerce Settings
  getEcommerceSettings: async (websiteId: string) => {
    const response = await api.get(`/websites/${websiteId}/ecommerce/settings`)
    return response.data
  },

  updateEcommerceSettings: async (websiteId: string, settingsData: any) => {
    const response = await api.put(`/websites/${websiteId}/ecommerce/settings`, settingsData)
    return response.data
  },

  enableEcommerce: async (websiteId: string) => {
    const response = await api.post(`/websites/${websiteId}/ecommerce/enable`, {})
    return response.data
  },

  disableEcommerce: async (websiteId: string) => {
    const response = await api.post(`/websites/${websiteId}/ecommerce/disable`, {})
    return response.data
  },

  // Store Payments (separate from platform billing)
  processCheckout: async (checkoutData: any) => {
    const response = await api.post('/store-payments/checkout', checkoutData)
    return response.data
  },

  processRefund: async (refundData: any) => {
    const response = await api.post('/store-payments/refund', refundData)
    return response.data
  },

  getTransactions: async (filters: any = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })
    
    const response = await api.get(`/store-payments/transactions?${params}`)
    return response.data
  }
}
