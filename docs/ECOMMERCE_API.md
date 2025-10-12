# E-commerce API Documentation

## Overview

The E-commerce API provides endpoints for managing orders, payments, and social media integration for micro-store websites. All endpoints require appropriate authentication and package permissions.

## Base URL

```
https://api.pakistanbuilder.com/v1
```

## Authentication

All API requests require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Package Requirements

Different endpoints require different package levels:

- **STARTER**: Basic e-commerce features (orders, manual social import)
- **PRO**: OAuth integration, advanced features
- **ENTERPRISE**: WhatsApp Business API, unlimited features

## Order Management

### Create Order

Create a new customer order.

**Endpoint:** `POST /orders`

**Package Required:** None (public endpoint for customers)

**Request Body:**
```json
{
  "websiteId": "uuid",
  "customerName": "string",
  "customerPhone": "string (Pakistani format)",
  "customerEmail": "string (optional)",
  "items": [
    {
      "productId": "uuid",
      "quantity": "number",
      "price": "number"
    }
  ],
  "shippingAddress": {
    "addressLine1": "string",
    "addressLine2": "string (optional)",
    "city": "string",
    "postalCode": "string (optional)",
    "phone": "string (Pakistani format)"
  },
  "paymentMethod": "easypaisa | jazzcash | cod",
  "notes": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "totalAmount": "number",
    "currency": "PKR",
    "status": "pending",
    "paymentMethod": "cod",
    "createdAt": "ISO string"
  }
}
```

### List Orders

Get orders for a website (authenticated).

**Endpoint:** `GET /orders`

**Package Required:** STARTER+

**Query Parameters:**
- `websiteId` (required): Website UUID
- `status` (optional): Filter by order status
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "customerName": "string",
        "customerPhone": "string",
        "totalAmount": "number",
        "status": "string",
        "paymentMethod": "string",
        "createdAt": "ISO string",
        "itemCount": "number",
        "productNames": "string"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "pages": "number"
    }
  }
}
```

### Get Order Details

Get detailed information about a specific order.

**Endpoint:** `GET /orders/:id`

**Package Required:** STARTER+

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "customerName": "string",
    "customerPhone": "string",
    "customerEmail": "string",
    "totalAmount": "number",
    "status": "string",
    "paymentMethod": "string",
    "paymentStatus": "string",
    "notes": "string",
    "createdAt": "ISO string",
    "items": [
      {
        "id": "uuid",
        "productName": "string",
        "productDescription": "string",
        "quantity": "number",
        "price": "number"
      }
    ],
    "shippingAddress": {
      "addressLine1": "string",
      "addressLine2": "string",
      "city": "string",
      "postalCode": "string",
      "phone": "string"
    },
    "payments": [
      {
        "id": "uuid",
        "gateway": "string",
        "status": "string",
        "amount": "number",
        "createdAt": "ISO string"
      }
    ]
  }
}
```

### Update Order Status

Update the status of an order.

**Endpoint:** `PATCH /orders/:id/status`

**Package Required:** STARTER+

**Request Body:**
```json
{
  "status": "pending | confirmed | processing | shipped | delivered | cancelled",
  "notes": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "status": "string",
    "updatedAt": "ISO string"
  }
}
```

### Get Order Statistics

Get order statistics for a website.

**Endpoint:** `GET /orders/stats`

**Package Required:** STARTER+

