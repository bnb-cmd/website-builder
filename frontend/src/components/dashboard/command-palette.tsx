'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Home,
  Globe,
  Palette,
  BarChart3,
  Zap,
  Brain,
  Coins,
  Bell,
  Smartphone,
  Settings,
  Plus,
  Search,
  FileText,
  Image,
  Code,
  Users,
  CreditCard
} from 'lucide-react'
import { apiHelpers } from '@/lib/api'

interface CommandItem {
  id: string
  title: string
  description?: string
  icon: any
  action: () => void
  keywords?: string[]
  category: string
}

interface CommandPaletteProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CommandPalette({ open: controlledOpen, onOpenChange }: CommandPaletteProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [recentItems, setRecentItems] = useState<CommandItem[]>([])
  const router = useRouter()

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = (value: boolean) => {
    if (isControlled && onOpenChange) {
      onOpenChange(value)
    } else {
      setInternalOpen(value)
    }
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, setOpen])

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'dashboard',
      title: 'Go to Dashboard',
      description: 'View your main dashboard',
      icon: Home,
      action: () => router.push('/dashboard'),
      keywords: ['home', 'main', 'overview'],
      category: 'Navigation'
    },
    {
      id: 'websites',
      title: 'Manage Websites',
      description: 'View and edit your websites',
      icon: Globe,
      action: () => router.push('/dashboard/websites'),
      keywords: ['sites', 'pages', 'web'],
      category: 'Navigation'
    },
    {
      id: 'templates',
      title: 'Browse Templates',
      description: 'Explore website templates',
      icon: Palette,
      action: () => router.push('/dashboard/templates'),
      keywords: ['themes', 'designs', 'layouts'],
      category: 'Navigation'
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'Check website performance',
      icon: BarChart3,
      action: () => router.push('/dashboard/analytics'),
      keywords: ['stats', 'metrics', 'data'],
      category: 'Navigation'
    },

    // Actions
    {
      id: 'new-website',
      title: 'Create New Website',
      description: 'Start building a new website',
      icon: Plus,
      action: () => router.push('/dashboard/websites/new'),
      keywords: ['create', 'build', 'new'],
      category: 'Actions'
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      description: 'Get help from AI',
      icon: Zap,
      action: () => router.push('/dashboard/advanced-ai'),
      keywords: ['help', 'assistant', 'ai'],
      category: 'Actions'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Manage your account settings',
      icon: Settings,
      action: () => router.push('/dashboard/settings'),
      keywords: ['preferences', 'account', 'config'],
      category: 'Actions'
    },

    // Features
    {
      id: 'advanced-ai',
      title: 'Advanced AI',
      description: 'Use advanced AI features',
      icon: Brain,
      action: () => router.push('/dashboard/advanced-ai'),
      keywords: ['ai', 'advanced', 'smart'],
      category: 'Features'
    },
    {
      id: 'blockchain',
      title: 'Blockchain',
      description: 'Manage blockchain features',
      icon: Coins,
      action: () => router.push('/dashboard/blockchain'),
      keywords: ['crypto', 'blockchain', 'web3'],
      category: 'Features'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage notifications',
      icon: Bell,
      action: () => router.push('/dashboard/notifications'),
      keywords: ['alerts', 'messages', 'updates'],
      category: 'Features'
    },
    {
      id: 'pwa-settings',
      title: 'PWA Settings',
      description: 'Configure progressive web app',
      icon: Smartphone,
      action: () => router.push('/dashboard/pwa'),
      keywords: ['pwa', 'mobile', 'app'],
      category: 'Features'
    },
    {
      id: 'domains',
      title: 'Domain Management',
      description: 'Manage custom domains',
      icon: Globe,
      action: () => router.push('/dashboard/domains'),
      keywords: ['domain', 'url', 'custom'],
      category: 'Features'
    },
    {
      id: 'billing',
      title: 'Billing',
      description: 'Manage subscriptions and billing',
      icon: CreditCard,
      action: () => router.push('/dashboard/billing'),
      keywords: ['payment', 'subscription', 'plan'],
      category: 'Features'
    }
  ]

  // Filter commands based on search
  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    command.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    command.keywords?.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = []
    }
    acc[command.category].push(command)
    return acc
  }, {} as Record<string, CommandItem[]>)

  const handleSelect = (command: CommandItem) => {
    command.action()
    setOpen(false)
    // Add to recent items
    setRecentItems(prev => {
      const filtered = prev.filter(item => item.id !== command.id)
      return [command, ...filtered].slice(0, 5)
    })
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type a command or search..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Recent Items */}
        {recentItems.length > 0 && !searchQuery && (
          <>
            <CommandGroup heading="Recent">
              {recentItems.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center space-x-3"
                >
                  <item.icon className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{item.title}</div>
                    {item.description && (
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Grouped Commands */}
        {Object.entries(groupedCommands).map(([category, items]) => (
          <CommandGroup key={category} heading={category}>
            {items.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => handleSelect(item)}
                className="flex items-center space-x-3"
              >
                <item.icon className="h-4 w-4" />
                <div>
                  <div className="font-medium">{item.title}</div>
                  {item.description && (
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>

      {/* Footer */}
      <div className="border-t border-border p-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">↑↓</kbd> to navigate</span>
            <span>Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">↵</kbd> to select</span>
          </div>
          <span>Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">esc</kbd> to close</span>
        </div>
      </div>
    </CommandDialog>
  )
}
