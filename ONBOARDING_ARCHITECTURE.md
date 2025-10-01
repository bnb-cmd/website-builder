# Onboarding System Architecture

## System Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER JOURNEY                                   │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Landing    │      │  Onboarding  │      │ Registration │      │    Editor    │
│   Page (/)   │─────▶│ (/onboarding)│─────▶│    Modal     │─────▶│   /editor    │
│              │      │              │      │              │      │              │
│ "Start Free" │      │ AI Chat      │      │ Sign Up      │      │ Customize    │
└──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘
                              │                      │
                              ▼                      ▼
                      ┌──────────────┐      ┌──────────────┐
                      │  Anonymous   │      │   Convert    │
                      │   Session    │      │   Session    │
                      │ (localStorage)│      │  to Account  │
                      └──────────────┘      └──────────────┘
```

---

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND COMPONENTS                               │
└─────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────────┐
                        │  OnboardingRouter   │
                        │  (Orchestrator)     │
                        └──────────┬──────────┘
                                   │
                ┌──────────────────┼──────────────────┐
                │                  │                  │
                ▼                  ▼                  ▼
    ┌──────────────────┐  ┌──────────────┐  ┌──────────────────┐
    │ AIConversation   │  │ Registration │  │ AnonymousSession │
    │   Onboarding     │  │    Modal     │  │    Manager       │
    └──────────────────┘  └──────────────┘  └──────────────────┘
            │                     │                   │
            │                     │                   │
            ▼                     ▼                   ▼
    ┌──────────────────┐  ┌──────────────┐  ┌──────────────────┐
    │ • Message Thread │  │ • Social Auth│  │ • localStorage   │
    │ • Input Area     │  │ • Email/Pass │  │ • 24hr TTL       │
    │ • Quick Actions  │  │ • Benefits   │  │ • Data Storage   │
    └──────────────────┘  └──────────────┘  └──────────────────┘
```

---

