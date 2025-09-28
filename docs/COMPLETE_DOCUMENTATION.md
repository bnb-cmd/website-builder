# Pakistan Website Builder - Complete Documentation

## Table of Contents
1. [Getting Started](#getting-started)
2. [Architecture Overview](#architecture-overview)
3. [API Documentation](#api-documentation)
4. [Frontend Development](#frontend-development)
5. [Backend Development](#backend-development)
6. [Database Schema](#database-schema)
7. [Deployment Guide](#deployment-guide)
8. [Testing](#testing)
9. [Contributing](#contributing)
10. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites
- Node.js 22+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/pakistan-website-builder.git
   cd pakistan-website-builder
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start development environment**
   ```bash
   npm run dev
   ```

5. **Run database migrations**
   ```bash
   cd backend
   npx prisma migrate dev
   ```

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript 5.6, Tailwind CSS 4.0
- **Backend**: Node.js 22, Fastify, Prisma ORM
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana

### Project Structure
```
pakistan-website-builder/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   ├── lib/            # Utility functions
│   │   ├── store/          # Zustand state management
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   └── utils/          # Utility functions
│   ├── prisma/             # Database schema and migrations
│   └── package.json
├── nginx/                  # Nginx configuration
├── monitoring/             # Prometheus and Grafana configs
├── docs/                   # Documentation
└── docker-compose.yml      # Development environment
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "company": "Example Corp"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "tokens": {
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

#### POST /api/auth/login
Authenticate user and return tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Website Management Endpoints

#### GET /api/websites
Retrieve all websites for authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "websites": [
    {
      "id": "website_123",
      "title": "My Business Website",
      "domain": "mybusiness.pk",
      "status": "published",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T15:45:00Z"
    }
  ]
}
```

#### POST /api/websites
Create a new website.

**Request Body:**
```json
{
  "title": "My New Website",
  "template": "business",
  "domain": "mynewwebsite.pk"
}
```

#### PUT /api/websites/:id
Update website content and settings.

**Request Body:**
```json
{
  "title": "Updated Website Title",
  "content": {
    "elements": [
      {
        "id": "element_1",
        "type": "heading",
        "props": {
          "text": "Welcome to My Website",
          "level": 1
        },
        "style": {
          "color": "#333333",
          "fontSize": "2rem"
        }
      }
    ]
  }
}
```

### AI Integration Endpoints

#### POST /api/ai/generate-content
Generate AI-powered content for websites.

**Request Body:**
```json
{
  "prompt": "Create content for a Pakistani restaurant website",
  "type": "text",
  "language": "en",
  "tone": "professional"
}
```

**Response:**
```json
{
  "success": true,
  "content": "Welcome to Spice Palace, where authentic Pakistani flavors meet modern dining experience...",
  "suggestions": [
    "Add a menu section",
    "Include customer testimonials",
    "Add location and contact information"
  ]
}
```

## Frontend Development

### Component Structure

The frontend uses a component-based architecture with the following key components:

#### Core Components
- `WebsiteEditor`: Main drag-and-drop editor interface
- `Canvas`: Rendering area for website elements
- `Sidebar`: Element library and tools
- `PropertiesPanel`: Element property editor
- `Toolbar`: Editor controls and actions

#### Advanced Components
- `AIWebsiteAssistant`: AI-powered design suggestions
- `LayerPanel`: Element layer management
- `AnimationEditor`: Animation creation and editing
- `CustomCSSEditor`: Custom CSS with AI suggestions
- `ABTestingPanel`: A/B testing tools
- `APIIntegrationsPanel`: Third-party integrations
- `WhiteLabelPanel`: White-label configuration
- `SecurityCompliancePanel`: Enterprise security features
- `DeveloperPortalPanel`: Developer tools and SDK

### State Management

The application uses Zustand for state management with the following stores:

#### Website Store (`useWebsiteStore`)
```typescript
interface WebsiteStore {
  elements: Element[]
  selectedElement: Element | null
  viewMode: 'desktop' | 'tablet' | 'mobile'
  history: EditorHistory
  canUndo: boolean
  canRedo: boolean
  
  // Actions
  addElement: (element: Element) => void
  updateElement: (id: string, updates: Partial<Element>) => void
  deleteElement: (id: string) => void
  selectElement: (id: string | null) => void
  undo: () => void
  redo: () => void
  saveWebsite: (id: string, elements: Element[], viewMode: ViewMode) => Promise<void>
}
```

### Element Types

The system supports 60+ element types across multiple categories:

#### Basic Elements
- Text, Heading, Image, Button, Container, Form, Video, Divider, Spacer

#### Layout Elements
- Grid, Flexbox, Section, Column, Row, Card, Modal, Sidebar

#### Media Elements
- Gallery, Carousel, Audio, Video Player, Image Slider, Lightbox

#### Content Elements
- Blog Post, Article, FAQ, Testimonial, Pricing Table, Team Member, Timeline, Stats

#### Interactive Elements
- Contact Form, Newsletter Signup, Chat Widget, Poll, Survey, Calculator

#### E-commerce Elements
- Product Grid, Shopping Cart, Checkout Form, Product Details, Order Tracking

## Backend Development

### Service Architecture

The backend follows a service-oriented architecture:

#### Core Services
- `UserService`: User management and authentication
- `WebsiteService`: Website CRUD operations
- `AIService`: AI content generation
- `PaymentService`: Payment processing
- `EmailService`: Email notifications
- `AnalyticsService`: Website analytics

#### Database Services
- `DatabaseService`: Prisma client wrapper
- `RedisService`: Caching and session management

### Middleware

#### Authentication Middleware
```typescript
export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  const token = request.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return reply.status(401).send({ error: 'No token provided' })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    request.user = decoded
  } catch (error) {
    return reply.status(401).send({ error: 'Invalid token' })
  }
}
```

#### Rate Limiting Middleware
```typescript
export const rateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
})
```

## Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  role user_role DEFAULT 'user',
  subscription_plan subscription_plan DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Websites Table
```sql
CREATE TABLE websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE,
  content JSONB NOT NULL DEFAULT '{}',
  status website_status DEFAULT 'draft',
  template_id UUID REFERENCES templates(id),
  seo_settings JSONB DEFAULT '{}',
  analytics_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Templates Table
```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category template_category NOT NULL,
  description TEXT,
  preview_image VARCHAR(255),
  content JSONB NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Deployment Guide

### Production Deployment

#### 1. Environment Setup
```bash
# Set production environment variables
export NODE_ENV=production
export DATABASE_URL=postgresql://user:pass@host:5432/db
export REDIS_URL=redis://host:6379
export JWT_SECRET=your-secret-key
export AI_API_KEY=your-ai-api-key
```

#### 2. Docker Deployment
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

#### 3. Database Migration
```bash
# Run production migrations
cd backend
npx prisma migrate deploy
```

#### 4. SSL Certificate Setup
```bash
# Using Let's Encrypt
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Cloud Deployment Options

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy
```

#### DigitalOcean App Platform
```bash
# Create app spec
doctl apps create --spec .do/app.yaml
```

#### AWS ECS
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
docker build -t website-builder .
docker tag website-builder:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/website-builder:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/website-builder:latest
```

## Testing

### Unit Tests
```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test
```

### Integration Tests
```bash
# Run integration tests
npm run test:integration
```

### E2E Tests
```bash
# Run end-to-end tests
npm run test:e2e
```

### Test Coverage
```bash
# Generate coverage reports
npm run test:coverage
```

## Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm run test
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Create a Pull Request**

### Code Standards

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database status
docker-compose ps

# Restart database
docker-compose restart db

# Check logs
docker-compose logs db
```

#### Redis Connection Issues
```bash
# Check Redis status
docker-compose ps redis

# Restart Redis
docker-compose restart redis
```

#### Frontend Build Issues
```bash
# Clear Next.js cache
rm -rf frontend/.next

# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### Backend API Issues
```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Performance Optimization

#### Frontend Optimization
- Use React.memo for expensive components
- Implement code splitting with dynamic imports
- Optimize images with Next.js Image component
- Use Tailwind CSS purging for smaller bundle sizes

#### Backend Optimization
- Implement Redis caching for frequently accessed data
- Use database indexes for common queries
- Implement connection pooling
- Use compression middleware

#### Database Optimization
- Add appropriate indexes
- Use database connection pooling
- Implement query optimization
- Regular database maintenance

### Monitoring and Logging

#### Application Monitoring
- Use Prometheus for metrics collection
- Grafana for visualization
- Implement health checks
- Set up alerting

#### Logging
- Use structured logging with Winston
- Implement log rotation
- Centralized logging with ELK stack
- Error tracking with Sentry

## Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Email: support@websitebuilder.pk
- Documentation: https://docs.websitebuilder.pk

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
