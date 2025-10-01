# Onboarding System - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- Redis server running (optional for development)

### Installation

1. **Install Dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

2. **Setup Environment Variables**

Backend `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/website_builder"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key"
PORT=4000
NODE_ENV=development
```

Frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

3. **Run Database Migrations**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

4. **Start Development Servers**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

---

## 🎯 Testing the Onboarding Flow

### Step 1: Access Landing Page
1. Open browser to `http://localhost:3000`
2. You should see the landing page with hero section
3. Click "Start Building Free" button

### Step 2: AI Conversation
1. You'll be redirected to `/onboarding`
2. AI will greet you: "Hi! I'm your AI website builder assistant..."
3. Type a response like: "I want to create an online clothing store"
4. AI will detect your intent and ask follow-up questions

### Step 3: Provide Information
Answer the AI's questions:
- Business name: "Fashion Hub"
- Description: "We sell trendy clothes for young people"
- Target audience: "Young professionals in Pakistan"
- Colors: "Let AI choose" or pick your own

### Step 4: Registration
1. After providing information, AI will say "Creating your website..."
2. Registration modal will appear
3. Sign up with:
   - Email/Password, or
   - Google (coming soon), or
   - Facebook (coming soon)

### Step 5: Website Created
1. After registration, you'll be redirected to the editor
2. Your website will be pre-populated with AI-generated content
3. You can customize and publish!

---

## 🧪 API Testing

### Test Conversation API

**Start Conversation:**
```bash
curl -X POST http://localhost:4000/v1/conversation/start \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "test-session-123"}'
```

**Send Message:**
```bash
curl -X POST http://localhost:4000/v1/conversation/message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-123",
    "message": "I want to create an online store"
  }'
```

**Detect Intent:**
```bash
curl -X POST http://localhost:4000/v1/conversation/detect-intent \
  -H "Content-Type: application/json" \
  -d '{"message": "I want to sell products online"}'
```

---

## 📁 Key Files to Know

### Frontend Components
```
frontend/src/
├── app/
│   ├── page.tsx                          # Landing page
│   ├── onboarding/page.tsx               # Onboarding entry point
│   └── dashboard/page.tsx                # Dashboard
├── components/
│   ├── onboarding/
│   │   ├── onboarding-router.tsx         # Main router
│   │   └── ai-conversation-onboarding.tsx # Chat interface
│   ├── auth/
│   │   └── contextual-registration-modal.tsx # Registration
│   └── home/
│       └── hero.tsx                      # Landing hero
└── lib/
    └── anonymousSession.ts               # Session management
```

### Backend Services
```
backend/src/
├── routes/
│   ├── conversation.ts                   # Conversation API
│   └── aiOnboarding.ts                   # Onboarding API
└── services/
    ├── conversationOrchestrator.ts       # Conversation logic
    ├── intentDetectionService.ts         # Intent detection
    └── aiOnboardingService.ts            # Onboarding logic
```

---

## 🔧 Common Issues & Solutions

### Issue: "Cannot find module 'uuid'"
**Solution:**
```bash
cd frontend
npm install uuid
npm install --save-dev @types/uuid
```

### Issue: Backend routes not working
**Solution:**
1. Check backend is running on port 4000
2. Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`
3. Check CORS settings in `backend/src/index.ts`

### Issue: Registration modal not appearing
**Solution:**
1. Check browser console for errors
2. Verify conversation flow reaches 'generating' step
3. Check `onRegisterRequired` callback is being called

### Issue: Database connection failed
**Solution:**
1. Ensure PostgreSQL is running
2. Verify `DATABASE_URL` in backend `.env`
3. Run `npx prisma migrate dev` to create tables

### Issue: Anonymous session not persisting
**Solution:**
1. Check browser localStorage (DevTools → Application → Local Storage)
2. Verify `anonymousSessionManager` is being called
3. Check for localStorage quota errors

---

## 🎨 Customization

### Change AI Greeting Message
Edit `backend/src/services/conversationOrchestrator.ts`:
```typescript
session.messages.push({
  id: this.generateMessageId(),
  type: 'ai',
  content: "Your custom greeting here!",
  timestamp: new Date(),
  metadata: { ... }
})
```

### Add New Intent Type
Edit `backend/src/services/intentDetectionService.ts`:
```typescript
private intentPatterns = {
  // Add your new intent
  custom_intent: {
    keywords: ['keyword1', 'keyword2'],
    features: ['feature1', 'feature2'],
    templates: ['template-name']
  },
  // ... existing intents
}
```

### Customize Registration Modal
Edit `frontend/src/components/auth/contextual-registration-modal.tsx`:
- Change colors, layout, copy
- Add/remove social auth providers
- Customize benefits list

### Change Conversation Flow
Edit `backend/src/services/conversationOrchestrator.ts`:
- Modify `handleInitialInput()` for first message
- Modify `handleDetailsCollection()` for question flow
- Add new conversation steps

---

## 📊 Monitoring

### Check Anonymous Sessions
```javascript
// In browser console
localStorage.getItem('anonymous_session')
```

### Check Backend Logs
```bash
# Backend terminal will show:
# - API requests
# - Conversation messages
# - Intent detection results
# - Errors
```

### API Documentation
Visit `http://localhost:4000/docs` for Swagger documentation

---

## 🚢 Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Set environment variables
3. Deploy `frontend` directory

### Backend (Railway/Heroku/VPS)
1. Set environment variables
2. Run migrations: `npx prisma migrate deploy`
3. Start: `npm start`

### Database
1. Use managed PostgreSQL (Supabase, Neon, etc.)
2. Update `DATABASE_URL`
3. Run migrations

### Redis (Optional)
1. Use managed Redis (Upstash, Redis Cloud)
2. Update `REDIS_URL`
3. Restart backend

---

## 📚 Next Steps

1. **Test the full flow** from landing to editor
2. **Customize the conversation** to match your brand
3. **Add more intents** for different business types
4. **Implement social auth** (Google, Facebook)
5. **Add analytics** to track conversion rates
6. **Optimize AI responses** based on user feedback
7. **Add voice input** for better UX
8. **Implement A/B testing** for different flows

---

## 🆘 Getting Help

- **Documentation**: See `ONBOARDING_ROUTES.md` for detailed routing
- **API Docs**: http://localhost:4000/docs
- **Issues**: Create an issue in the repository
- **Questions**: Contact the development team

---

## ✅ Checklist

Before going to production:

- [ ] Test complete onboarding flow
- [ ] Verify all API endpoints work
- [ ] Test registration with email/password
- [ ] Verify website generation works
- [ ] Test error handling
- [ ] Check mobile responsiveness
- [ ] Verify session persistence
- [ ] Test with different intents
- [ ] Check database migrations
- [ ] Set up monitoring/analytics
- [ ] Configure production environment variables
- [ ] Test deployment
- [ ] Create backup strategy
- [ ] Set up error tracking (Sentry)
- [ ] Load test conversation API
- [ ] Security audit

---

Happy Building! 🎉
