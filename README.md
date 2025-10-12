# Pakistan Website Builder

Pakistan's most advanced AI-powered website builder with portable, scalable architecture. Built with modern technologies and designed for the Pakistani market with local payment gateways, Urdu language support, and culturally relevant templates.

## 🚀 Key Features

### 🎨 **Advanced Website Builder**
- **Drag-and-Drop Editor**: Intuitive visual editor with real-time preview
- **60+ Element Types**: Text, images, videos, forms, galleries, and more
- **Responsive Design**: Mobile-first approach with device-specific editing
- **Custom CSS Editor**: Advanced styling with AI-powered suggestions
- **Animation Editor**: Create smooth animations and transitions
- **A/B Testing**: Built-in testing tools for optimization

### 🤖 **AI-Powered Features**
- **Content Generation**: Generate content in Urdu and English using GPT-4, Claude, and Gemini
- **Design Suggestions**: AI-powered layout and design recommendations
- **SEO Optimization**: Automated SEO analysis and suggestions
- **Image Generation**: AI-powered image creation and optimization
- **Code Generation**: Generate custom HTML/CSS/JavaScript

### 🛒 **E-commerce Integration**
- **Complete Online Store**: Product catalogs, shopping cart, checkout
- **Payment Gateways**: JazzCash, EasyPaisa, Stripe, and local payment methods
- **Inventory Management**: Stock tracking and order management
- **Multi-currency Support**: PKR, USD, and other currencies
- **Tax Calculations**: Pakistani tax system integration

### 🌍 **Pakistan-Specific Features**
- **Urdu Language Support**: Full RTL support and Urdu content generation
- **Local Templates**: Culturally relevant templates for Pakistani businesses
- **Local Payment Methods**: JazzCash, EasyPaisa integration
- **Pakistani Business Categories**: Restaurant, clinic, school, shop templates
- **Local SEO**: Pakistan-specific SEO optimization

### 🔧 **Developer Features**
- **API Access**: RESTful API for custom integrations
- **Webhook Support**: Real-time notifications and integrations
- **Custom Domains**: Easy domain management and SSL certificates
- **White-label Solutions**: Customizable branding and domains
- **Team Collaboration**: Multi-user accounts with role-based permissions

## 🏗️ Architecture

### Frontend Stack
- **Next.js 15** with App Router and Edge Runtime
- **React 19** with TypeScript 5.6
- **Tailwind CSS 3.4** with custom design system
- **Zustand** for state management
- **TanStack Query** for data fetching and caching
- **Framer Motion** for animations and transitions
- **Radix UI** for accessible component primitives
- **Monaco Editor** for code editing
- **Cloudflare Pages** for deployment

### Backend Stack
- **Cloudflare Workers** with Hono framework
- **TypeScript 5.6** for type safety
- **Cloudflare D1** (SQLite) for database
- **Cloudflare KV** for caching and sessions
- **Cloudflare R2** for file storage
- **JWT** for authentication
- **Zod** for validation

### AI & Services Integration
- **OpenAI GPT-4** for content generation
- **Anthropic Claude 3.5** for advanced reasoning
- **Google Gemini** for multimodal features
- **Cloudflare AI** for edge processing
- **Stripe** for international payments
- **JazzCash & EasyPaisa** for local payments
- **Cloudinary** for image processing

### Infrastructure
- **Cloudflare Workers** for serverless backend
- **Cloudflare Pages** for frontend hosting
- **Cloudflare D1** for database
- **Cloudflare R2** for asset storage
- **Cloudflare KV** for caching
- **Docker** for local development
- **GitHub Actions** for CI/CD

## 🚀 Quick Start

### Prerequisites
- **Node.js 22+** and npm 10+
- **Git** for version control
- **Cloudflare Account** (free tier available)
- **Docker & Docker Compose** (for local development)

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

