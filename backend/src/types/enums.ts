// TypeScript enums for e-commerce status values
// Since SQLite doesn't support Prisma enums, we use these TypeScript enums

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}

export enum ShippingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentGateway {
  STRIPE = 'STRIPE',
  JAZZCASH = 'JAZZCASH',
  EASYPAISA = 'EASYPAISA',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

export enum PaymentPurpose {
  PLATFORM_SUBSCRIPTION = 'PLATFORM_SUBSCRIPTION',
  WEBSITE_CHECKOUT = 'WEBSITE_CHECKOUT',
  ADDON_PURCHASE = 'ADDON_PURCHASE'
}
