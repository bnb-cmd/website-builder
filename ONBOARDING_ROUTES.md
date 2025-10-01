# Onboarding System Routes & Integration

## Overview
This document describes the complete routing and integration for the modern AI-powered onboarding system.

## Route Structure

### Frontend Routes

#### 1. Landing Page
- **Route**: `/`
- **File**: `frontend/src/app/page.tsx`
- **Purpose**: Main landing page with hero, features, pricing
- **CTA**: "Start Building Free" → redirects to `/onboarding`

#### 2. Onboarding Flow
- **Route**: `/onboarding`
- **File**: `frontend/src/app/onboarding/page.tsx`
- **Component**: `OnboardingRouter`
- **Purpose**: AI conversation-based onboarding
- **Flow**:
  1. User lands on page (anonymous session created)
  2. AI conversation interface appears
  3. User describes website needs
  4. AI collects information conversationally
  5. Registration modal appears when ready to save
  6. After registration → redirect to editor or dashboard

#### 3. Dashboard
- **Route**: `/dashboard`
- **File**: `frontend/src/app/dashboard/page.tsx`
- **Purpose**: Main dashboard for authenticated users
- **Behavior**:
  - If `?onboarding=true` query param → redirect to `/onboarding`
  - Otherwise → show dashboard with websites, stats, checklist

#### 4. Editor
- **Route**: `/editor?websiteId={id}`
- **File**: `frontend/src/app/editor/page.tsx`
- **Purpose**: Website editor
- **Entry Point**: After onboarding completion with generated website

---

## Backend API Routes

### Conversation API

#### Start Conversation
```
POST /api/v1/conversation/start
Body: { sessionId: string, userId?: string }
Response: { success: boolean, data: ConversationSession }
```

#### Send Message
```
POST /api/v1/conversation/message
Body: { sessionId: string, message: string }
Response: { 
  success: boolean, 
  data: { 
    session: ConversationSession, 
    aiResponse: ConversationMessage 
  } 
}
```

#### Get Session
```
GET /api/v1/conversation/:sessionId
Response: { success: boolean, data: ConversationSession }
```

#### Generate Website
```
POST /api/v1/conversation/generate-website
Body: { sessionId: string, userId: string }
Response: { 
  success: boolean, 
  data: { websiteId: string, message: string } 
}
```

#### Detect Intent
```
POST /api/v1/conversation/detect-intent
Body: { message: string }
Response: { success: boolean, data: Intent }
```

### AI Onboarding API (Existing)

#### Get Checklist
```
GET /api/v1/ai-onboarding/checklist/:userId
Response: { success: boolean, data: OnboardingChecklist }
```

#### Get Languages
```
GET /api/v1/ai-onboarding/languages
Response: { success: boolean, data: Language[] }
```

#### Get Site Goals
```
GET /api/v1/ai-onboarding/site-goals
Response: { success: boolean, data: SiteGoal[] }
```

#### Get Brand Tones
```
GET /api/v1/ai-onboarding/brand-tones
Response: { success: boolean, data: BrandTone[] }
```

### Authentication API

#### Register
```
POST /api/v1/auth/register
Body: { 
  name: string, 
  email: string, 
  password: string,
  anonymousSessionId?: string 
}
Response: { 
  success: boolean, 
  data: { user: User, token: string } 
}
```

#### Login
```
POST /api/v1/auth/login
Body: { email: string, password: string }
Response: { 
  success: boolean, 
  data: { user: User, token: string } 
}
```

---

## User Journey Flow

### New User (Progressive Registration)

```
1. User visits landing page (/)
   ↓
2. Clicks "Start Building Free"
   ↓
3. Redirected to /onboarding
   ↓
4. Anonymous session created (localStorage)
   ↓
5. AI conversation starts
   - "What website do you want to build?"
   - User: "Online clothing store"
   - AI detects intent, asks follow-up questions
   - Collects: business name, description, colors, etc.
   ↓
6. AI says "Creating your website..."
   ↓
7. Registration modal appears
   - "Sign up to save your website"
   - Shows preview of what they created
   - Social auth (Google/Facebook) or Email/Password
   ↓
8. User registers
   ↓
9. Backend converts anonymous session to user account
   - Creates User record
   - Creates AiOnboardingProfile
   - Generates Website with AI recommendations
   ↓
10. Redirected to /editor?websiteId={id}
    - Website is pre-populated with AI-generated content
    - User can customize and publish
```

### Returning User

```
1. User visits landing page (/)
   ↓
2. Clicks "Log In" in header
   ↓
3. Login modal appears
   ↓
4. User logs in
   ↓
5. Redirected to /dashboard
   - Shows existing websites
   - Shows onboarding checklist if incomplete
   - Can create new websites
```

---

## Component Integration

### OnboardingRouter
**Location**: `frontend/src/components/onboarding/onboarding-router.tsx`

**Responsibilities**:
- Manages overall onboarding flow
- Handles anonymous → authenticated transition
- Shows AI conversation component
- Shows registration modal at right time
- Redirects after completion

**Props**:
```typescript
{
  userId?: string
  onComplete?: () => void
}
```

### AIConversationOnboarding
**Location**: `frontend/src/components/onboarding/ai-conversation-onboarding.tsx`