4. **Start local development environment**
```bash
# Option 1: Docker development (recommended)
npm run docker:dev

# Option 2: Local development
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/docs

### Environment Configuration

Create a `.env` file with the following variables:

```env
# Application
NODE_ENV=development
PORT=3001
CLIENT_URL=http://localhost:3000

# Database (Cloudflare D1)
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
REFRESH_TOKEN_EXPIRES_IN="30d"

# AI Services
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
GOOGLE_AI_API_KEY="your-google-ai-api-key"

# Storage (Cloudflare R2)
R2_ACCESS_KEY_ID="your-r2-access-key"
R2_SECRET_ACCESS_KEY="your-r2-secret-key"
R2_BUCKET_NAME="pakistan-website-builder-assets"

# Payment Gateways
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
JAZZCASH_MERCHANT_ID="your-jazzcash-merchant-id"
EASYPAISA_MERCHANT_ID="your-easypaisa-merchant-id"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 📁 Project Structure

```
pakistan-website-builder/
├── frontend/                    # Next.js 15 frontend application
│   ├── src/
│   │   ├── app/                # App Router pages and layouts
│   │   ├── components/         # React components (60+ files)
│   │   │   ├── ui/            # Reusable UI components
│   │   │   ├── editor/        # Website editor components
│   │   │   ├── forms/         # Form components
│   │   │   └── layout/        # Layout components
│   │   ├── lib/               # Utilities and configurations
│   │   ├── store/             # Zustand state management
│   │   ├── types/             # TypeScript type definitions
│   │   └── styles/            # Global styles and themes
│   ├── public/                # Static assets
│   ├── next.config.js         # Next.js configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── package.json
├── backend/                    # Cloudflare Workers backend
│   ├── src/
│   │   ├── workers/           # Cloudflare Workers entry points
│   │   ├── routes/            # API route handlers (41 files)
│   │   ├── services/          # Business logic (48 files)
│   │   ├── middleware/        # Request middleware
│   │   ├── models/            # Data models
│   │   ├── utils/             # Utility functions
│   │   ├── types/             # TypeScript types
│   │   └── integrations/       # Third-party integrations
│   ├── prisma/                # Database schema and migrations
│   ├── tests/                 # Test files
│   ├── wrangler.toml          # Cloudflare Workers configuration
│   └── package.json
├── docs/                      # Comprehensive documentation
│   ├── API.md                 # API documentation
│   ├── DEPLOYMENT.md          # Deployment guides
│   ├── ECOMMERCE_API.md       # E-commerce API docs
│   ├── TEMPLATES.md           # Template documentation
│   └── COMPLETE_DOCUMENTATION.md
├── e2e/                       # End-to-end tests
├── monitoring/                # Monitoring configurations
├── nginx/                     # Nginx configurations
├── docker-compose.dev.yml     # Development environment
├── docker-compose.prod.yml    # Production environment
├── deploy-*.sh               # Deployment scripts
└── package.json              # Root package.json
```

## 🔧 Development

### Available Scripts

#### Root Level Scripts
```bash
# Development
npm run dev              # Start both frontend and backend
npm run server:dev       # Start backend only
npm run client:dev       # Start frontend only

# Building
npm run build            # Build both frontend and backend
npm run client:build     # Build frontend only
npm run server:build     # Build backend only

# Testing
npm run test             # Run all tests
npm run test:server      # Run backend tests
npm run test:client      # Run frontend tests
npm run test:e2e         # Run E2E tests

# Linting
npm run lint             # Lint all code
npm run lint:server      # Lint backend code
npm run lint:client      # Lint frontend code

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with sample data
npm run db:reset         # Reset database

# Docker
npm run docker:dev       # Start development with Docker
npm run docker:prod      # Start production with Docker

# Installation
npm run install-all      # Install all dependencies
```

#### Frontend Scripts
```bash
cd frontend
npm run dev              # Start Next.js development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Lint code
npm run type-check       # TypeScript type checking
npm run test             # Run tests
npm run test:coverage    # Run tests with coverage
```

