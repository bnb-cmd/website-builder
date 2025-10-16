import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Product {
  id: string
  websiteId: string
  name: string
  description?: string
  price: number
  comparePrice?: number
  sku?: string
  trackInventory: boolean
  inventory: number
  lowStockThreshold: number
  allowBackorder: boolean
  images?: string[]
  videos?: string[]
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK'
  hasVariants: boolean
  variants?: any
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  websiteId: string
  orderNumber: string
  customerId?: string
  customerEmail: string
  customerName?: string
  customerPhone?: string
  shippingAddress: any
  billingAddress?: any
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED'
  paymentMethod?: string
  paymentId?: string
  shippingStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  product: Product
}

export interface Customer {
  id: string
  email: string
  name?: string
  phone?: string
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  firstOrder: string
  lastOrder: string
  orders?: Order[]
}

export interface EcommerceSettings {
  id: string
  websiteId: string
  storeName?: string
  storeDescription?: string
  currency: string
  taxRate: number
  shippingEnabled: boolean
  stripeEnabled: boolean
  stripePublicKey?: string
  stripeSecretKey?: string
  jazzcashEnabled: boolean
  jazzcashMerchantId?: string
  jazzcashSecretKey?: string
  easypaisaEnabled: boolean
  easypaisaMerchantId?: string
  easypaisaSecretKey?: string
  freeShippingThreshold?: number
  flatShippingRate?: number
  localDeliveryEnabled: boolean
  lowStockAlert: boolean
  lowStockThreshold: number
  guestCheckoutEnabled: boolean
  cartAbandonmentEmail: boolean
  orderConfirmationEmail: boolean
  shippingNotificationEmail: boolean
  createdAt: string
  updatedAt: string
}

export interface EcommerceAnalytics {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  ordersByStatus: Record<string, number>
  revenueByPeriod: Array<{ period: string; revenue: number }>
  topProducts: Array<{ productId: string; name: string; sales: number; revenue: number }>
  ordersByDay: Array<{ date: string; orders: number; revenue: number }>
}

interface EcommerceState {
  // Data
  products: Product[]
  orders: Order[]
  customers: Customer[]
  settings: EcommerceSettings | null
  analytics: EcommerceAnalytics | null
  
  // UI State
  selectedWebsite: string | null
  isLoading: boolean
  error: string | null
  
  // Filters
  productFilters: {
    status?: string
    search?: string
    page: number
    limit: number
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }
  
  orderFilters: {
    status?: string
    paymentStatus?: string
    customerEmail?: string
    dateFrom?: string
    dateTo?: string
    page: number
    limit: number
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }
  
  customerFilters: {
    search?: string
    page: number
    limit: number
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }

