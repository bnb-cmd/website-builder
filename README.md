# Pakistan Website Builder

Pakistan's most advanced AI-powered website builder with portable, scalable architecture.

## 🚀 Features

- **AI-Powered Content Generation**: Generate content in Urdu and English
- **Drag-and-Drop Editor**: Intuitive website builder with real-time preview
- **Pakistan-Specific Templates**: Culturally relevant templates for local businesses
- **E-commerce Integration**: Complete online store functionality
- **Payment Gateways**: JazzCash, EasyPaisa, and Stripe integration
- **Mobile-First Design**: Responsive designs optimized for mobile
- **SEO Optimization**: AI-powered SEO tools and suggestions
- **Multi-Language Support**: Urdu and English language support
- **Custom Domains**: Easy domain registration and management
- **Team Collaboration**: Multi-user accounts with role-based permissions

## 🏗️ Architecture

### Frontend
- **Next.js 15** with App Router
- **React 19** with TypeScript 5.6
- **Tailwind CSS 4.0** for styling
- **Zustand** for state management
- **React Query** for data fetching
- **Framer Motion** for animations

### Backend
- **Node.js 22** with Fastify
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL
- **Redis** for caching
- **JWT** for authentication
- **Docker** for containerization

### AI Services
- **OpenAI GPT-5** for content generation
- **Claude 3.5** for advanced reasoning
- **Gemini 2.0** for multimodal features
- **Edge AI** processing for performance

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- Docker and Docker Compose
- PostgreSQL 17+
- Redis 7+

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd pakistan-website-builder
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development environment**
```bash
npm run docker:dev
```

5. **Run database migrations**
```bash
npm run db:migrate
npm run db:seed
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/docs

## 📁 Project Structure

```
pakistan-website-builder/
├── frontend/                 # Next.js 15 application
│   ├── app/                 # App Router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities and configurations
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── config/         # Environment configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript types
│   │   └── validators/      # Request validation
│   ├── prisma/             # Database schema and migrations
│   ├── tests/              # API tests
│   └── package.json
├── docs/                   # Documentation
├── docker-compose.dev.yml  # Development environment
├── docker-compose.prod.yml # Production environment
└── package.json           # Root package.json
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm run test` - Run all tests
- `npm run lint` - Lint code
- `npm run docker:dev` - Start development with Docker
- `npm run docker:prod` - Start production with Docker

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/website_builder"
DATABASE_PROVIDER="postgresql"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
REFRESH_TOKEN_EXPIRES_IN="30d"

# AI Services
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
GOOGLE_AI_API_KEY="your-google-ai-api-key"

# Storage
STORAGE_PROVIDER="cloudinary"
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# Payment Gateways
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
JAZZCASH_MERCHANT_ID="your-jazzcash-merchant-id"
EASYPAISA_MERCHANT_ID="your-easypaisa-merchant-id"

# Email
EMAIL_PROVIDER="resend"
RESEND_API_KEY="your-resend-api-key"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🚀 Deployment

### Production Deployment

1. **Build the application**
```bash
npm run build
```

2. **Start production environment**
```bash
npm run docker:prod
```

3. **Run database migrations**
```bash
npm run db:migrate
```

### Cloud Deployment

The application is designed to be easily deployable on:
- **Vercel** (Frontend)
- **Railway** (Backend)
- **DigitalOcean** (Full stack)
- **AWS** (Enterprise)
- **Google Cloud** (Enterprise)

## 📊 API Documentation

The API is fully documented with OpenAPI/Swagger specification. Access the interactive documentation at:
- Development: http://localhost:3001/docs
- Production: https://api.pakistanbuilder.com/docs

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests
npm run test:server

# Run frontend tests
npm run test:client

# Run tests with coverage
npm run test:coverage
```

## 📈 Monitoring

The application includes comprehensive monitoring:
- **Performance monitoring** with built-in metrics
- **Error tracking** with detailed logging
- **Health checks** for all services
- **Analytics** for user behavior
- **Business metrics** for growth tracking

## 🔒 Security

- **JWT-based authentication** with refresh tokens
- **Role-based access control** (RBAC)
- **Input validation** and sanitization
- **Rate limiting** to prevent abuse
- **HTTPS enforcement** in production
- **CORS configuration** for security
- **SQL injection prevention** with Prisma ORM

## 🌍 Internationalization

- **Multi-language support** (Urdu, English)
- **RTL support** for Urdu content
- **Cultural adaptations** for Pakistani market
- **Local payment methods** integration
- **Regional compliance** features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.pakistanbuilder.com](https://docs.pakistanbuilder.com)
- **Email**: support@pakistanbuilder.com
- **Discord**: [Join our community](https://discord.gg/pakistanbuilder)
- **GitHub Issues**: [Report bugs](https://github.com/pakistanbuilder/issues)

## 🎯 Roadmap

- [ ] Advanced AI features
- [ ] Mobile app development
- [ ] White-label solutions
- [ ] Enterprise features
- [ ] Global expansion
- [ ] API marketplace
- [ ] Developer ecosystem

---

Built with ❤️ for Pakistan's digital future
