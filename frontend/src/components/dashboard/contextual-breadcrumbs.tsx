'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Home,
  ArrowLeft,
  Zap,
  Plus,
  Settings,
  BarChart3,
  Palette,
  Globe,
  Bell,
  Smartphone,
  Brain,
  Coins
} from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'

interface BreadcrumbConfig {
  [key: string]: {
    label: string
    icon?: any
    parent?: string
    actions?: Array<{
      label: string
      icon: any
      action: () => void
      variant?: 'default' | 'outline' | 'ghost'
    }>
  }
}

const breadcrumbConfig: BreadcrumbConfig = {
  '/dashboard': {
    label: 'Dashboard',
    icon: Home,
  },
  '/dashboard/websites': {
    label: 'Websites',
    icon: Globe,
    parent: '/dashboard',
    actions: [
      {
        label: 'New Website',
        icon: Plus,
        action: () => window.location.href = '/dashboard/websites/new',
        variant: 'default'
      }
    ]
  },
  '/dashboard/websites/new': {
    label: 'Create Website',
    icon: Plus,
    parent: '/dashboard/websites',
  },
  '/dashboard/websites/[id]': {
    label: 'Edit Website',
    icon: Globe,
    parent: '/dashboard/websites',
    actions: [
      {
        label: 'Preview',
        icon: Globe,
        action: () => window.open('/preview', '_blank'),
        variant: 'outline'
      }
    ]
  },
  '/dashboard/templates': {
    label: 'Templates',
    icon: Palette,
    parent: '/dashboard',
    actions: [
      {
        label: 'Upload Template',
        icon: Plus,
        action: () => console.log('Upload template'),
        variant: 'outline'
      }
    ]
  },
  '/dashboard/analytics': {
    label: 'Analytics',
    icon: BarChart3,
    parent: '/dashboard',
    actions: [
      {
        label: 'Export Report',
        icon: BarChart3,
        action: () => console.log('Export report'),
        variant: 'outline'
      }
    ]
  },
  '/dashboard/advanced-ai': {
    label: 'Advanced AI',
    icon: Brain,
    parent: '/dashboard',
    actions: [
      {
        label: 'New Session',
        icon: Zap,
        action: () => console.log('New AI session'),
        variant: 'default'
      }
    ]
  },
  '/dashboard/blockchain': {
    label: 'Blockchain',
    icon: Coins,
    parent: '/dashboard',
  },
  '/dashboard/notifications': {
    label: 'Notifications',
    icon: Bell,
    parent: '/dashboard',
  },
  '/dashboard/pwa': {
    label: 'PWA Settings',
    icon: Smartphone,
    parent: '/dashboard',
  },
  '/dashboard/domains': {
    label: 'Domains',
    icon: Globe,
    parent: '/dashboard',
    actions: [
      {
        label: 'Add Domain',
        icon: Plus,
        action: () => console.log('Add domain'),
        variant: 'default'
      }
    ]
  },
  '/dashboard/billing': {
    label: 'Billing',
    icon: Settings,
    parent: '/dashboard',
  },
  '/dashboard/settings': {
    label: 'Settings',
    icon: Settings,
    parent: '/dashboard',
  },
}

export function ContextualBreadcrumbs() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  // Find the current page config
  const getPageConfig = (path: string) => {
    // Check for dynamic routes
    if (path.includes('/websites/') && path !== '/dashboard/websites') {
      return breadcrumbConfig['/dashboard/websites/[id]']
    }

    return breadcrumbConfig[path]
  }

  const currentConfig = getPageConfig(pathname)

  if (!currentConfig) {
    return null
  }

  // Build breadcrumb trail
  const buildBreadcrumbs = () => {
    const breadcrumbs = []
    let current = pathname

    while (current && current !== '/') {
      const config = getPageConfig(current)
      if (config) {
        breadcrumbs.unshift({ path: current, config })
        if (config.parent) {
          current = config.parent
        } else {
          break
        }
      } else {
        break
      }
    }

    return breadcrumbs
  }

  const breadcrumbs = buildBreadcrumbs()

  const handleBack = () => {
    if (currentConfig.parent) {
      router.push(currentConfig.parent)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex items-center justify-between py-4 px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center space-x-4">
        {/* Back Button */}
        {pathname !== '/dashboard' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        )}

        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage className="flex items-center space-x-2">
                      {crumb.config.icon && <crumb.config.icon className="h-4 w-4" />}
                      <span>{crumb.config.label}</span>
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.path} className="flex items-center space-x-2">
                        {crumb.config.icon && <crumb.config.icon className="h-4 w-4" />}
                        <span>{crumb.config.label}</span>
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Contextual Actions */}
      {currentConfig.actions && currentConfig.actions.length > 0 && (
        <div className="flex items-center space-x-2">
          {currentConfig.actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'default'}
              size="sm"
              onClick={action.action}
              className="flex items-center space-x-2"
            >
              <action.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{action.label}</span>
            </Button>
          ))}
        </div>
      )}

      {/* User Info */}
      <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
        <span>Welcome back,</span>
        <span className="font-medium text-foreground">{user?.name || 'User'}</span>
      </div>
    </div>
  )
}
