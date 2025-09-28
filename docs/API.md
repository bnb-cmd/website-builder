# API Documentation - Pakistan Website Builder

Complete API reference for the Pakistan Website Builder platform.

## 🔗 **BASE URL**

- **Development**: `http://localhost:3001/v1`
- **Production**: `https://api.pakistanbuilder.com/v1`

## 🔐 **AUTHENTICATION**

### **Bearer Token Authentication**
```http
Authorization: Bearer <access_token>
```

### **Token Endpoints**

#### **POST** `/auth/login`
Authenticate user and receive access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### **POST** `/auth/register`
Create new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "phone": "+92-300-1234567",
  "businessType": "RESTAURANT",
  "city": "Karachi",
  "companyName": "John's Restaurant"
}
```

#### **POST** `/auth/refresh`
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

## 🌐 **WEBSITES API**

### **GET** `/websites`
Get user's websites with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status (DRAFT, PUBLISHED, ARCHIVED)
- `search` (string): Search in name and description
- `sortBy` (string): Sort field (default: createdAt)
- `sortOrder` (string): Sort direction (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "website_123",
      "name": "My Restaurant",
      "description": "Beautiful restaurant website",
      "status": "PUBLISHED",
      "subdomain": "my-restaurant",
      "customDomain": "myrestaurant.com",
      "businessType": "RESTAURANT",
      "language": "ENGLISH",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "publishedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **POST** `/websites`
Create a new website.

**Request Body:**
```json
{
  "name": "My New Website",
  "description": "Description of my website",
  "templateId": "template_123",
  "businessType": "RESTAURANT",
  "language": "ENGLISH",
  "content": {},
  "settings": {},
  "metaTitle": "My Restaurant - Best Food in Town",
  "metaDescription": "Experience the best Pakistani cuisine...",
  "metaKeywords": ["restaurant", "food", "pakistani", "cuisine"]
}
```

### **PUT** `/websites/{id}`
Update existing website.

### **DELETE** `/websites/{id}`
Delete website (soft delete - archives the website).

### **POST** `/websites/{id}/publish`
Publish website to make it live.

### **POST** `/websites/{id}/duplicate`
Create a copy of existing website.

## 🤖 **AI API**

### **POST** `/ai/generate-content`
Generate AI content for website sections.

**Request Body:**
```json
{
  "prompt": "Create a hero section for a restaurant",
  "language": "ENGLISH",
  "contentType": "hero",
  "businessType": "RESTAURANT",
  "tone": "friendly",
  "maxTokens": 500,
  "temperature": 0.7
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "content": "Welcome to our amazing restaurant...",
    "tokens": 245,
    "cost": 0.012,
    "model": "gpt-4",
    "generationId": "gen_123"
  }
}
```

### **POST** `/ai/optimize-seo`
Optimize content for SEO.

**Request Body:**
```json
{
  "content": "Your website content here...",
  "targetKeywords": ["restaurant", "karachi", "food"],
  "language": "ENGLISH",
  "businessType": "RESTAURANT"
}
```

### **POST** `/ai/generate-colors`
Generate color palette for brand.

**Request Body:**
```json
{
  "businessType": "RESTAURANT",
  "brandPersonality": "modern",
  "language": "ENGLISH"
}
```

## 🛍️ **E-COMMERCE API**

### **GET** `/products`
Get products with filtering.

**Query Parameters:**
- `websiteId` (string): Filter by website
- `status` (string): Filter by status
- `category` (string): Filter by category
- `priceMin` (number): Minimum price filter
- `priceMax` (number): Maximum price filter
- `search` (string): Search in name and description

### **POST** `/products`
Create new product.

**Request Body:**
```json
{
  "websiteId": "website_123",
  "name": "Delicious Biryani",
  "description": "Authentic Pakistani biryani...",
  "price": 350,
  "comparePrice": 400,
  "sku": "BIRYANI001",
  "images": ["https://example.com/biryani.jpg"],
  "trackInventory": true,
  "inventory": 50,
  "status": "ACTIVE"
}
```

### **POST** `/orders`
Create new order.

**Request Body:**
```json
{
  "websiteId": "website_123",
  "customerEmail": "customer@example.com",
  "customerName": "Customer Name",
  "items": [
    {
      "productId": "product_123",
      "quantity": 2,
      "price": 350
    }
  ],
  "shippingAddress": {
    "name": "Customer Name",
    "address": "123 Main Street",
    "city": "Karachi",
    "state": "Sindh",
    "postalCode": "75500",
    "country": "Pakistan"
  },
  "subtotal": 700,
  "tax": 70,
  "shipping": 100,
  "total": 870
}
```

## 💳 **PAYMENTS API**

### **POST** `/payments/create-intent`
Create payment intent for order.

**Request Body:**
```json
{
  "amount": 870,
  "currency": "PKR",
  "orderId": "order_123",
  "gateway": "STRIPE"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_123_secret_456",
    "paymentIntentId": "pi_123",
    "amount": 870,
    "currency": "PKR"
  }
}
```

### **POST** `/payments/confirm`
Confirm payment completion.

## 📝 **TEMPLATES API**

### **GET** `/templates`
Get available templates.

**Query Parameters:**
- `category` (string): Filter by category
- `businessType` (string): Filter by business type
- `language` (string): Filter by language
- `isPremium` (boolean): Filter premium templates

### **GET** `/templates/{id}`
Get specific template details.

## 👥 **USERS API**

### **GET** `/users/profile`
Get current user profile.

### **PUT** `/users/profile`
Update user profile.

### **GET** `/users/subscription`
Get user subscription details.

## 🔧 **ADMIN API**

### **GET** `/admin/stats`
Get platform statistics (admin only).

### **GET** `/admin/users`
Get all users (admin only).

## 📊 **RESPONSE FORMATS**

### **Success Response**
```json
{
  "success": true,
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **Error Response**
```json
{
  "success": false,
  "error": {
    "message": "Validation error",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🚨 **ERROR CODES**

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

## 🔄 **RATE LIMITS**

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/auth/login` | 5 requests | 1 minute |
| `/ai/*` | 10 requests | 1 minute |
| General API | 100 requests | 15 minutes |

## 📱 **WEBHOOKS**

### **Stripe Webhooks**
```http
POST /webhooks/stripe
Content-Type: application/json
Stripe-Signature: t=timestamp,v1=signature
```

### **JazzCash Webhooks**
```http
POST /webhooks/jazzcash
Content-Type: application/x-www-form-urlencoded
```

## 🧪 **TESTING**

### **API Testing with cURL**
```bash
# Login
curl -X POST http://localhost:3001/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123"}'

# Get websites
curl -X GET http://localhost:3001/v1/websites \
  -H "Authorization: Bearer <token>"

# Create website
curl -X POST http://localhost:3001/v1/websites \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Website","description":"Test description"}'
```

### **API Testing with Postman**
Import the Postman collection from `/docs/postman-collection.json`

## 📚 **SDK & INTEGRATIONS**

### **JavaScript SDK**
```javascript
import { PakistanBuilderAPI } from '@pakistanbuilder/sdk'

const api = new PakistanBuilderAPI({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.pakistanbuilder.com/v1'
})

// Create website
const website = await api.websites.create({
  name: 'My Website',
  templateId: 'template_123'
})
```

### **WordPress Plugin**
```php
// Install Pakistan Builder WordPress plugin
wp plugin install pakistan-website-builder
wp plugin activate pakistan-website-builder
```

For complete API documentation with interactive examples, visit:
**https://api.pakistanbuilder.com/docs**
