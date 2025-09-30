'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

// Mobile-First Responsive Utilities
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setScreenSize('mobile')
        setIsMobile(true)
        setIsTablet(false)
        setIsDesktop(false)
      } else if (width < 1024) {
        setScreenSize('tablet')
        setIsMobile(false)
        setIsTablet(true)
        setIsDesktop(false)
      } else {
        setScreenSize('desktop')
        setIsMobile(false)
        setIsTablet(false)
        setIsDesktop(true)
      }
    }

    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  return { screenSize, isMobile, isTablet, isDesktop }
}

// Mobile-Optimized Dashboard Layout
interface MobileDashboardProps {
  children: React.ReactNode
  user: any
  onCreateWebsite: () => void
}

export function MobileDashboard({ children, user, onCreateWebsite }: MobileDashboardProps) {
  const { isMobile, isTablet } = useResponsive()
  const [activeTab, setActiveTab] = useState('dashboard')

  if (!isMobile && !isTablet) {
    return <>{children}</>
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'websites', label: 'Websites', icon: '🌐' },
    { id: 'templates', label: 'Templates', icon: '🎨' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Pakistan Builder</h1>
              <p className="text-xs text-gray-500">Welcome back, {user?.name}</p>
            </div>
          </div>
          <button
            onClick={onCreateWebsite}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            + New
          </button>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="pb-20">
        {children}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-2 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0 flex-1",
                activeTab === tab.id
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <span className="text-lg mb-1">{tab.icon}</span>
              <span className="text-xs font-medium truncate">{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* Safe area for devices with home indicator */}
        <div className="h-safe-area-inset-bottom bg-white" />
      </div>
    </div>
  )
}

// Mobile-Optimized Editor Layout
interface MobileEditorProps {
  children: React.ReactNode
  onSave: () => void
  onPreview: () => void
  selectedElement?: any
}

