export interface Product {
  id: string
  name: string
  description: string
  price: number
  comparePrice?: number
  sku?: string
  images: string[]
  variants?: ProductVariant[]
  inventory: {
    track: boolean
    quantity: number
    allowBackorder: boolean
  }
  seo: {
    title: string
    description: string
    handle: string
  }
  status: 'active' | 'draft' | 'archived'
  category?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  title: string
  price: number
  sku?: string
  inventory: number
  options: Record<string, string>
  image?: string
}

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  quantity: number
  price: number
  title: string
  image?: string
  options?: Record<string, string>
}

export interface ShoppingCart {
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
  discountCode?: string
}

export interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  items: OrderItem[]
  customer: Customer
  shippingAddress: Address
  billingAddress?: Address
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
  notes?: string
  trackingNumber?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  variantId?: string
  quantity: number
  price: number
  title: string
  image?: string
  sku?: string
}

export interface Customer {
  id?: string
  email: string
  name?: string
  phone?: string
  addresses?: Address[]
  orders?: Order[]
  createdAt?: string
}

export interface Address {
  id?: string
  name: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  isDefault?: boolean
}

export interface PaymentMethod {
  id: string
  type: 'stripe' | 'jazzcash' | 'easypaisa' | 'bank_transfer'
  name: string
  description: string
  logo?: string
  enabled: boolean
  config?: Record<string, any>
}

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
  enabled: boolean
}

export interface DiscountCode {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrderAmount?: number
  maxDiscount?: number
  usageLimit?: number
  usedCount: number
  expiresAt?: string
  enabled: boolean
}

export interface Category {
  id: string
  name: string
  description?: string
  slug: string
  image?: string
  parentId?: string
  children?: Category[]
  productCount: number
  seo: {
    title: string
    description: string
  }
}

export interface Collection {
  id: string
  name: string
  description?: string
  slug: string
  image?: string
  products: Product[]
  rules?: {
    type: 'manual' | 'automatic'
    conditions?: any[]
  }
  seo: {
    title: string
    description: string
  }
}

export interface Review {
  id: string
  productId: string
  customerName: string
  customerEmail: string
  rating: number
  title?: string
  content?: string
  verified: boolean
  helpful: number
  createdAt: string
}

export interface Wishlist {
  id: string
  customerId: string
  products: Product[]
  createdAt: string
  updatedAt: string
}

export interface Inventory {
  productId: string
  variantId?: string
  quantity: number
  reserved: number
  available: number
  lowStockThreshold: number
  trackQuantity: boolean
  allowBackorder: boolean
  updatedAt: string
}

export interface EcommerceSettings {
  currency: string
  taxSettings: {
    enabled: boolean
    rate: number
    inclusive: boolean
  }
  shippingSettings: {
    enabled: boolean
    methods: ShippingMethod[]
    freeShippingThreshold?: number
  }
  paymentSettings: {
    methods: PaymentMethod[]
    testMode: boolean
  }
  checkoutSettings: {
    guestCheckout: boolean
    termsRequired: boolean
    newsletterOptIn: boolean
  }
  inventorySettings: {
    trackInventory: boolean
    allowBackorder: boolean
    lowStockNotifications: boolean
  }
}
