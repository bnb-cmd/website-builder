import { useState, useEffect, useCallback, useRef } from 'react'

export interface AccessibilitySettings {
  screenReader: boolean
  keyboardNavigation: boolean
  highContrast: boolean
  reducedMotion: boolean
  largeText: boolean
  focusVisible: boolean
  skipLinks: boolean
  announcements: boolean
}

export interface FocusManagement {
  trapFocus: (container: HTMLElement) => () => void
  restoreFocus: () => void
  moveFocus: (element: HTMLElement) => void
  getFocusableElements: (container: HTMLElement) => HTMLElement[]
}

export interface AriaAnnouncements {
  announce: (message: string, priority?: 'polite' | 'assertive') => void
  clear: () => void
}

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    screenReader: false,
    keyboardNavigation: true,
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    focusVisible: true,
    skipLinks: true,
    announcements: true
  })

  const [isInitialized, setIsInitialized] = useState(false)
  const announcementsRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Initialize accessibility settings
  useEffect(() => {
    const initAccessibility = () => {
      // Detect screen reader
      const screenReader = window.navigator.userAgent.includes('NVDA') ||
                          window.navigator.userAgent.includes('JAWS') ||
                          window.navigator.userAgent.includes('VoiceOver') ||
                          window.speechSynthesis !== undefined

      // Detect reduced motion preference
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Detect high contrast mode
      const highContrast = window.matchMedia('(prefers-contrast: high)').matches

      // Detect large text preference
      const largeText = window.matchMedia('(prefers-reduced-motion: reduce)').matches // This is a simplification

      setSettings(prev => ({
        ...prev,
        screenReader,
        reducedMotion,
        highContrast,
        largeText
      }))

      setIsInitialized(true)
    }

    initAccessibility()

    // Listen for preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')

    const handleChange = () => {
      setSettings(prev => ({
        ...prev,
        reducedMotion: motionQuery.matches,
        highContrast: contrastQuery.matches
      }))
    }

    motionQuery.addEventListener('change', handleChange)
    contrastQuery.addEventListener('change', handleChange)

    return () => {
      motionQuery.removeEventListener('change', handleChange)
      contrastQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Focus management
  const focusManagement: FocusManagement = {
    trapFocus: useCallback((container: HTMLElement) => {
      const focusableElements = focusManagement.getFocusableElements(container)
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault()
              lastElement?.focus()
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault()
              firstElement?.focus()
            }
          }
        }

        if (e.key === 'Escape') {
          focusManagement.restoreFocus()
        }
      }

      container.addEventListener('keydown', handleKeyDown)
      previousFocusRef.current = document.activeElement as HTMLElement
      firstElement?.focus()

      return () => {
        container.removeEventListener('keydown', handleKeyDown)
        focusManagement.restoreFocus()
      }
    }, []),

    restoreFocus: useCallback(() => {
      if (previousFocusRef.current && document.contains(previousFocusRef.current)) {
        previousFocusRef.current.focus()
      }
      previousFocusRef.current = null
    }, []),

    moveFocus: useCallback((element: HTMLElement) => {
      element.focus()
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, []),

    getFocusableElements: useCallback((container: HTMLElement) => {
      const focusableSelectors = [
        'a[href]',
        'area[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'button:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]'
      ]

      return Array.from(
        container.querySelectorAll(focusableSelectors.join(', '))
      ) as HTMLElement[]
    }, [])
  }

  // ARIA announcements
  const announcements: AriaAnnouncements = {
    announce: useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (!settings.announcements || !announcementsRef.current) return

      const announcement = document.createElement('div')
      announcement.setAttribute('aria-live', priority)
      announcement.setAttribute('aria-atomic', 'true')
      announcement.style.position = 'absolute'
      announcement.style.left = '-10000px'
      announcement.style.width = '1px'
      announcement.style.height = '1px'
      announcement.style.overflow = 'hidden'

      announcement.textContent = message
      announcementsRef.current.appendChild(announcement)

      // Remove after announcement
      setTimeout(() => {
        if (announcementsRef.current?.contains(announcement)) {
          announcementsRef.current.removeChild(announcement)
        }
      }, 1000)
    }, [settings.announcements]),

    clear: useCallback(() => {
      if (announcementsRef.current) {
        announcementsRef.current.innerHTML = ''
      }
    }, [])
  }

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  // Generate ARIA attributes helper
  const getAriaAttributes = useCallback((options: {
    label?: string
    labelledBy?: string
    describedBy?: string
    expanded?: boolean
    selected?: boolean
    checked?: boolean
    pressed?: boolean
    level?: number
    value?: string | number
    max?: number
    min?: number
    required?: boolean
    invalid?: boolean
    disabled?: boolean
    readonly?: boolean
    busy?: boolean
  }) => {
    const attrs: Record<string, any> = {}

    if (options.label) attrs['aria-label'] = options.label
    if (options.labelledBy) attrs['aria-labelledby'] = options.labelledBy
    if (options.describedBy) attrs['aria-describedby'] = options.describedBy
    if (options.expanded !== undefined) attrs['aria-expanded'] = options.expanded
    if (options.selected !== undefined) attrs['aria-selected'] = options.selected
    if (options.checked !== undefined) attrs['aria-checked'] = options.checked
    if (options.pressed !== undefined) attrs['aria-pressed'] = options.pressed
    if (options.level) attrs['aria-level'] = options.level
    if (options.value !== undefined) attrs['aria-valuenow'] = options.value
    if (options.max !== undefined) attrs['aria-valuemax'] = options.max
    if (options.min !== undefined) attrs['aria-valuemin'] = options.min
    if (options.required) attrs['aria-required'] = true
    if (options.invalid) attrs['aria-invalid'] = true
    if (options.disabled) attrs['aria-disabled'] = true
    if (options.readonly) attrs['aria-readonly'] = true
    if (options.busy) attrs['aria-busy'] = true

    return attrs
  }, [])

  // Skip link functionality
  const createSkipLink = useCallback((targetId: string, label: string = 'Skip to main content') => {
    if (!settings.skipLinks) return null

    return (
      <a
        href={`#${targetId}`}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50"
        onClick={(e) => {
          e.preventDefault()
          const target = document.getElementById(targetId)
          if (target) {
            focusManagement.moveFocus(target)
          }
        }}
      >
        {label}
      </a>
    )
  }, [settings.skipLinks, focusManagement])

  // Keyboard navigation helpers
  const handleKeyboardNavigation = useCallback((
    event: KeyboardEvent,
    options: {
      onEnter?: () => void
      onSpace?: () => void
      onEscape?: () => void
      onArrowUp?: () => void
      onArrowDown?: () => void
      onArrowLeft?: () => void
      onArrowRight?: () => void
      preventDefault?: boolean
    } = {}
  ) => {
    const {
      onEnter,
      onSpace,
      onEscape,
      onArrowUp,
      onArrowDown,
      onArrowLeft,
      onArrowRight,
      preventDefault = true
    } = options

    switch (event.key) {
      case 'Enter':
        if (onEnter) {
          if (preventDefault) event.preventDefault()
          onEnter()
        }
        break
      case ' ':
        if (onSpace) {
          if (preventDefault) event.preventDefault()
          onSpace()
        }
        break
      case 'Escape':
        if (onEscape) {
          if (preventDefault) event.preventDefault()
          onEscape()
        }
        break
      case 'ArrowUp':
        if (onArrowUp) {
          if (preventDefault) event.preventDefault()
          onArrowUp()
        }
        break
      case 'ArrowDown':
        if (onArrowDown) {
          if (preventDefault) event.preventDefault()
          onArrowDown()
        }
        break
      case 'ArrowLeft':
        if (onArrowLeft) {
          if (preventDefault) event.preventDefault()
          onArrowLeft()
        }
        break
      case 'ArrowRight':
        if (onArrowRight) {
          if (preventDefault) event.preventDefault()
          onArrowRight()
        }
        break
    }
  }, [])

  return {
    settings,
    isInitialized,
    focusManagement,
    announcements,
    updateSettings,
    getAriaAttributes,
    createSkipLink,
    handleKeyboardNavigation,
    announcementsRef
  }
}
