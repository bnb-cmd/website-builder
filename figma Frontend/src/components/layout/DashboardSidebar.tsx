import React from 'react'
import { Link, useRouter } from '../../lib/router'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { 
  LayoutDashboard, 
  Globe, 
  Layout, 
  Settings, 
  Plus, 
  CreditCard,
  Users,
  BarChart3,
  FileText,
  Palette,
  Zap,
  X
} from 'lucide-react'

interface SidebarProps {
  className?: string
  isOpen?: boolean
  onClose?: () => void
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'My Websites',
    href: '/dashboard/websites',
    icon: Globe,
  },
  {
    name: 'Templates',
    href: '/dashboard/templates',
    icon: Layout,
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    badge: 'Pro'
  },
]

const tools = [
  {
    name: 'AI Assistant',
    href: '/dashboard/ai',
    icon: Zap,
    badge: 'New'
  },
  {
    name: 'SEO Tools',
    href: '/dashboard/seo',
    icon: FileText,
    badge: 'Pro'
  },
  {
    name: 'Brand Kit',
    href: '/dashboard/brand',
    icon: Palette,
  },
  {
    name: 'Team',
    href: '/dashboard/team',
    icon: Users,
    badge: 'Pro'
  },
]

const account = [
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    name: 'Billing',
    href: '/dashboard/billing',
    icon: CreditCard,
  },
]

export const DashboardSidebar: React.FC<SidebarProps> = ({ 
  className, 
  isOpen = true, 
  onClose 
}) => {
  const { currentPath, navigate } = useRouter()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return currentPath === '/dashboard'
    }
    return currentPath.startsWith(href)
  }

  const handleNavigation = (href: string) => {
    navigate(href)
    if (onClose) onClose()
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 transform border-r bg-sidebar transition-transform duration-200 ease-in-out md:relative md:translate-x-0 border-sidebar-border",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-xs">W</span>
              </div>
              <span className="font-semibold text-sm">WebBuilder</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-3 py-4">
            {/* Create New Button */}
            <div className="mb-6 px-1">
              <Button 
                className="w-full justify-start h-9"
                onClick={() => handleNavigation('/dashboard/websites/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Website
              </Button>
            </div>

            {/* Main Navigation */}
            <div className="space-y-1">
              <div className="px-1 py-2">
                <h2 className="mb-2 px-2 text-xs font-medium tracking-tight text-muted-foreground uppercase">
                  Main
                </h2>
                <div className="space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    return (
                      <Button
                        key={item.name}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start h-8 text-sm font-normal",
                          active && "bg-sidebar-accent text-sidebar-accent-foreground"
                        )}
                        onClick={() => handleNavigation(item.href)}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.name}
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto text-xs h-5 px-1.5">
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    )
                  })}
                </div>
              </div>

              <Separator className="mx-1" />

              {/* Tools */}
              <div className="px-1 py-2">
                <h2 className="mb-2 px-2 text-xs font-medium tracking-tight text-muted-foreground uppercase">
                  Tools
                </h2>
                <div className="space-y-1">
                  {tools.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    return (
                      <Button
                        key={item.name}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start h-8 text-sm font-normal",
                          active && "bg-sidebar-accent text-sidebar-accent-foreground"
                        )}
                        onClick={() => handleNavigation(item.href)}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.name}
                        {item.badge && (
                          <Badge 
                            variant={item.badge === 'New' ? 'default' : 'secondary'} 
                            className="ml-auto text-xs h-5 px-1.5"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    )
                  })}
                </div>
              </div>

              <Separator className="mx-1" />

              {/* Account */}
              <div className="px-1 py-2">
                <h2 className="mb-2 px-2 text-xs font-medium tracking-tight text-muted-foreground uppercase">
                  Account
                </h2>
                <div className="space-y-1">
                  {account.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    return (
                      <Button
                        key={item.name}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start h-8 text-sm font-normal",
                          active && "bg-sidebar-accent text-sidebar-accent-foreground"
                        )}
                        onClick={() => handleNavigation(item.href)}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-3">
            <div className="rounded-md bg-muted p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium">Free Plan</p>
                  <p className="text-xs text-muted-foreground">2/3 websites used</p>
                </div>
                <Button size="sm" className="h-7 text-xs" onClick={() => handleNavigation('/dashboard/billing')}>
                  Upgrade
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}