#### Backend Scripts
```bash
cd backend
npm run dev              # Start Cloudflare Workers dev server
npm run build            # Build TypeScript
npm run deploy           # Deploy to Cloudflare Workers
npm run test             # Run tests with Vitest
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
npm run lint             # Lint code
npm run format           # Format code with Prettier
```

### Development Workflow

1. **Start Development Environment**
   ```bash
   npm run docker:dev  # Recommended for full stack
   # OR
   npm run dev         # Local development
   ```

2. **Make Changes**
   - Frontend changes are hot-reloaded
   - Backend changes require restart

3. **Run Tests**
   ```bash
   npm run test        # Run all tests
   npm run lint        # Check code quality
   ```

4. **Build for Production**
   ```bash
   npm run build       # Build both frontend and backend
   ```

## 🚀 Deployment

### Cloudflare Deployment (Recommended)

The application is optimized for Cloudflare's edge network:

#### Frontend (Cloudflare Pages)
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy frontend
cd frontend
npm run build
wrangler pages deploy .next --project-name=pakistan-website-builder
```

#### Backend (Cloudflare Workers)
```bash
# Deploy backend workers
cd backend
npm run deploy
```

### Alternative Deployment Options

#### Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy backend
cd backend
railway login
railway up
```

#### Vercel Deployment
```bash
# Deploy frontend to Vercel
cd frontend
vercel --prod
```

#### Docker Production Deployment
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Setup for Production

#### Cloudflare Workers Environment Variables
Set these in Cloudflare Workers dashboard:
```env
NODE_ENV=production
JWT_SECRET=your-production-jwt-secret
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_AI_API_KEY=your-google-key
STRIPE_SECRET_KEY=your-stripe-secret-key
JAZZCASH_MERCHANT_ID=your-jazzcash-merchant-id
EASYPAISA_MERCHANT_ID=your-easypaisa-merchant-id
```

#### Cloudflare Pages Environment Variables
Set these in Cloudflare Pages dashboard:
```env
NEXT_PUBLIC_API_URL=https://pakistan-website-builder.your-subdomain.workers.dev
NEXT_PUBLIC_APP_URL=https://pakistan-website-builder.pages.dev
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

## 📊 API Documentation

### Interactive API Documentation
- **Development**: http://localhost:3001/docs
- **Production**: https://api.pakistanbuilder.com/docs

### Core API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

#### Website Management
- `GET /api/websites` - List user websites
- `POST /api/websites` - Create new website
- `GET /api/websites/:id` - Get website details
- `PUT /api/websites/:id` - Update website
- `DELETE /api/websites/:id` - Delete website
- `POST /api/websites/:id/publish` - Publish website

#### AI Services
- `POST /api/ai/generate-content` - Generate AI content
- `POST /api/ai/generate-images` - Generate AI images
- `POST /api/ai/optimize-seo` - SEO optimization suggestions
- `POST /api/ai/translate` - Content translation

#### E-commerce
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `POST /api/payments/process` - Process payment

#### Templates
- `GET /api/templates` - List available templates
- `GET /api/templates/:id` - Get template details
- `POST /api/templates/:id/apply` - Apply template to website

### API Authentication
All API endpoints require authentication via JWT token:
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     https://api.pakistanbuilder.com/api/websites
```

### Rate Limiting
- **Free Tier**: 100 requests/hour
- **Pro Tier**: 1,000 requests/hour
- **Enterprise**: Unlimited

### Webhook Support
Configure webhooks for real-time notifications:
- Website published
- Payment completed
- Order status changed
- User registered

## 🧪 Testing