**Query Parameters:**
- `websiteId` (required): Website UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": "number",
    "pendingOrders": "number",
    "confirmedOrders": "number",
    "deliveredOrders": "number",
    "cancelledOrders": "number",
    "totalRevenue": "number",
    "averageOrderValue": "number",
    "recentOrders": "number"
  }
}
```

## Payment Processing

### Initiate Payment

Start the payment process for an order.

**Endpoint:** `POST /checkout/initiate`

**Package Required:** STARTER+

**Request Body:**
```json
{
  "orderId": "uuid",
  "paymentMethod": "easypaisa | jazzcash | cod",
  "returnUrl": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "uuid",
    "paymentMethod": "string",
    "amount": "number",
    "currency": "PKR",
    "status": "initiated",
    "paymentUrl": "string (if applicable)",
    "gatewayData": "object"
  }
}
```

### Payment Callbacks

Handle payment gateway callbacks.

**Endpoint:** `POST /checkout/easypaisa/callback`
**Endpoint:** `POST /checkout/jazzcash/callback`

**Request Body:**
```json
{
  "transactionId": "string",
  "orderId": "string",
  "amount": "string",
  "status": "success | failed",
  "signature": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "string",
    "orderId": "string",
    "status": "completed | failed"
  }
}
```

### Confirm COD Order

Confirm a Cash on Delivery order.

**Endpoint:** `POST /checkout/cod/confirm`

**Package Required:** STARTER+

**Request Body:**
```json
{
  "orderId": "uuid",
  "confirmed": "boolean"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "status": "confirmed | cancelled",
    "paymentStatus": "paid | cancelled",
    "updatedAt": "ISO string"
  }
}
```

### Check Payment Status

Get the payment status of an order.

**Endpoint:** `GET /checkout/:orderId/status`

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "status": "string",
    "paymentStatus": "string",
    "paymentMethod": "string",
    "amount": "number",
    "currency": "PKR",
    "transactionStatus": "string",
    "gatewayResponse": "object",
    "createdAt": "ISO string",
    "updatedAt": "ISO string"
  }
}
```

## Social Media Integration

### Initiate OAuth Flow

Start OAuth authentication for a social media platform.

**Endpoint:** `GET /social/auth/:platform`

**Package Required:** PRO+

**Query Parameters:**
- `websiteId` (required): Website UUID

**Supported Platforms:**
- `instagram`
- `tiktok`
- `facebook`
- `pinterest`

**Response:**
```json
{
  "success": true,
  "data": {
    "authUrl": "string",
    "state": "string",
    "platform": "string"
  }
}
```

### OAuth Callback

Handle OAuth callback from social media platforms.

**Endpoint:** `GET /social/callback/:platform`

**Query Parameters:**
- `code`: Authorization code
- `state`: State parameter

**Response:**
```json
{
  "success": true,
  "data": {
    "platform": "string",
    "connected": true,
    "expiresAt": "ISO string"
  }
}
```

### Import Product from Link

Import a single product from a social media URL.

**Endpoint:** `POST /social/import-link`

**Package Required:** STARTER+

**Request Body:**
```json
{
  "websiteId": "uuid",
  "url": "string",
  "platform": "instagram | tiktok | facebook | pinterest | any (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "productId": "uuid",
    "name": "string",
    "price": "number",
    "currency": "PKR",
    "imageUrl": "string",
    "platform": "string",
    "originalUrl": "string"
  }
}
```

### Sync Products

Trigger manual product sync from connected social accounts.

**Endpoint:** `POST /social/sync`

**Package Required:** PRO+

**Request Body:**
```json
{
  "websiteId": "uuid",
  "platform": "instagram | tiktok | facebook | pinterest (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "platform": "string",
        "status": "success | failed",
        "syncedAt": "ISO string",
        "error": "string (if failed)"
      }
    ],
    "syncedAt": "ISO string"
  }
}
```

### Get Social Products

Get products imported from social media.

**Endpoint:** `GET /social/products`

**Package Required:** STARTER+

**Query Parameters:**
- `websiteId` (required): Website UUID
- `platform` (optional): Filter by platform

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "price": "number",
      "currency": "PKR",
      "imageUrl": "string",
      "socialPlatform": "string",
      "socialPostUrl": "string",
      "lastSyncedAt": "ISO string",
      "createdAt": "ISO string"
    }
  ]
}
```

### Disconnect Platform

Remove social media integration.

**Endpoint:** `DELETE /social/disconnect/:platform`

**Package Required:** STARTER+

**Query Parameters:**
- `websiteId` (required): Website UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "platform": "string",
    "disconnected": true
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "message": "string",
    "code": "string",
    "requiredPackage": "string (if applicable)",
    "currentPackage": "string (if applicable)"
  }
}
```

