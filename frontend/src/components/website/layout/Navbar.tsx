import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const NavbarConfig: ComponentConfig = {
  id: 'navbar',
  name: 'Navbar',
  category: 'layout',
  icon: 'Layout',
  description: 'Create navigation bars with logo and menu items',
  defaultProps: { 
    logo: 'Brand Name',
    menuItems: [
      { label: 'Home', link: '/' },
      { label: 'About', link: '/about' },
      { label: 'Contact', link: '/contact' }
    ],
    style: 'minimalist',
    isSticky: false,
    showMobileMenu: true,
    showCartIcon: false,
    showSearchIcon: false
  },
  defaultSize: { width: 1200, height: 80 },
  editableFields: ['logo', 'menuItems', 'style', 'isSticky', 'showMobileMenu', 'showCartIcon', 'showSearchIcon']
}

interface MenuItem {
  label: string
  link: string
}

interface NavbarProps extends WebsiteComponentProps {
  logo: string
  menuItems: MenuItem[]
  style: 'minimalist' | 'modern' | 'classic'
  isSticky: boolean
  showMobileMenu: boolean
  showCartIcon: boolean
  showSearchIcon: boolean
}

export const WebsiteNavbar: React.FC<NavbarProps> = ({ 
  logo, 
  menuItems, 
  style,
  isSticky,
  showMobileMenu,
  showCartIcon,
  showSearchIcon,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const getStyleClass = () => {
    switch (style) {
      case 'modern': return 'bg-white shadow-lg'
      case 'classic': return 'bg-gray-800 text-white'
      default: return 'bg-white border-b border-gray-200'
    }
  }

  const getLogoClass = () => {
    switch (style) {
      case 'classic': return 'text-white'
      default: return 'text-gray-900'
    }
  }

  const getMenuClass = () => {
    switch (style) {
      case 'classic': return 'text-gray-300 hover:text-white'
      default: return 'text-gray-700 hover:text-gray-900'
    }
  }

  const padding = getResponsivePadding('px-6', deviceMode)
  const logoSize = getResponsiveTextSize('text-xl', deviceMode)
  const menuSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <nav className={cn(
      "w-full z-50",
      getStyleClass(),
      isSticky && "sticky top-0"
    )}>
      <div className={cn("max-w-7xl mx-auto flex items-center justify-between h-16", padding)}>
        {/* Logo */}
        <div className="flex-shrink-0">
          <h1 
            className={cn("font-bold", logoSize, getLogoClass())}
            onDoubleClick={onTextDoubleClick}
          >
            {logo}
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:block">
          <div className="ml-10 flex items-baseline space-x-4">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className={cn(
                  "px-3 py-2 rounded-md font-medium transition-colors",
                  menuSize,
                  getMenuClass()
                )}
                onDoubleClick={onTextDoubleClick}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right side icons */}
        <div className="hidden md:flex items-center space-x-4">
          {showSearchIcon && (
            <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
          {showCartIcon && (
            <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        {showMobileMenu && (
          <div className="md:hidden">
            <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