### Test Suite
```bash
# Run all tests
npm test

# Run backend tests
npm run test:server

# Run frontend tests
npm run test:client

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Test Coverage
- **Frontend**: Jest + React Testing Library
- **Backend**: Vitest for unit tests
- **E2E**: Playwright for end-to-end testing
- **API**: Supertest for API testing

## 📈 Monitoring & Analytics

### Built-in Monitoring
- **Performance Metrics**: Core Web Vitals tracking
- **Error Tracking**: Real-time error monitoring
- **Health Checks**: Service availability monitoring
- **User Analytics**: Behavior tracking and insights
- **Business Metrics**: Revenue and growth tracking

### Cloudflare Analytics
- **Web Analytics**: Built-in traffic analysis
- **Security Events**: Threat detection and blocking
- **Performance Insights**: Edge performance metrics

## 🔒 Security Features

### Authentication & Authorization
- **JWT-based authentication** with refresh tokens
- **Role-based access control** (RBAC)
- **Multi-factor authentication** support
- **OAuth integration** (Google, Facebook, GitHub)

### Data Protection
- **Input validation** and sanitization with Zod
- **Rate limiting** to prevent abuse
- **HTTPS enforcement** in production
- **CORS configuration** for security
- **SQL injection prevention** with parameterized queries
- **XSS protection** with content sanitization

### Infrastructure Security
- **Cloudflare security** features
- **DDoS protection** and mitigation
- **Bot management** and filtering
- **SSL/TLS encryption** everywhere

## 🌍 Internationalization

### Language Support
- **Multi-language support** (Urdu, English)
- **RTL support** for Urdu content
- **Dynamic language switching**
- **AI-powered translation**

### Localization Features
- **Cultural adaptations** for Pakistani market
- **Local payment methods** integration
- **Regional compliance** features
- **Pakistani business templates**
- **Local SEO optimization**

## 🤝 Contributing

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
   npm run lint
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Create a Pull Request**

### Code Standards
- **TypeScript** for all new code
- **ESLint** and **Prettier** for code formatting
- **Conventional Commits** for commit messages
- **Test coverage** for new features
- **Documentation** updates as needed

### Development Guidelines
- Follow the existing code structure
- Write meaningful commit messages
- Add tests for new functionality
- Update documentation
- Ensure backward compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Community

### Documentation
- **Complete Documentation**: [docs/COMPLETE_DOCUMENTATION.md](docs/COMPLETE_DOCUMENTATION.md)
- **API Documentation**: [docs/API.md](docs/API.md)
- **Deployment Guide**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **E-commerce Guide**: [docs/ECOMMERCE_API.md](docs/ECOMMERCE_API.md)

### Community Support
- **GitHub Issues**: [Report bugs and request features](https://github.com/your-org/pakistan-website-builder/issues)
- **Discussions**: [Community discussions](https://github.com/your-org/pakistan-website-builder/discussions)
- **Email**: support@pakistanbuilder.com
- **Discord**: [Join our community](https://discord.gg/pakistanbuilder)

## 🎯 Roadmap

### Short Term (Q1 2024)
- [ ] Enhanced AI content generation
- [ ] Advanced animation editor
- [ ] Mobile app beta
- [ ] White-label solutions

### Medium Term (Q2-Q3 2024)
- [ ] Enterprise features
- [ ] Advanced analytics dashboard
- [ ] API marketplace
- [ ] Multi-tenant architecture

### Long Term (Q4 2024+)
- [ ] Global expansion
- [ ] Developer ecosystem
- [ ] AI-powered design assistant
- [ ] Blockchain integration

## 🏆 Achievements

- **60+ Element Types** for comprehensive website building
- **AI-Powered Content Generation** in Urdu and English
- **Local Payment Integration** with JazzCash and EasyPaisa
- **Edge-First Architecture** with Cloudflare Workers
- **Comprehensive Documentation** with multiple guides
- **Production-Ready** with Docker and CI/CD

---

**Built with ❤️ for Pakistan's digital future**

*Empowering Pakistani businesses to create stunning websites with AI-powered tools and local integrations.*