export function MobileEditor({ children, onSave, onPreview, selectedElement }: MobileEditorProps) {
  const { isMobile } = useResponsive()
  const [activePanel, setActivePanel] = useState<'canvas' | 'properties' | 'components'>('canvas')
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  if (!isMobile) {
    return <>{children}</>
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Mobile Editor Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <span className="text-lg">☰</span>
            </button>
            <div className="text-sm font-medium text-gray-900">
              {selectedElement ? `Editing ${selectedElement.type}` : 'Website Editor'}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onPreview}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              👁️
            </button>
            <button
              onClick={onSave}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium"
            >
              Save
            </button>
          </div>
        </div>

        {/* Mobile Panel Tabs */}
        <div className="flex border-t border-gray-200">
          {[
            { id: 'canvas', label: 'Canvas', icon: '🎨' },
            { id: 'properties', label: 'Properties', icon: '⚙️' },
            { id: 'components', label: 'Components', icon: '🧩' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePanel(tab.id as any)}
              className={cn(
                "flex-1 flex items-center justify-center py-3 text-sm font-medium transition-colors",
                activePanel === tab.id
                  ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Content Area */}
      <div className="flex-1 overflow-hidden">
        {activePanel === 'canvas' && (
          <div className="h-full overflow-auto p-4">
            {children}
          </div>
        )}
        
        {activePanel === 'properties' && (
          <div className="h-full overflow-auto p-4 bg-white">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Element Properties</h3>
              {selectedElement ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Element Type
                    </label>
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {selectedElement.type}
                    </div>
                  </div>
                  {/* Add more property controls here */}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Select an element to edit its properties
                </div>
              )}
            </div>
          </div>
        )}
        
        {activePanel === 'components' && (
          <div className="h-full overflow-auto p-4 bg-white">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Components</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Text', icon: '📝' },
                  { name: 'Image', icon: '🖼️' },
                  { name: 'Button', icon: '🔘' },
                  { name: 'Form', icon: '📋' },
                  { name: 'Header', icon: '📄' },
                  { name: 'Footer', icon: '🦶' }
                ].map((component) => (
                  <button
                    key={component.name}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-2xl mb-2">{component.icon}</div>
                    <div className="text-sm font-medium text-gray-900">{component.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-2">
                {[
                  { label: 'Undo', icon: '↶' },
                  { label: 'Redo', icon: '↷' },
                  { label: 'Save', icon: '💾' },
                  { label: 'Preview', icon: '👁️' },
                  { label: 'Settings', icon: '⚙️' },
                  { label: 'Help', icon: '❓' }
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-left"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-gray-900">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Touch-Friendly Component Library
interface TouchFriendlyButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

export function TouchFriendlyButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  className 
}: TouchFriendlyButtonProps) {
  const { isMobile } = useResponsive()
  
  const baseClasses = "font-medium rounded-lg transition-all duration-200 active:scale-95"
  const sizeClasses = {
    sm: isMobile ? "px-4 py-3 text-sm" : "px-3 py-2 text-sm",
    md: isMobile ? "px-6 py-4 text-base" : "px-4 py-2 text-sm",
    lg: isMobile ? "px-8 py-5 text-lg" : "px-6 py-3 text-base"
  }
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        disabled && "opacity-50 cursor-not-allowed",
        isMobile && "min-h-[44px]", // iOS touch target minimum
        className
      )}
    >
      {children}
    </button>
  )
}

// Mobile-Optimized Form Components
interface MobileFormFieldProps {
  label: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'url'
  placeholder?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  error?: string
}

export function MobileFormField({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false,
  error 
}: MobileFormFieldProps) {
  const { isMobile } = useResponsive()

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={cn(
          "w-full border border-gray-300 rounded-lg px-4 py-3 text-base transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          error && "border-red-500 focus:ring-red-500",
          isMobile && "text-base" // Prevent zoom on iOS
        )}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

// Responsive Grid System
interface ResponsiveGridProps {
  children: React.ReactNode
  cols?: { mobile: number; tablet: number; desktop: number }
  gap?: string
  className?: string
}

export function ResponsiveGrid({ 
  children, 
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = "gap-4",
  className 
}: ResponsiveGridProps) {
  return (
    <div className={cn(
      "grid",
      `grid-cols-${cols.mobile}`,
      `md:grid-cols-${cols.tablet}`,
      `lg:grid-cols-${cols.desktop}`,
      gap,
      className
    )}>
      {children}
    </div>
  )
}

// Mobile-Optimized Card Component
interface MobileCardProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  interactive?: boolean
}

export function MobileCard({ 
  children, 
  onClick, 
  className, 
  interactive = false 
}: MobileCardProps) {
  const { isMobile } = useResponsive()

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-4 transition-all duration-200",
        interactive && "hover:shadow-md active:scale-95",
        isMobile && interactive && "active:bg-gray-50",
        className
      )}
    >
      {children}
    </div>
  )
}

// Swipe Gesture Handler
interface SwipeHandlerProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  children: React.ReactNode
  className?: string
}

export function SwipeHandler({ 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeUp, 
  onSwipeDown, 
  children, 
  className 
}: SwipeHandlerProps) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isLeftSwipe = distanceX > minSwipeDistance
    const isRightSwipe = distanceX < -minSwipeDistance
    const isUpSwipe = distanceY > minSwipeDistance
    const isDownSwipe = distanceY < -minSwipeDistance

    if (isLeftSwipe && onSwipeLeft) onSwipeLeft()
    if (isRightSwipe && onSwipeRight) onSwipeRight()
    if (isUpSwipe && onSwipeUp) onSwipeUp()
    if (isDownSwipe && onSwipeDown) onSwipeDown()
  }

  return (
    <div
      className={className}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  )
}

// Mobile-Optimized Modal
interface MobileModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'full'
}

export function MobileModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md' 
}: MobileModalProps) {
  const { isMobile } = useResponsive()

  if (!isOpen) return null

  const sizeClasses = {
    sm: isMobile ? "max-w-sm" : "max-w-md",
    md: isMobile ? "max-w-lg" : "max-w-2xl",
    lg: isMobile ? "max-w-2xl" : "max-w-4xl",
    full: "max-w-full h-full"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={cn(
        "bg-white rounded-lg shadow-xl w-full",
        sizeClasses[size],
        isMobile && size === 'full' && "h-full rounded-none"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            ✕
          </button>
        </div>
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}