## Backend Service Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         BACKEND SERVICES                                 │
└─────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────────┐
                        │   API Routes Layer  │
                        │  /v1/conversation/* │
                        └──────────┬──────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │ ConversationOrchestrator │
                    │  (Main Controller)       │
                    └──────────┬───────────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
    ┌──────────────────┐  ┌──────────────┐  ┌──────────────────┐
    │ IntentDetection  │  │ AIOnboarding │  │  Session Store   │
    │    Service       │  │   Service    │  │  (In-Memory)     │
    └──────────────────┘  └──────────────┘  └──────────────────┘
            │                     │                   │
            ▼                     ▼                   ▼
    ┌──────────────────┐  ┌──────────────┐  ┌──────────────────┐
    │ • Keyword Match  │  │ • Create     │  │ • Session Data   │
    │ • Industry ID    │  │   Profile    │  │ • Messages       │
    │ • Feature Suggest│  │ • Generate   │  │ • State          │
    │ • Language Detect│  │   Website    │  │                  │
    └──────────────────┘  └──────────────┘  └──────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW                                      │
└─────────────────────────────────────────────────────────────────────────┘

USER INPUT                                              SYSTEM RESPONSE
    │                                                          │
    │ "I want an online store"                                │
    ▼                                                          │
┌──────────────────┐                                          │
│  Frontend        │                                          │
│  • Capture input │                                          │
│  • Save to local │                                          │
└────────┬─────────┘                                          │
         │                                                    │
         │ POST /v1/conversation/message                      │
         ▼                                                    │
┌──────────────────┐                                          │
│  Backend API     │                                          │
│  • Receive msg   │                                          │
└────────┬─────────┘                                          │
         │                                                    │
         ▼                                                    │
┌──────────────────┐                                          │
│ Intent Detection │                                          │
│  • Analyze text  │                                          │
│  • Detect intent │                                          │
│  • Confidence    │                                          │
└────────┬─────────┘                                          │
         │                                                    │
         │ Intent: ecommerce (0.8)                            │
         ▼                                                    │
┌──────────────────┐                                          │
│  Orchestrator    │                                          │
│  • Update state  │                                          │
│  • Generate resp │                                          │
└────────┬─────────┘                                          │
         │                                                    │
         │ "Great! I'll help you build..."                    │
         ▼                                                    │
┌──────────────────┐                                          │
│  Response        │                                          │
│  • AI message    │                                          │
│  • Quick actions │                                          │
│  • Suggestions   │                                          │
└────────┬─────────┘                                          │
         │                                                    │
         └──────────────────────────────────────────────────▶│
                                                              │
                                                              ▼
                                                    ┌──────────────────┐
                                                    │  Display to User │
                                                    │  • Message       │
                                                    │  • Buttons       │
                                                    └──────────────────┘
```

---

## State Machine

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CONVERSATION STATE MACHINE                            │
└─────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────┐
                        │   INITIAL   │
                        │  (Welcome)  │
                        └──────┬──────┘
                               │
                               │ User sends message
                               ▼
                    ┌──────────────────┐
                    │ INTENT_DETECTED  │
                    │ (Confirm intent) │
                    └────────┬─────────┘
                             │
                             │ User confirms
                             ▼
                ┌────────────────────────┐
                │ COLLECTING_DETAILS     │
                │ (Ask questions)        │
                └────────┬───────────────┘
                         │
                         │ All data collected
                         ▼
                ┌────────────────────────┐
                │    GENERATING          │
                │ (Create website)       │
                └────────┬───────────────┘
                         │
                         │ Website ready
                         ▼
                ┌────────────────────────┐
                │      PREVIEW           │
                │ (Show result)          │
                └────────┬───────────────┘
                         │
                         │ User satisfied
                         ▼
                ┌────────────────────────┐
                │     COMPLETE           │
                │ (Redirect to editor)   │
                └────────────────────────┘
```

---

## Registration Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      REGISTRATION TRIGGERS                               │
└─────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────┐
                        │  Conversation   │
                        │   In Progress   │
                        └────────┬────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
    ┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
    │  Save Website    │  │  Time-Based  │  │ Feature Gate │
    │   (Primary)      │  │  (5 minutes) │  │  (Premium)   │
    └────────┬─────────┘  └──────┬───────┘  └──────┬───────┘
             │                   │                  │
             └───────────────────┼──────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  Registration Modal    │
                    │      Appears           │
                    └────────┬───────────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                ▼            ▼            ▼
    ┌──────────────┐  ┌──────────┐  ┌──────────┐
    │   Google     │  │ Facebook │  │  Email   │
    │    Auth      │  │   Auth   │  │ Password │
    └──────┬───────┘  └────┬─────┘  └────┬─────┘
           │               │             │
           └───────────────┼─────────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │   User Registered    │
                │  • Create account    │
                │  • Convert session   │
                │  • Generate website  │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │  Redirect to Editor  │
                └──────────────────────┘
```

---

## Database Schema

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        DATABASE SCHEMA                                   │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│       User           │
├──────────────────────┤
│ id: String (PK)      │
│ email: String        │
│ name: String         │
│ password: String     │
│ createdAt: DateTime  │
└──────────┬───────────┘
           │
           │ 1:1
           ▼
┌──────────────────────────────┐
│  AiOnboardingProfile         │
├──────────────────────────────┤
│ id: String (PK)              │
│ userId: String (FK)          │
│ businessName: String         │
│ businessDescription: String  │
│ targetAudience: String       │
│ siteGoals: String[]          │
│ brandTone: String            │
│ brandColors: Json            │
│ keywords: String[]           │
│ preferredLanguage: Language  │
│ aiRecommendations: Json      │
│ createdAt: DateTime          │
│ updatedAt: DateTime          │
└──────────┬───────────────────┘
           │
           │ 1:N
           ▼
┌──────────────────────┐
│      Website         │
├──────────────────────┤
│ id: String (PK)      │
│ userId: String (FK)  │
│ name: String         │
│ status: Status       │
│ content: Json        │
│ createdAt: DateTime  │
│ updatedAt: DateTime  │
└──────────┬───────────┘
           │
           │ 1:N
           ▼
┌──────────────────────┐
│       Page           │
├──────────────────────┤
│ id: String (PK)      │
│ websiteId: String    │
│ title: String        │
│ content: Json        │
│ order: Int           │
└──────────────────────┘
```

---

## API Request/Response Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    API REQUEST/RESPONSE                                  │
└─────────────────────────────────────────────────────────────────────────┘

CLIENT                          SERVER                        DATABASE
  │                               │                               │
  │ POST /conversation/start      │                               │
  ├──────────────────────────────▶│                               │
  │                               │ Create session                │
  │                               ├──────────────────────────────▶│
  │                               │                               │
  │                               │◀──────────────────────────────┤
  │◀──────────────────────────────┤ Session created               │
  │ { sessionId, messages }       │                               │
  │                               │                               │
  │ POST /conversation/message    │                               │
  ├──────────────────────────────▶│                               │
  │ { sessionId, message }        │                               │
  │                               │ Detect intent                 │
  │                               │ Generate response             │
  │                               │ Update session                │
  │                               ├──────────────────────────────▶│
  │                               │                               │
  │                               │◀──────────────────────────────┤
  │◀──────────────────────────────┤                               │
  │ { aiResponse, session }       │                               │
  │                               │                               │
  │ POST /auth/register           │                               │
  ├──────────────────────────────▶│                               │
  │ { email, password, sessionId }│                               │
  │                               │ Create user                   │
  │                               │ Convert session               │
  │                               ├──────────────────────────────▶│
  │                               │ INSERT User                   │
  │                               │ INSERT Profile                │
  │                               │ INSERT Website                │
  │                               │◀──────────────────────────────┤
  │◀──────────────────────────────┤                               │
  │ { user, token, websiteId }    │                               │
  │                               │                               │
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SECURITY LAYERS                                  │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ Layer 1: Network Security                                            │
│ • HTTPS/TLS encryption                                               │
│ • CORS configuration                                                 │
│ • Rate limiting                                                      │
└──────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Layer 2: Authentication                                              │
│ • JWT tokens                                                         │
│ • Password hashing (bcrypt)                                          │
│ • Session management                                                 │
└──────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Layer 3: Authorization                                               │
│ • User permissions                                                   │
│ • Resource ownership                                                 │
│ • Role-based access                                                  │
└──────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Layer 4: Data Protection                                             │
│ • Input validation                                                   │
│ • SQL injection prevention                                           │
│ • XSS protection                                                     │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      PRODUCTION DEPLOYMENT                               │
└─────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────┐
                        │   CloudFlare    │
                        │   (CDN/WAF)     │
                        └────────┬────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
    ┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
    │   Frontend       │  │   Backend    │  │   Static     │
    │   (Vercel)       │  │  (Railway)   │  │   Assets     │
    │                  │  │              │  │   (S3/CDN)   │
    └──────────────────┘  └──────┬───────┘  └──────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
    ┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
    │   PostgreSQL     │  │    Redis     │  │  File Store  │
    │   (Supabase)     │  │  (Upstash)   │  │  (S3)        │
    └──────────────────┘  └──────────────┘  └──────────────┘
```

---

## Monitoring & Analytics

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    MONITORING STACK                                      │
└─────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────┐
                        │  Application    │
                        │   (Frontend +   │
                        │    Backend)     │
                        └────────┬────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
    ┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
    │   Error Track    │  │  Analytics   │  │  Performance │
    │   (Sentry)       │  │  (Mixpanel)  │  │  (Datadog)   │
    └──────────────────┘  └──────────────┘  └──────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   Dashboard     │
                        │   (Grafana)     │
                        └─────────────────┘
```

---

## Scalability Considerations

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      SCALING STRATEGY                                    │
└─────────────────────────────────────────────────────────────────────────┘

CURRENT (MVP)                          FUTURE (Scale)
    │                                      │
    ▼                                      ▼
┌──────────────────┐              ┌──────────────────┐
│ Single Backend   │              │ Load Balancer    │
│ Instance         │              │                  │
└──────────────────┘              └────────┬─────────┘
    │                                      │
    │                         ┌────────────┼────────────┐
    ▼                         │            │            │
┌──────────────────┐          ▼            ▼            ▼
│ In-Memory        │    ┌─────────┐  ┌─────────┐  ┌─────────┐
│ Sessions         │    │Backend 1│  │Backend 2│  │Backend 3│
└──────────────────┘    └────┬────┘  └────┬────┘  └────┬────┘
                             │            │            │
                             └────────────┼────────────┘
                                          │
                                          ▼
                                  ┌──────────────────┐
                                  │  Redis Cluster   │
                                  │  (Sessions)      │
                                  └──────────────────┘
```

---

This architecture supports:
- ✅ Progressive registration
- ✅ Real-time conversation
- ✅ Scalable backend
- ✅ Secure authentication
- ✅ Fast performance
- ✅ Easy monitoring
- ✅ Future growth
