import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Menu, X, Search, User, ShoppingCart } from 'lucide-react'

interface NavbarElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function NavbarElement({ element, onUpdate, viewMode, style, children }: NavbarElementProps) {
  const handleLogoChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newLogo = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        logo: newLogo
      }
    })
  }

  const handleMenuChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newMenu = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        menuItems: newMenu.split(',').map(item => item.trim())
      }
    })
  }

  const getVariantClass = () => {
    switch (element.props.variant) {
      case 'transparent':
        return 'bg-transparent'
      case 'solid':
        return 'bg-background border-b border-border'
      case 'glass':
        return 'bg-background/80 backdrop-blur-md border-b border-border'
      default:
        return 'bg-background border-b border-border'
    }
  }

  const getPositionClass = () => {
    switch (element.props.position) {
      case 'fixed':
        return 'fixed top-0 left-0 right-0 z-50'
      case 'sticky':
        return 'sticky top-0 z-40'
      case 'static':
      default:
        return 'relative'
    }
  }

  const getPaddingClass = () => {
    const padding = element.props.padding || 'medium'
    switch (padding) {
      case 'small':
        return 'px-4 py-2'
      case 'medium':
        return 'px-6 py-4'
      case 'large':
        return 'px-8 py-6'
      default:
        return 'px-6 py-4'
    }
  }

  const menuItems = element.props.menuItems || ['Home', 'About', 'Services', 'Contact']

  return (
    <nav
      className={cn(
        'w-full flex items-center justify-between',
        getVariantClass(),
        getPositionClass(),
        getPaddingClass()
      )}
      style={style}
    >
      {/* Logo */}
      <div className="flex items-center">
        <div
          className="text-xl font-bold text-foreground"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleLogoChange}
        >
          {element.props.logo || 'Logo'}
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-8">
        {menuItems.map((item: string, index: number) => (
          <a
            key={index}
            href="#"
            className="text-foreground hover:text-primary transition-colors"
          >
            {item}
          </a>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {element.props.showSearch && (
          <button className="p-2 text-foreground hover:text-primary transition-colors">
            <Search className="h-5 w-5" />
          </button>
        )}
        
        {element.props.showUser && (
          <button className="p-2 text-foreground hover:text-primary transition-colors">
            <User className="h-5 w-5" />
          </button>
        )}
        
        {element.props.showCart && (
          <button className="p-2 text-foreground hover:text-primary transition-colors">
            <ShoppingCart className="h-5 w-5" />
          </button>
        )}

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 text-foreground hover:text-primary transition-colors">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg">
        <div className="px-6 py-4 space-y-2">
          {menuItems.map((item: string, index: number) => (
            <a
              key={index}
              href="#"
              className="block py-2 text-foreground hover:text-primary transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      {!children && (
        <div className="absolute inset-0 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground pointer-events-none">
          <div className="text-center">
            <p>Navbar Component</p>
            <p className="text-xs mt-1">
              Variant: {element.props.variant || 'solid'} | 
              Position: {element.props.position || 'static'}
            </p>
          </div>
        </div>
      )}
    </nav>
  )
}