### Common Error Codes

- `NOT_AUTHENTICATED`: User not logged in
- `PACKAGE_UPGRADE_REQUIRED`: Insufficient package level
- `WEBSITE_NOT_FOUND`: Website doesn't exist or no access
- `ORDER_NOT_FOUND`: Order doesn't exist or no access
- `PRODUCT_LIMIT_EXCEEDED`: Exceeded product limit for package
- `INVALID_PHONE`: Invalid Pakistani phone number format
- `INVALID_SIGNATURE`: Invalid payment gateway signature
- `EXTRACTION_FAILED`: Failed to extract product data from URL
- `OAUTH_ERROR`: OAuth authentication failed

## Rate Limiting

API endpoints are rate limited:

- **Order Creation**: 10 requests per minute per IP
- **Payment Processing**: 5 requests per minute per user
- **Social Media Import**: 20 requests per hour per user
- **General API**: 100 requests per 15 minutes per IP

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Webhooks

### Payment Webhooks

Payment gateways send webhooks to notify about transaction status:

**Easypaisa Webhook URL:** `https://api.pakistanbuilder.com/v1/checkout/easypaisa/callback`
**JazzCash Webhook URL:** `https://api.pakistanbuilder.com/v1/checkout/jazzcash/callback`

**Webhook Payload:**
```json
{
  "transactionId": "string",
  "orderId": "string",
  "amount": "string",
  "status": "success | failed",
  "signature": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "string",
    "orderId": "string",
    "status": "completed | failed"
  }
}
```

## SDKs and Libraries

### JavaScript/TypeScript

```typescript
import { PakistanBuilderAPI } from '@pakistanbuilder/sdk'

const api = new PakistanBuilderAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.pakistanbuilder.com/v1'
})

// Create order
const order = await api.orders.create({
  websiteId: 'uuid',
  customerName: 'Ahmed Ali',
  customerPhone: '+92 300 1234567',
  items: [{
    productId: 'uuid',
    quantity: 1,
    price: 1000
  }],
  shippingAddress: {
    addressLine1: '123 Main Street',
    city: 'Karachi',
    phone: '+92 300 1234567'
  },
  paymentMethod: 'cod'
})
```

### Python

```python
from pakistanbuilder import PakistanBuilderAPI

api = PakistanBuilderAPI(api_key='your-api-key')

# Create order
order = api.orders.create(
    website_id='uuid',
    customer_name='Ahmed Ali',
    customer_phone='+92 300 1234567',
    items=[{
        'product_id': 'uuid',
        'quantity': 1,
        'price': 1000
    }],
    shipping_address={
        'address_line1': '123 Main Street',
        'city': 'Karachi',
        'phone': '+92 300 1234567'
    },
    payment_method='cod'
)
```

## Testing

### Sandbox Environment

Use the sandbox environment for testing:

**Base URL:** `https://sandbox-api.pakistanbuilder.com/v1`

**Test Credentials:**
- EasyPaisa: Use test store ID and merchant key
- JazzCash: Use sandbox merchant ID and password
- Social Media: Use test app credentials

### Test Data

Use these test values for development:

```json
{
  "testWebsiteId": "550e8400-e29b-41d4-a716-446655440000",
  "testProductId": "550e8400-e29b-41d4-a716-446655440001",
  "testOrderId": "550e8400-e29b-41d4-a716-446655440002",
  "testPhoneNumber": "+92 300 1234567",
  "testEmail": "test@example.com"
}
```

## Support

For API support:

- **Email**: api-support@pakistanbuilder.com
- **Documentation**: https://docs.pakistanbuilder.com
- **Status Page**: https://status.pakistanbuilder.com
- **Community**: https://community.pakistanbuilder.com
