import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { Element, WebsiteData, ViewMode, EditorHistory, Theme } from '@/types/editor'
import { apiHelpers } from '@/lib/api'

interface WebsiteStore {
  // Website Data
  websiteId: string | null
  websiteData: WebsiteData | null
  elements: Element[]
  selectedElement: Element | null
  activeElement: Element | null
  
  // Editor State
  viewMode: ViewMode
  isLoading: boolean
  isDirty: boolean
  history: EditorHistory
  canUndo: boolean
  canRedo: boolean
  
  // UI State
  sidebarCollapsed: boolean
  propertiesPanelCollapsed: boolean
  showGrid: boolean
  snapToGrid: boolean
  zoom: number
  
  // Actions
  loadWebsite: (websiteId: string) => Promise<void>
  saveWebsite: (websiteId: string) => Promise<void>
  
  // Element Actions
  addElement: (element: Element, parentId?: string, index?: number) => void
  updateElement: (elementId: string, updates: Partial<Element>) => void
  deleteElement: (elementId: string) => void
  duplicateElement: (elementId: string) => void
  moveElement: (elementId: string, newParentId: string, newIndex: number) => void
  
  // Selection
  selectElement: (elementId: string | null) => void
  setActiveElement: (element: Element | null) => void
  
  // History
  undo: () => void
  redo: () => void
  addToHistory: () => void
  clearHistory: () => void
  
  // View
  setViewMode: (mode: ViewMode) => void
  setZoom: (zoom: number) => void
  toggleGrid: () => void
  toggleSnapToGrid: () => void
  
  // UI
  toggleSidebar: () => void
  togglePropertiesPanel: () => void
  
  // Theme
  updateTheme: (theme: Partial<Theme>) => void
  
  // AI Integration
  generateContent: (prompt: string, elementId: string) => Promise<void>
  optimizeSEO: () => Promise<void>
  
  // Reset
  reset: () => void
}

const initialHistory: EditorHistory = {
  past: [],
  present: [],
  future: []
}

