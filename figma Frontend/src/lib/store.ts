import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  language: 'en' | 'ur'
  rtl: boolean
  theme: {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
  }
  integrations: {
    analytics?: string
    ecommerce?: boolean
    payments?: {
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
  description: string
  category: string
  thumbnail: string
  preview: string
  pages: TemplatePage[]
  isPremium: boolean
  tags: string[]
}

interface TemplatePage {
  name: string
  components: PageComponent[]
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
      // Mock API call - replace with actual API
      const response = await fetch('/api/websites')
      const websites = await response.json()
      set({ websites, isLoading: false })
    } catch (error) {
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
      // Mock API call
      const templates: Template[] = [
        {
          id: '1',
          name: 'Modern Business',
          description: 'Professional business website with modern design',
          category: 'business',
          thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
          preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
          pages: [],
          isPremium: false,
          tags: ['business', 'professional', 'modern']
        },
        {
          id: '2',
          name: 'E-commerce Store',
          description: 'Complete online store with product catalog',
          category: 'ecommerce',
          thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
          preview: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
          pages: [],
          isPremium: true,
          tags: ['ecommerce', 'shop', 'products']
        },
        {
          id: '3',
          name: 'Restaurant Menu',
          description: 'Beautiful restaurant website with menu display',
          category: 'restaurant',
          thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
          preview: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
          pages: [],
          isPremium: false,
          tags: ['restaurant', 'food', 'menu']
        }
      ]
      
      set({ templates, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
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