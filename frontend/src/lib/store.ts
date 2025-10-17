import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiHelpers } from './api'

// User interface
interface User {
  id: string
  email: string
  name: string
  avatar?: string
  plan: 'free' | 'pro' | 'enterprise'
  subscription?: {
    status: 'active' | 'canceled' | 'past_due'
    endDate: string
  }
}

// Website interface
interface Website {
  id: string
  name: string
  description?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  content?: string
  customCSS?: string
  customJS?: string
  subdomain?: string
  customDomain?: string
  businessType?: string
  language: string
  templateId?: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  userId?: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  domain?: string
  template: string
  thumbnail?: string
  lastModified: string
  pages: WebsitePage[]
  websiteSettings: WebsiteSettings
}

interface WebsitePage {
  id: string
  name: string
  path: string
  components: PageComponent[]
  seo: {
    title: string
    description: string
    keywords: string[]
  }
}

interface PageComponent {
  id: string
  type: string
  props: Record<string, any>
  children?: PageComponent[]
  style?: Record<string, any>
}

interface WebsiteSettings {
  language: string
  rtl: boolean
  theme: {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
  }
  integrations: {
    ecommerce: boolean
    payments: {
      jazzcash: boolean
      easypaisa: boolean
      stripe: boolean
    }
  }
}

// Template interface
interface Template {
  id: string
  name: string
  category: string
  description: string
  thumbnail: string
  isPremium: boolean
  isNew?: boolean
  rating?: number
  downloads?: number
  difficulty?: string
  estimatedTime?: string
  price?: number
  tags: string[]
  pages: string[]
  features: string[]
  elements: any[]
}

// Auth store
interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  _hasHydrated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; user?: any; error?: any }>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  autoLogin: () => Promise<{ success: boolean; user?: User }>
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      _hasHydrated: false,

      login: async (email: string, password: string): Promise<{ success: boolean; user?: any; error?: any }> => {
        set({ isLoading: true })
        
        try {
          // Use real API for authentication
          const response = await apiHelpers.login(email, password)
          
          if (response.success) {
            const { user, accessToken, refreshToken } = response.data
            
            // Store tokens consistently - only on client side
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth-token', accessToken)
              localStorage.setItem('refresh-token', refreshToken)
            }
            
            set({ 
              user, 
              token: accessToken,
              isLoading: false 
            })
            
            return { success: true, user }
          } else {
            set({ isLoading: false })
            return { success: false, error: response.error?.message || 'Login failed' }
          }
        } catch (error: any) {
          console.error('Login error:', error)
          set({ isLoading: false })
          return { success: false, error: error.message || 'Login failed' }
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true })
        try {
          // Mock API call - replace with actual API
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name })
          })
          
          if (!response.ok) throw new Error('Registration failed')
          
          const data = await response.json()
          set({ 
            user: data.user, 
            token: data.token, 
            isLoading: false 
          })
        } catch (error) {
          // Mock successful registration for demo
          set({
            user: {
              id: '1',
              email,
              name,
              plan: 'free'
            },
            token: 'demo-token',
            isLoading: false
          })
        }
      },

      logout: () => {
        set({ user: null, token: null })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token')
          localStorage.removeItem('refresh-token')
        }
      },

      // Auto-login with admin credentials for development
      autoLogin: async () => {
        console.log('🔐 Auto-login function called')
        
        // Prevent multiple auto-login attempts
        if (get().isLoading) {
          console.log('⏳ Auto-login already in progress')
          return { success: false, error: 'Login already in progress' }
        }
        
        // Don't auto-login if user is already logged in
        if (get().user) {
          console.log('✅ User already logged in:', get().user?.email)
          return { success: true, user: get().user }
        }
        
        console.log('🚀 Starting auto-login process...')
        set({ isLoading: true })
        
        try {
          console.log('📡 Making login API call...')
          const response = await apiHelpers.login(
            'admin@pakistan-website-builder.com', 
            'Admin123!@#'
          )
          
          console.log('📦 Login API response:', response)
          
          if (response.success) {
            const { user, accessToken, refreshToken } = response.data
            
            console.log('🔑 Storing tokens...')
            // Store tokens consistently - only on client side
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth-token', accessToken)
              localStorage.setItem('refresh-token', refreshToken)
            }
            
            // Update store state
            set({ 
              user, 
              token: accessToken,
              isLoading: false 
            })
            
            // Wait a bit to ensure token is stored
            await new Promise(resolve => setTimeout(resolve, 100))
            
            console.log('✅ Auto-login successful:', user.email)
            return { success: true, user }
          } else {
            console.error('❌ Auto-login failed - API returned error:', response)
          }
        } catch (error) {
          console.error('❌ Auto-login failed with error:', error)
        }
        
        set({ isLoading: false })
        return { success: false }
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } })
        }
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
      onRehydrateStorage: () => (state) => {
        console.log('🔄 Zustand store rehydrating...', state)
        if (state) {
          state._hasHydrated = true
          console.log('✅ Zustand store hydrated successfully')
        }
      }
    }
  )
)