export const useWebsiteStore = create<WebsiteStore>()(
  devtools(
    subscribeWithSelector(
      (set, get) => ({
        // Initial State
        websiteId: null,
        websiteData: null,
        elements: [],
        selectedElement: null,
        activeElement: null,
        
        viewMode: 'desktop',
        isLoading: false,
        isDirty: false,
        history: initialHistory,
        canUndo: false,
        canRedo: false,
        
        sidebarCollapsed: false,
        propertiesPanelCollapsed: false,
        showGrid: false,
        snapToGrid: true,
        zoom: 100,
        
        // Actions
        loadWebsite: async (websiteId: string) => {
          set({ isLoading: true })
          try {
            const response = await apiHelpers.getWebsite(websiteId)
            const websiteData = response.data.data
            
            set({
              websiteId,
              websiteData,
              elements: websiteData.content?.elements || [],
              isLoading: false,
              isDirty: false
            })
            
            get().clearHistory()
            get().addToHistory()
          } catch (error) {
            console.error('Failed to load website:', error)
            set({ isLoading: false })
          }
        },
        
        saveWebsite: async (websiteId: string) => {
          set({ isLoading: true })
          try {
            const { elements, websiteData } = get()
            
            const updatedContent = {
              ...websiteData?.content,
              elements
            }
            
            await apiHelpers.updateWebsite(websiteId, {
              content: updatedContent
            })
            
            set({ isDirty: false, isLoading: false })
          } catch (error) {
            console.error('Failed to save website:', error)
            set({ isLoading: false })
            throw error
          }
        },
        
        addElement: (element: Element, parentId?: string, index?: number) => {
          const { elements } = get()
          
          const addElementToTree = (elements: Element[]): Element[] => {
            if (!parentId) {
              // Add to root level
              const newElements = [...elements]
              if (index !== undefined) {
                newElements.splice(index, 0, element)
              } else {
                newElements.push(element)
              }
              return newElements
            }
            
            return elements.map(el => {
              if (el.id === parentId) {
                const newChildren = [...el.children]
                if (index !== undefined) {
                  newChildren.splice(index, 0, element)
                } else {
                  newChildren.push(element)
                }
                return { ...el, children: newChildren }
              }
              
              if (el.children.length > 0) {
                return { ...el, children: addElementToTree(el.children) }
              }
              
              return el
            })
          }
          
          const newElements = addElementToTree(elements)
          set({ elements: newElements, isDirty: true, selectedElement: element })
          get().addToHistory()
        },
        
        updateElement: (elementId: string, updates: Partial<Element>) => {
          const { elements } = get()
          
          const updateElementInTree = (elements: Element[]): Element[] => {
            return elements.map(el => {
              if (el.id === elementId) {
                const updatedElement = { ...el, ...updates }
                // Update selected element if it's the one being updated
                if (get().selectedElement?.id === elementId) {
                  set({ selectedElement: updatedElement })
                }
                return updatedElement
              }
              
              if (el.children.length > 0) {
                return { ...el, children: updateElementInTree(el.children) }
              }
              
              return el
            })
          }
          
          const newElements = updateElementInTree(elements)
          set({ elements: newElements, isDirty: true })
          get().addToHistory()
        },
        
        deleteElement: (elementId: string) => {
          const { elements, selectedElement } = get()
          
          const deleteElementFromTree = (elements: Element[]): Element[] => {
            return elements
              .filter(el => el.id !== elementId)
              .map(el => ({
                ...el,
                children: deleteElementFromTree(el.children)
              }))
          }
          
          const newElements = deleteElementFromTree(elements)
          const newSelectedElement = selectedElement?.id === elementId ? null : selectedElement
          
          set({ 
            elements: newElements, 
            selectedElement: newSelectedElement,
            isDirty: true 
          })
          get().addToHistory()
        },
        
        duplicateElement: (elementId: string) => {
          const { elements } = get()
          
          const findElement = (elements: Element[], id: string): Element | null => {
            for (const el of elements) {
              if (el.id === id) return el
              const found = findElement(el.children, id)
              if (found) return found
            }
            return null
          }
          
          const element = findElement(elements, elementId)
          if (!element) return
          
          const duplicatedElement: Element = {
            ...element,
            id: `${element.id}-copy-${Date.now()}`,
            children: element.children.map(child => ({
              ...child,
              id: `${child.id}-copy-${Date.now()}`
            }))
          }
          
          get().addElement(duplicatedElement)
        },
        
        moveElement: (elementId: string, newParentId: string, newIndex: number) => {
          // Implementation for moving elements between containers
          const { elements } = get()
          // Complex tree manipulation logic would go here
          set({ elements, isDirty: true })
          get().addToHistory()
        },
        
        selectElement: (elementId: string | null) => {
          if (!elementId) {
            set({ selectedElement: null })
            return
          }
          
          const { elements } = get()
          
          const findElement = (elements: Element[], id: string): Element | null => {
            for (const el of elements) {
              if (el.id === id) return el
              const found = findElement(el.children, id)
              if (found) return found
            }
            return null
          }
          
          const element = findElement(elements, elementId)
          set({ selectedElement: element })
        },
        
        setActiveElement: (element: Element | null) => {
          set({ activeElement: element })
        },
        
        undo: () => {
          const { history } = get()
          if (history.past.length === 0) return
          
          const previous = history.past[history.past.length - 1]
          const newPast = history.past.slice(0, -1)
          const newFuture = [history.present, ...history.future]
          
          set({
            elements: previous,
            history: {
              past: newPast,
              present: previous,
              future: newFuture
            },
            canUndo: newPast.length > 0,
            canRedo: true,
            isDirty: true
          })
        },
        
        redo: () => {
          const { history } = get()
          if (history.future.length === 0) return
          
          const next = history.future[0]
          const newPast = [...history.past, history.present]
          const newFuture = history.future.slice(1)
          
          set({
            elements: next,
            history: {
              past: newPast,
              present: next,
              future: newFuture
            },
            canUndo: true,
            canRedo: newFuture.length > 0,
            isDirty: true
          })
        },
        
        addToHistory: () => {
          const { elements, history } = get()
          const newPast = [...history.past, history.present].slice(-50) // Keep last 50 states
          
          set({
            history: {
              past: newPast,
              present: elements,
              future: []
            },
            canUndo: newPast.length > 0,
            canRedo: false
          })
        },
        
        clearHistory: () => {
          set({
            history: initialHistory,
            canUndo: false,
            canRedo: false
          })
        },
        
        setViewMode: (mode: ViewMode) => {
          set({ viewMode: mode })
        },
        
        setZoom: (zoom: number) => {
          set({ zoom: Math.max(25, Math.min(200, zoom)) })
        },
        
        toggleGrid: () => {
          set(state => ({ showGrid: !state.showGrid }))
        },
        
        toggleSnapToGrid: () => {
          set(state => ({ snapToGrid: !state.snapToGrid }))
        },
        
        toggleSidebar: () => {
          set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }))
        },
        
        togglePropertiesPanel: () => {
          set(state => ({ propertiesPanelCollapsed: !state.propertiesPanelCollapsed }))
        },
        
        updateTheme: (themeUpdates: Partial<Theme>) => {
          const { websiteData } = get()
          if (!websiteData) return
          
          const updatedWebsiteData = {
            ...websiteData,
            theme: { ...websiteData.theme, ...themeUpdates }
          }
          
          set({ websiteData: updatedWebsiteData, isDirty: true })
        },
        
        generateContent: async (prompt: string, elementId: string) => {
          try {
            const response = await apiHelpers.generateContent({
              prompt,
              language: 'ENGLISH',
              contentType: 'blog',
              businessType: 'SERVICE'
            })
            
            const content = response.data.data.content
            get().updateElement(elementId, { props: { content } })
          } catch (error) {
            console.error('Failed to generate content:', error)
          }
        },
        
        optimizeSEO: async () => {
          try {
            const { websiteData } = get()
            if (!websiteData) return
            
            const response = await apiHelpers.optimizeSEO({
              content: JSON.stringify(websiteData),
              language: 'ENGLISH'
            })
            
            const seoData = response.data.data
            
            set({
              websiteData: {
                ...websiteData,
                settings: {
                  ...websiteData.settings,
                  seo: {
                    ...websiteData.settings.seo,
                    ...seoData
                  }
                }
              },
              isDirty: true
            })
          } catch (error) {
            console.error('Failed to optimize SEO:', error)
          }
        },
        
        reset: () => {
          set({
            websiteId: null,
            websiteData: null,
            elements: [],
            selectedElement: null,
            activeElement: null,
            viewMode: 'desktop',
            isLoading: false,
            isDirty: false,
            history: initialHistory,
            canUndo: false,
            canRedo: false,
            sidebarCollapsed: false,
            propertiesPanelCollapsed: false,
            showGrid: false,
            snapToGrid: true,
            zoom: 100
          })
        }
      })
    ),
    { name: 'website-store' }
  )
)