  // Actions
  setSelectedWebsite: (websiteId: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Products
  fetchProducts: () => Promise<void>
  createProduct: (product: Partial<Product>) => Promise<Product>
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product>
  deleteProduct: (id: string) => Promise<void>
  bulkUpdateProducts: (productIds: string[], updates: any) => Promise<void>
  
  // Orders
  fetchOrders: () => Promise<void>
  createOrder: (order: Partial<Order>) => Promise<Order>
  updateOrderStatus: (id: string, status: string, notes?: string) => Promise<Order>
  addTracking: (id: string, trackingData: any) => Promise<Order>
  fetchOrderAnalytics: () => Promise<void>
  
  // Customers
  fetchCustomers: () => Promise<void>
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<Customer>
  
  // Settings
  fetchSettings: (websiteId: string) => Promise<void>
  updateSettings: (websiteId: string, settings: Partial<EcommerceSettings>) => Promise<EcommerceSettings>
  enableEcommerce: (websiteId: string) => Promise<void>
  disableEcommerce: (websiteId: string) => Promise<void>
  
  // Filters
  setProductFilters: (filters: Partial<EcommerceState['productFilters']>) => void
  setOrderFilters: (filters: Partial<EcommerceState['orderFilters']>) => void
  setCustomerFilters: (filters: Partial<EcommerceState['customerFilters']>) => void
}

export const useEcommerceStore = create<EcommerceState>()(
  persist(
    (set, get) => ({
      // Initial state
      products: [],
      orders: [],
      customers: [],
      settings: null,
      analytics: null,
      selectedWebsite: null,
      isLoading: false,
      error: null,
      
      productFilters: {
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      },
      
      orderFilters: {
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      },
      
      customerFilters: {
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      },

      // Basic actions
      setSelectedWebsite: (websiteId) => set({ selectedWebsite: websiteId }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // Products
      fetchProducts: async () => {
        set({ isLoading: true, error: null })
        try {
          const { selectedWebsite, productFilters } = get()
          if (!selectedWebsite) {
            set({ products: [], isLoading: false })
            return
          }

          const params = new URLSearchParams({
            websiteId: selectedWebsite,
            page: productFilters.page.toString(),
            limit: productFilters.limit.toString(),
            sortBy: productFilters.sortBy,
            sortOrder: productFilters.sortOrder
          })

          if (productFilters.status) params.append('status', productFilters.status)
          if (productFilters.search) params.append('search', productFilters.search)

          const response = await fetch(`/api/v1/products?${params}`)
          const data = await response.json()

          if (data.success) {
            set({ products: data.data.products, isLoading: false })
          } else {
            set({ error: data.error, isLoading: false })
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      createProduct: async (productData) => {
        set({ isLoading: true, error: null })
        try {
          const { selectedWebsite } = get()
          if (!selectedWebsite) throw new Error('No website selected')

          const response = await fetch('/api/v1/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...productData, websiteId: selectedWebsite })
          })

          const data = await response.json()
          if (data.success) {
            const newProduct = data.data
            set(state => ({ 
              products: [newProduct, ...state.products], 
              isLoading: false 
            }))
            return newProduct
          } else {
            throw new Error(data.error)
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
          throw error
        }
      },

      updateProduct: async (id, productData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`/api/v1/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
          })

          const data = await response.json()
          if (data.success) {
            const updatedProduct = data.data
            set(state => ({
              products: state.products.map(p => p.id === id ? updatedProduct : p),
              isLoading: false
            }))
            return updatedProduct
          } else {
            throw new Error(data.error)
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
          throw error
        }
      },

      deleteProduct: async (id) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`/api/v1/products/${id}`, {
            method: 'DELETE'
          })

          const data = await response.json()
          if (data.success) {
            set(state => ({
              products: state.products.filter(p => p.id !== id),
              isLoading: false
            }))
          } else {
            throw new Error(data.error)
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
          throw error
        }
      },

      bulkUpdateProducts: async (productIds, updates) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch('/api/v1/products/bulk-update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productIds, updates })
          })

          const data = await response.json()
          if (data.success) {
            // Refresh products after bulk update
            await get().fetchProducts()
          } else {
            throw new Error(data.error)
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
          throw error
        }
      },

      // Orders
      fetchOrders: async () => {
        set({ isLoading: true, error: null })
        try {
          const { selectedWebsite, orderFilters } = get()
          if (!selectedWebsite) {
            set({ orders: [], isLoading: false })
            return
          }

          const params = new URLSearchParams({
            websiteId: selectedWebsite,
            page: orderFilters.page.toString(),
            limit: orderFilters.limit.toString(),
            sortBy: orderFilters.sortBy,
            sortOrder: orderFilters.sortOrder
          })

          if (orderFilters.status) params.append('status', orderFilters.status)
          if (orderFilters.paymentStatus) params.append('paymentStatus', orderFilters.paymentStatus)
          if (orderFilters.customerEmail) params.append('customerEmail', orderFilters.customerEmail)
          if (orderFilters.dateFrom) params.append('dateFrom', orderFilters.dateFrom)
          if (orderFilters.dateTo) params.append('dateTo', orderFilters.dateTo)

          const response = await fetch(`/api/v1/orders?${params}`)
          const data = await response.json()

          if (data.success) {
            set({ orders: data.data.orders, isLoading: false })
          } else {
            set({ error: data.error, isLoading: false })
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      createOrder: async (orderData) => {
        set({ isLoading: true, error: null })
        try {
          const { selectedWebsite } = get()
          if (!selectedWebsite) throw new Error('No website selected')

          const response = await fetch('/api/v1/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...orderData, websiteId: selectedWebsite })
          })

          const data = await response.json()
          if (data.success) {
            const newOrder = data.data
            set(state => ({ 
              orders: [newOrder, ...state.orders], 
              isLoading: false 
            }))
            return newOrder
          } else {
            throw new Error(data.error)
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
          throw error
        }
      },

      updateOrderStatus: async (id, status, notes) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`/api/v1/orders/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, notes })
          })

          const data = await response.json()
          if (data.success) {
            const updatedOrder = data.data
            set(state => ({
              orders: state.orders.map(o => o.id === id ? updatedOrder : o),
              isLoading: false
            }))
            return updatedOrder
          } else {
            throw new Error(data.error)
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
          throw error
        }
      },

      addTracking: async (id, trackingData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`/api/v1/orders/${id}/tracking`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trackingData)
          })

          const data = await response.json()
          if (data.success) {
            const updatedOrder = data.data
            set(state => ({
              orders: state.orders.map(o => o.id === id ? updatedOrder : o),
              isLoading: false
            }))
            return updatedOrder
          } else {
            throw new Error(data.error)
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
          throw error
        }
      },

      fetchOrderAnalytics: async () => {
        set({ isLoading: true, error: null })
        try {
          const { selectedWebsite } = get()
          if (!selectedWebsite) {
            set({ analytics: null, isLoading: false })
            return
          }

          const params = new URLSearchParams({ websiteId: selectedWebsite })
          const response = await fetch(`/api/v1/orders/analytics?${params}`)
          const data = await response.json()

          if (data.success) {
            set({ analytics: data.data, isLoading: false })
          } else {
            set({ error: data.error, isLoading: false })
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      // Customers
      fetchCustomers: async () => {
        set({ isLoading: true, error: null })
        try {
          const { selectedWebsite, customerFilters } = get()
          if (!selectedWebsite) {
            set({ customers: [], isLoading: false })
            return
          }

          const params = new URLSearchParams({
            websiteId: selectedWebsite,
            page: customerFilters.page.toString(),
            limit: customerFilters.limit.toString(),
            sortBy: customerFilters.sortBy,
            sortOrder: customerFilters.sortOrder
          })

          if (customerFilters.search) params.append('search', customerFilters.search)

          const response = await fetch(`/api/v1/customers?${params}`)
          const data = await response.json()

          if (data.success) {
            set({ customers: data.data.customers, isLoading: false })
          } else {
            set({ error: data.error, isLoading: false })
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      updateCustomer: async (id, customerData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`/api/v1/customers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customerData)
          })

          const data = await response.json()
          if (data.success) {
            const updatedCustomer = data.data
            set(state => ({
              customers: state.customers.map(c => c.id === id ? updatedCustomer : c),
              isLoading: false
            }))
            return updatedCustomer
          } else {
            throw new Error(data.error)
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
          throw error
        }
      },

      // Settings
      fetchSettings: async (websiteId) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`/api/v1/websites/${websiteId}/ecommerce/settings`)
          const data = await response.json()

          if (data.success) {
            set({ settings: data.data, isLoading: false })
          } else {
            set({ error: data.error, isLoading: false })
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      updateSettings: async (websiteId, settingsData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`/api/v1/websites/${websiteId}/ecommerce/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settingsData)
          })

          const data = await response.json()
          if (data.success) {
            set({ settings: data.data, isLoading: false })
            return data.data
          } else {
            throw new Error(data.error)
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
          throw error
        }
      },

      enableEcommerce: async (websiteId) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`/api/v1/websites/${websiteId}/ecommerce/enable`, {
            method: 'POST'
          })

          const data = await response.json()
          if (data.success) {
            set({ settings: data.data, isLoading: false })
          } else {
            throw new Error(data.error)
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
          throw error
        }
      },

      disableEcommerce: async (websiteId) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`/api/v1/websites/${websiteId}/ecommerce/disable`, {
            method: 'POST'
          })

          const data = await response.json()
          if (data.success) {
            set({ settings: data.data, isLoading: false })
          } else {
            throw new Error(data.error)
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
          throw error
        }
      },

      // Filters
      setProductFilters: (filters) => {
        set(state => ({
          productFilters: { ...state.productFilters, ...filters }
        }))
      },

      setOrderFilters: (filters) => {
        set(state => ({
          orderFilters: { ...state.orderFilters, ...filters }
        }))
      },

      setCustomerFilters: (filters) => {
        set(state => ({
          customerFilters: { ...state.customerFilters, ...filters }
        }))
      }
    }),
    {
      name: 'ecommerce-store',
      partialize: (state) => ({
        selectedWebsite: state.selectedWebsite,
        productFilters: state.productFilters,
        orderFilters: state.orderFilters,
        customerFilters: state.customerFilters
      })
    }
  )
)
