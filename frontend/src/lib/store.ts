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
  domain?: string
  template: string
  status: 'draft' | 'published' | 'archived'
  thumbnail?: string
  lastModified: string
  pages: WebsitePage[]
  settings: WebsiteSettings
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
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          // Mock API call - replace with actual API
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          })
          
          if (!response.ok) throw new Error('Login failed')
          
          const data = await response.json()
          set({ 
            user: data.user, 
            token: data.token, 
            isLoading: false 
          })
        } catch (error) {
          // Mock successful login for demo
          set({
            user: {
              id: '1',
              email,
              name: 'Demo User',
              plan: 'free'
            },
            token: 'demo-token',
            isLoading: false
          })
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
      })
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
      set({ websites: Array.isArray(websites) ? websites : [], isLoading: false })
    } catch (error) {
      console.error('Failed to fetch websites:', error)
      // Mock data for demo
      set({
        websites: [
          {
            id: '1',
            name: 'My Business Website',
            template: 'business-modern',
            status: 'published',
            thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
            lastModified: new Date().toISOString(),
            pages: [],
            settings: {
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
      // Mock API call
      const newWebsite: Website = {
        id: Date.now().toString(),
        name: data.name || 'Untitled Website',
        template: data.template || 'blank',
        status: 'draft',
        lastModified: new Date().toISOString(),
        pages: [],
        settings: {
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
        },
        ...data
      }
      
      const websites = [...get().websites, newWebsite]
      set({ websites, isLoading: false })
      return newWebsite
    } catch (error) {
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