// Website store
interface WebsiteState {
  websites: Website[]
  currentWebsite: Website | null
  isLoading: boolean
  fetchWebsites: () => Promise<void>
  createWebsite: (data: Partial<Website>) => Promise<Website>
  updateWebsite: (id: string, data: Partial<Website>) => Promise<void>
  deleteWebsite: (id: string) => Promise<void>
  setCurrentWebsite: (website: Website | null) => void
}

export const useWebsiteStore = create<WebsiteState>((set, get) => ({
  websites: [],
  currentWebsite: null,
  isLoading: false,

  fetchWebsites: async () => {
    set({ isLoading: true })
    try {
      const response = await apiHelpers.getWebsites()
      // Handle the API response structure: { success: true, data: [...] }
      const websites = response.success ? response.data : response
      set({ websites: Array.isArray(websites) ? websites as unknown as Website[] : [], isLoading: false })
    } catch (error) {
      console.error('Failed to fetch websites:', error)
      // Mock data for demo
      set({
        websites: [
          {
            id: '1',
            name: 'My Business Website',
            template: 'business-modern',
            status: 'PUBLISHED',
            thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
            lastModified: new Date().toISOString(),
            language: 'ENGLISH',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            pages: [],
            websiteSettings: {
              language: 'en',
              rtl: false,
              theme: {
                primaryColor: '#030213',
                secondaryColor: '#e9ebef',
                fontFamily: 'Inter'
              },
              integrations: {
                ecommerce: false,
                payments: {
                  jazzcash: false,
                  easypaisa: false,
                  stripe: false
                }
              }
            }
          }
        ],
        isLoading: false
      })
    }
  },

  createWebsite: async (data: Partial<Website>) => {
    set({ isLoading: true })
    try {
      console.log('🔧 Creating website with data:', data)
      
      // Call real API
      const response = await apiHelpers.createWebsite({
        name: data.name || 'Untitled Website',
        templateId: data.template,
        description: (data as any).description,
        businessType: (data as any).businessType || 'OTHER',
        language: (data as any).language || 'ENGLISH',
        content: (data as any).content,
        websiteSettings: (data as any).settings
      })
      
      console.log('🔧 API response:', response)
      
      // Handle API response structure
      const newWebsite = response.success ? response.data : response
      
      // Update local state
      const websites = [...get().websites, newWebsite]
      set({ websites, isLoading: false })
      
      return newWebsite
    } catch (error) {
      console.error('❌ Failed to create website:', error)
      set({ isLoading: false })
      throw error
    }
  },

  updateWebsite: async (id: string, data: Partial<Website>) => {
    const websites = get().websites.map(website => 
      website.id === id 
        ? { ...website, ...data, lastModified: new Date().toISOString() }
        : website
    )
    set({ websites })
  },

  deleteWebsite: async (id: string) => {
    const websites = get().websites.filter(website => website.id !== id)
    set({ websites })
  },

  setCurrentWebsite: (website: Website | null) => {
    set({ currentWebsite: website })
  }
}))

// Template store
interface TemplateState {
  templates: Template[]
  isLoading: boolean
  fetchTemplates: () => Promise<void>
  getTemplatesByCategory: (category: string) => Template[]
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  isLoading: false,

  fetchTemplates: async () => {
    set({ isLoading: true })
    try {
      // Mock API call - replace with actual API
      const response = await fetch('/api/templates')
      const templates = await response.json()
      set({ templates, isLoading: false })
    } catch (error) {
      // Mock data for demo
      set({
        templates: [
          {
            id: '1',
            name: 'Modern Business',
            category: 'Business',
            description: 'Clean and professional business template',
            thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
            isPremium: false,
            rating: 4.5,
            downloads: 1250,
            difficulty: 'Easy',
            estimatedTime: '30 minutes',
            price: 0,
            tags: ['business', 'modern', 'professional'],
            pages: ['Home', 'About', 'Services', 'Contact'],
            features: ['Responsive', 'SEO Ready', 'Contact Form'],
            elements: []
          }
        ],
        isLoading: false
      })
    }
  },

  getTemplatesByCategory: (category: string) => {
    return get().templates.filter(template => template.category === category)
  }
}))

// Editor store
interface EditorState {
  selectedComponent: PageComponent | null
  draggedComponent: PageComponent | null
  isPreviewMode: boolean
  setSelectedComponent: (component: PageComponent | null) => void
  setDraggedComponent: (component: PageComponent | null) => void
  togglePreviewMode: () => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  selectedComponent: null,
  draggedComponent: null,
  isPreviewMode: false,

  setSelectedComponent: (component: PageComponent | null) => {
    set({ selectedComponent: component })
  },

  setDraggedComponent: (component: PageComponent | null) => {
    set({ draggedComponent: component })
  },

  togglePreviewMode: () => {
    set({ isPreviewMode: !get().isPreviewMode })
  }
}))