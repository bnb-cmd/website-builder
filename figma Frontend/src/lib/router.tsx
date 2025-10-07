import React, { createContext, useContext, useState, useEffect } from 'react'

// Simple router context for demo purposes
// In production, you'd use Next.js App Router or React Router

interface RouteContext {
  currentPath: string
  navigate: (path: string) => void
  params: Record<string, string>
}

const RouterContext = createContext<RouteContext | null>(null)

export const useRouter = () => {
  const context = useContext(RouterContext)
  if (!context) {
    // Fallback for development
    return {
      currentPath: '/',
      navigate: (path: string) => console.log('Navigate to:', path),
      params: {}
    }
  }
  return context
}

interface RouterProviderProps {
  children: React.ReactNode
}

export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState('/')
  const [params, setParams] = useState<Record<string, string>>({})

  const navigate = (path: string) => {
    setCurrentPath(path)
    // Extract params from path like /dashboard/websites/123/edit
    const pathParts = path.split('/')
    const newParams: Record<string, string> = {}
    
    if (pathParts.includes('websites') && pathParts.length > 3) {
      const websiteIndex = pathParts.indexOf('websites')
      if (pathParts[websiteIndex + 1]) {
        newParams.id = pathParts[websiteIndex + 1]
      }
    }
    
    setParams(newParams)
  }

  useEffect(() => {
    // Handle browser back/forward
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return (
    <RouterContext.Provider value={{ currentPath, navigate, params }}>
      {children}
    </RouterContext.Provider>
  )
}

// Route component for rendering different pages
interface RouteProps {
  path: string
  children: React.ReactNode
}

export const Route: React.FC<RouteProps> = ({ path, children }) => {
  const { currentPath } = useRouter()
  
  // Simple path matching
  const isMatch = () => {
    if (path === currentPath) return true
    
    // Handle dynamic routes like /dashboard/websites/:id/edit
    const pathParts = path.split('/')
    const currentParts = currentPath.split('/')
    
    if (pathParts.length !== currentParts.length) return false
    
    return pathParts.every((part, index) => {
      if (part.startsWith(':')) return true // Dynamic segment
      return part === currentParts[index]
    })
  }

  return isMatch() ? <>{children}</> : null
}

// Link component for navigation
interface LinkProps {
  to: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export const Link: React.FC<LinkProps> = ({ to, children, className, onClick }) => {
  const { navigate } = useRouter()
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate(to)
    onClick?.()
  }
  
  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}