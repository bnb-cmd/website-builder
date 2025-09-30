'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import {
  Globe,
  LayoutDashboard,
  Settings,
  CreditCard,
  Users,
  BarChart3,
  Palette,
  Zap,
  HelpCircle,
  Menu,
  X,
  LogOut,
  User,
  Bell,
  Smartphone,
  Brain,
  Coins,
  Plus,
  Globe2,
  ChevronDown,
  ChevronRight,
  Home,
  FileText,
  Search
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ContextualBreadcrumbs } from './contextual-breadcrumbs'
import { CommandPalette } from './command-palette'
import { PerformanceMonitor } from '@/components/ui/performance-monitor'
import { FeatureGate } from '@/components/ui/progressive-enhancer'
import { PWAManager } from '@/components/ui/pwa-manager'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigationGroups = [
  {
    title: 'Core',
    icon: LayoutDashboard,
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Websites', href: '/dashboard/websites', icon: Globe },
      { name: 'Templates', href: '/dashboard/templates', icon: Palette }
    ]
  },
  {
    title: 'Marketing',
    icon: BarChart3,
    items: [
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
      { name: 'AI Marketing', href: '/dashboard/ai-marketing', icon: Zap },
      { name: 'Social Media', href: '/dashboard/social-media', icon: Users },
      { name: 'Notifications', href: '/dashboard/notifications', icon: Bell }
    ]
  },
  {
    title: 'Advanced',
    icon: Brain,
    items: [
      { name: 'Advanced AI', href: '/dashboard/advanced-ai', icon: Brain },
      { name: 'Blockchain', href: '/dashboard/blockchain', icon: Coins },
      { name: 'Integrations', href: '/dashboard/integrations', icon: Zap },
      { name: 'PWA Settings', href: '/dashboard/pwa', icon: Smartphone }
    ]
  },
  {
    title: 'Business',
    icon: Settings,
    items: [
      { name: 'Domains', href: '/dashboard/domains', icon: Globe2 },
      { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
      { name: 'Help', href: '/dashboard/help', icon: HelpCircle }
    ]
  }
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Core']))
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(groupTitle)) {
        newSet.delete(groupTitle)
      } else {
        newSet.add(groupTitle)
      }
      return newSet
    })
  }

  const handleCreateWebsite = () => {
    router.push('/dashboard/websites/new')
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Screen Reader Announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="sr-announcements" />

      {/* Skip Links Target */}
      <div id="main-content" /> {/* Skip link target */}
      {/* Sidebar */}
      <nav
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-card border-r border-border transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
        aria-label="Main navigation"
        id="navigation"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-border">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary-foreground" />
              </div>
              {!sidebarCollapsed && <span className="text-lg font-bold gradient-text">Pakistan Builder</span>}
            </Link>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex"
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigationGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.title)}
                  className={cn(
                    'flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <group.icon className="h-4 w-4" />
                    {!sidebarCollapsed && <span>{group.title}</span>}
                  </div>
                  {!sidebarCollapsed && (
                    expandedGroups.has(group.title) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )
                  )}
                </button>

                {/* Group Items */}
                {expandedGroups.has(group.title) && !sidebarCollapsed && (
                  <div className="ml-4 space-y-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                          'hover:bg-accent hover:text-accent-foreground',
                          pathname === item.href && 'bg-accent text-accent-foreground'
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* User Menu */}
          <div className="p-4 border-t border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`w-full ${sidebarCollapsed ? 'justify-center p-2' : 'justify-start space-x-2 p-2'}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>
                      {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {!sidebarCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{user?.name}</div>
                      <div className="text-xs text-muted-foreground">{user?.email}</div>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard/billing')}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'}`}>
        {/* Enhanced Mobile Header */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 px-4 py-3 lg:hidden sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="hover:bg-gray-100"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Globe className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900">Pakistan Builder</h1>
                <p className="text-xs text-gray-500">Welcome back, {user?.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Quick Actions */}
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <Bell className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleCreateWebsite} 
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Contextual Breadcrumbs */}
        <ContextualBreadcrumbs />

        {/* Page Content */}
        <main
          className="flex-1 overflow-auto pb-20 md:pb-0"
          role="main"
          aria-label="Main content"
        >
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Command Palette */}
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
        <div className="flex items-center justify-around py-2 px-4">
          {[
            { name: 'Dashboard', href: '/dashboard', icon: Home, active: pathname === '/dashboard' },
            { name: 'Templates', href: '/dashboard/templates', icon: Palette, active: pathname === '/dashboard/templates' },
            { name: 'Websites', href: '/dashboard/websites', icon: Globe, active: pathname === '/dashboard/websites' },
            { name: 'Search', href: '#', icon: Search, active: commandPaletteOpen, onClick: () => setCommandPaletteOpen(true) }
          ].map((item) => (
            <button
              key={item.name}
              onClick={item.onClick || (() => router.push(item.href))}
              className={cn(
                'flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0 flex-1',
                item.active
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.name}</span>
            </button>
          ))}
        </div>

        {/* Safe area for devices with home indicator */}
        <div className="h-safe-area-inset-bottom bg-background" />
      </div>

      {/* Adjust main content for mobile bottom nav */}
      <style jsx global>{`
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .mobile-bottom-nav {
            padding-bottom: calc(80px + env(safe-area-inset-bottom));
          }
        }
      `}</style>

      {/* Progressive Enhancement - Performance Monitor */}
      <FeatureGate feature="backgroundProcessing">
        <PerformanceMonitor showRecommendations={true} />
      </FeatureGate>

      {/* PWA Manager */}
      <div className="fixed bottom-20 right-4 z-40">
        <PWAManager compact />
      </div>
    </div>
  )
}
