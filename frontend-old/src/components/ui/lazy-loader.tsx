import React, { Suspense, lazy, ComponentType } from 'react'
import { useProgressiveEnhancement } from '@/hooks/use-progressive-enhancement'
import { cn } from '@/lib/utils'
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface LazyLoaderProps<T extends ComponentType<any>> {
  component: () => Promise<{ default: T }>
  priority: 'critical' | 'high' | 'medium' | 'low'
  fallback?: React.ReactNode
  errorFallback?: React.ReactNode
  className?: string
  componentProps?: React.ComponentProps<T>
}

interface LazyLoaderState {
  Component: ComponentType<any> | null
  error: Error | null
  isLoading: boolean
}

export function LazyLoader<T extends ComponentType<any>>({
  component,
  priority,
  fallback,
  errorFallback,
  className,
  componentProps
}: LazyLoaderProps<T>) {
  const { loadingPriority, lazyLoadComponent } = useProgressiveEnhancement()
  const [state, setState] = React.useState<LazyLoaderState>({
    Component: null,
    error: null,
    isLoading: true
  })

  React.useEffect(() => {
    let isMounted = true

    const loadComponent = async () => {
      try {
        // Check if component is in loading priority
        const componentName = component.name || 'unknown'
        const shouldLoad = loadingPriority[priority].includes(componentName.toLowerCase()) ||
                          priority === 'critical'

        if (!shouldLoad) {
          // Wait for higher priority components to load first
          const delay = priority === 'high' ? 1000 :
                       priority === 'medium' ? 2000 : 3000
          await new Promise(resolve => setTimeout(resolve, delay))
        }

        const LoadedComponent = await lazyLoadComponent(componentName, priority)

        if (isMounted) {
          setState({
            Component: LoadedComponent || React.lazy(component),
            error: null,
            isLoading: false
          })
        }
      } catch (error) {
        console.error(`Failed to load component at priority ${priority}:`, error)
        if (isMounted) {
          setState({
            Component: null,
            error: error as Error,
            isLoading: false
          })
        }
      }
    }

    loadComponent()

    return () => {
      isMounted = false
    }
  }, [component, priority, loadingPriority, lazyLoadComponent])

  const defaultFallback = (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <Loader2 className="h-6 w-6 animate-spin mr-2" />
      <span className="text-sm text-muted-foreground">
        Loading {priority} priority component...
      </span>
    </div>
  )

  const defaultErrorFallback = (
    <Alert className={cn(className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Failed to load component. Please try refreshing the page.
      </AlertDescription>
    </Alert>
  )

  if (state.error) {
    return errorFallback || defaultErrorFallback
  }

  if (state.isLoading || !state.Component) {
    return fallback || defaultFallback
  }

  const Component = state.Component
  return <Component {...(componentProps || {})} />
}

// Higher-order component for lazy loading with progressive enhancement
export function withLazyLoading<T extends ComponentType<any>>(
  component: () => Promise<{ default: T }>,
  options: {
    priority: 'critical' | 'high' | 'medium' | 'low'
    fallback?: React.ReactNode
    errorFallback?: React.ReactNode
  }
) {
  return React.forwardRef<any, React.ComponentProps<T>>((props, ref) => (
    <LazyLoader
      component={component}
      priority={options.priority}
      fallback={options.fallback}
      errorFallback={options.errorFallback}
      componentProps={{ ...props, ref }}
    />
  ))
}

// Component for batch loading multiple components
interface BatchLoaderProps {
  components: Array<{
    id: string
    component: () => Promise<{ default: ComponentType<any> }>
    priority: 'critical' | 'high' | 'medium' | 'low'
  }>
  children: (loadedComponents: Record<string, ComponentType<any>>) => React.ReactNode
  fallback?: React.ReactNode
}

export function BatchLoader({ components, children, fallback }: BatchLoaderProps) {
  const { loadingPriority } = useProgressiveEnhancement()
  const [loadedComponents, setLoadedComponents] = React.useState<Record<string, ComponentType<any>>>({})
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const loadComponents = async () => {
      const loaded: Record<string, ComponentType<any>> = {}

      // Load components in priority order
      const priorities: Array<'critical' | 'high' | 'medium' | 'low'> = ['critical', 'high', 'medium', 'low']

      for (const priority of priorities) {
        const priorityComponents = components.filter(c => c.priority === priority)

        if (priorityComponents.length > 0) {
          // Load components of same priority in parallel
          const promises = priorityComponents.map(async (comp) => {
            try {
              const module = await comp.component()
              loaded[comp.id] = module.default
            } catch (error) {
              console.error(`Failed to load ${comp.id}:`, error)
            }
          })

          await Promise.all(promises)
        }
      }

      setLoadedComponents(loaded)
      setLoading(false)
    }

    loadComponents()
  }, [components, loadingPriority])

  if (loading) {
    return fallback || (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin mr-3" />
        <span>Loading enhanced features...</span>
      </div>
    )
  }

  return <>{children(loadedComponents)}</>
}

// Hook for conditional loading based on user interaction
export function useLazyLoadOnDemand() {
  const [loadedComponents, setLoadedComponents] = React.useState<Record<string, ComponentType<any>>>({})

  const loadComponent = React.useCallback(async (
    id: string,
    component: () => Promise<{ default: ComponentType<any> }>
  ) => {
    if (loadedComponents[id]) {
      return loadedComponents[id]
    }

    try {
      const module = await component()
      const Component = module.default

      setLoadedComponents(prev => ({
        ...prev,
        [id]: Component
      }))

      return Component
    } catch (error) {
      console.error(`Failed to load component ${id}:`, error)
      throw error
    }
  }, [loadedComponents])

  return { loadedComponents, loadComponent }
}
