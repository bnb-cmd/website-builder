import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Menu, X, Home, Settings, User, LogOut } from 'lucide-react'

interface SidebarElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function SidebarElement({ element, onUpdate, viewMode, style, children }: SidebarElementProps) {
  const handleTitleChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newTitle = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        title: newTitle
      }
    })
  }

  const getVariantClass = () => {
    switch (element.props.variant) {
      case 'dark':
        return 'bg-gray-900 text-white'
      case 'light':
        return 'bg-white text-gray-900 border-r border-border'
      case 'primary':
        return 'bg-primary text-primary-foreground'
      default:
        return 'bg-white text-gray-900 border-r border-border'
    }
  }

  const getPositionClass = () => {
    switch (element.props.position) {
      case 'fixed':
        return 'fixed left-0 top-0 h-full z-50'
      case 'sticky':
        return 'sticky top-0 h-screen'
      case 'static':
      default:
        return 'relative h-full'
    }
  }

  const getWidthClass = () => {
    switch (element.props.width) {
      case 'narrow':
        return 'w-48'
      case 'wide':
        return 'w-80'
      case 'full':
        return 'w-full'
      case 'medium':
      default:
        return 'w-64'
    }
  }

  const menuItems = element.props.menuItems || [
    { label: 'Dashboard', icon: Home, active: true },
    { label: 'Profile', icon: User },
    { label: 'Settings', icon: Settings },
    { label: 'Logout', icon: LogOut }
  ]

  return (
    <aside
      className={cn(
        'flex flex-col',
        getVariantClass(),
        getPositionClass(),
        getWidthClass()
      )}
      style={style}
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div
          className="text-xl font-bold"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTitleChange}
        >
          {element.props.title || 'Sidebar'}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item: any, index: number) => (
            <li key={index}>
              <a
                href="#"
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-md transition-colors',
                  item.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {element.props.showFooter && (
        <div className="p-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Version 1.0.0
          </div>
        </div>
      )}

      {!children && (
        <div className="absolute inset-0 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground pointer-events-none">
          <div className="text-center">
            <p>Sidebar Component</p>
            <p className="text-xs mt-1">
              Variant: {element.props.variant || 'light'} | 
              Width: {element.props.width || 'medium'}
            </p>
          </div>
        </div>
      )}
    </aside>
  )
}