**Responsibilities**:
- Displays chat interface
- Manages conversation state
- Sends messages to backend
- Shows typing indicators
- Displays quick action buttons
- Triggers registration when ready

**Props**:
```typescript
{
  onComplete: (websiteId: string) => void
  onRegisterRequired: () => void
}
```

### ContextualRegistrationModal
**Location**: `frontend/src/components/auth/contextual-registration-modal.tsx`

**Responsibilities**:
- Shows registration/login form
- Displays website preview
- Handles social auth
- Converts anonymous session on success

**Props**:
```typescript
{
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: any) => void
  trigger?: 'save_website' | 'time_based' | 'feature_gate' | 'exit_intent'
  context?: {
    websiteName?: string
    websitePreview?: string
    timeSpent?: string
  }
}
```

---

## State Management

### Anonymous Session (localStorage)
```typescript
{
  id: string
  createdAt: number
  expiresAt: number (24 hours)
  conversationData: {
    businessName?: string
    businessType?: string
    intent?: string
    industry?: string
    targetAudience?: string
    preferredLanguage?: string
    brandColors?: { primary, secondary, accent }
    features?: string[]
    siteGoals?: string[]
    brandTone?: string
    keywords?: string[]
  }
  messages: Message[]
  generatedWebsiteId?: string
  currentStep: string
}
```

### Backend Session (In-Memory/Redis)
```typescript
{
  id: string
  userId?: string
  status: 'active' | 'completed' | 'abandoned'
  currentStep: 'initial' | 'intent_detected' | 'collecting_details' | 'generating' | 'preview' | 'complete'
  messages: ConversationMessage[]
  intent?: Intent
  collectedData: { ... }
  generatedWebsiteId?: string
  createdAt: Date
  updatedAt: Date
}
```

---

## Registration Triggers

### 1. Save Website (Primary)
- **When**: User completes conversation, AI generates website
- **Message**: "Sign up to save your website"
- **Context**: Shows website preview

### 2. Time-Based (Secondary)
- **When**: After 5 minutes of active use
- **Message**: "Don't lose your progress"
- **Context**: Shows time spent

### 3. Feature Gate (Tertiary)
- **When**: User tries to access premium feature
- **Message**: "Unlock this feature"
- **Context**: Shows feature name

### 4. Exit Intent (Retention)
- **When**: User tries to close tab
- **Message**: "Before you go..."
- **Context**: Shows unsaved work

---

## Database Schema

### AiOnboardingProfile
```sql
model AiOnboardingProfile {
  id                  String   @id @default(cuid())
  userId              String   @unique
  businessName        String?
  businessDescription String?
  targetAudience      String?
  siteGoals           String[]
  brandTone           String?
  brandColors         Json?
  keywords            String[]
  preferredLanguage   Language
  additionalNotes     String?
  aiRecommendations   Json?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  user                User     @relation(fields: [userId], references: [id])
}
```

---

## Testing Checklist

### Frontend
- [ ] Landing page loads correctly
- [ ] "Start Building Free" redirects to /onboarding
- [ ] Anonymous session is created
- [ ] AI conversation interface appears
- [ ] Messages send and receive correctly
- [ ] Quick action buttons work
- [ ] Registration modal appears at right time
- [ ] Registration form works (email/password)
- [ ] Social auth buttons present (functionality TBD)
- [ ] After registration, redirects to editor
- [ ] Dashboard shows onboarding checklist

### Backend
- [ ] POST /conversation/start creates session
- [ ] POST /conversation/message processes correctly
- [ ] Intent detection works for common inputs
- [ ] Follow-up questions are relevant
- [ ] POST /conversation/generate-website creates profile
- [ ] Anonymous session converts to user account
- [ ] Website is created with AI recommendations
- [ ] All API routes return proper error handling

### Integration
- [ ] End-to-end flow works smoothly
- [ ] No data loss during registration
- [ ] Session persists across page refreshes
- [ ] Proper redirects after each step
- [ ] Error states handled gracefully

---

## Environment Variables

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend
```env
PORT=4000
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://...
REDIS_URL=redis://localhost:6379
```

---

## Deployment Considerations

1. **Session Storage**: Move from in-memory to Redis for production
2. **Rate Limiting**: Add rate limits to conversation endpoints
3. **Analytics**: Track onboarding funnel metrics
4. **A/B Testing**: Test different conversation flows
5. **Error Monitoring**: Set up Sentry or similar
6. **Performance**: Optimize AI response times
7. **Caching**: Cache common intents and responses

---

## Future Enhancements

1. **Voice Input**: Allow users to speak their requirements
2. **Multi-language**: Support Urdu conversation interface
3. **Template Preview**: Show live template previews during conversation
4. **Smart Suggestions**: ML-based intent prediction
5. **Conversation History**: Allow users to review past conversations
6. **Resume Onboarding**: Let users continue from where they left off
7. **Onboarding Analytics**: Track drop-off points and optimize
8. **Social Proof**: Show "X people created websites today"
9. **Personalization**: Customize flow based on user behavior
10. **Video Tutorials**: Embedded help during onboarding

---

## Support & Documentation

- **API Docs**: http://localhost:4000/docs
- **Component Storybook**: (TBD)
- **User Guide**: (TBD)
- **Developer Guide**: This file

---

## Contact

For questions or issues with the onboarding system:
- Create an issue in the repository
- Contact the development team
- Check the API documentation at /docs
