import { useState, useEffect, useCallback } from 'react'

export interface DeviceCapabilities {
  memory?: number
  cores?: number
  connection?: 'slow' | 'fast' | 'unknown'
  deviceType: 'mobile' | 'tablet' | 'desktop'
  touchEnabled: boolean
  screenSize: 'small' | 'medium' | 'large' | 'xlarge'
  prefersReducedMotion: boolean
  supportsWebGL: boolean
  supportsWebRTC: boolean
  supportsServiceWorker: boolean
  supportsIndexedDB: boolean
}

export interface ProgressiveFeatures {
  advancedAnimations: boolean
  complexComponents: boolean
  realTimeCollaboration: boolean
  advancedFilters: boolean
  heavyVisualizations: boolean
  backgroundProcessing: boolean
  offlineMode: boolean
  aiFeatures: boolean
}

export interface LoadingPriority {
  critical: string[]
  high: string[]
  medium: string[]
  low: string[]
}

export function useProgressiveEnhancement() {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    deviceType: 'desktop',
    touchEnabled: false,
    screenSize: 'large',
    prefersReducedMotion: false,
    supportsWebGL: false,
    supportsWebRTC: false,
    supportsServiceWorker: false,
    supportsIndexedDB: false
  })

  const [features, setFeatures] = useState<ProgressiveFeatures>({
    advancedAnimations: true,
    complexComponents: true,
    realTimeCollaboration: true,
    advancedFilters: true,
    heavyVisualizations: true,
    backgroundProcessing: true,
    offlineMode: true,
    aiFeatures: true
  })

  const [loadingPriority, setLoadingPriority] = useState<LoadingPriority>({
    critical: [],
    high: [],
    medium: [],
    low: []
  })

  const [isInitialized, setIsInitialized] = useState(false)

  // Detect device capabilities
  const detectCapabilities = useCallback(() => {
    const newCapabilities: DeviceCapabilities = {
      deviceType: 'desktop',
      touchEnabled: false,
      screenSize: 'large',
      prefersReducedMotion: false,
      supportsWebGL: false,
      supportsWebRTC: false,
      supportsServiceWorker: false,
      supportsIndexedDB: false
    }

    // Device type detection
    const userAgent = navigator.userAgent
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      if (/iPad|Android(?=.*\bMobile\b)/i.test(userAgent)) {
        newCapabilities.deviceType = 'tablet'
      } else {
        newCapabilities.deviceType = 'mobile'
      }
    }

    // Touch detection
    newCapabilities.touchEnabled = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    // Screen size detection
    const width = window.innerWidth
    if (width < 640) newCapabilities.screenSize = 'small'
    else if (width < 1024) newCapabilities.screenSize = 'medium'
    else if (width < 1280) newCapabilities.screenSize = 'large'
    else newCapabilities.screenSize = 'xlarge'

    // Reduced motion preference
    newCapabilities.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // WebGL support
    try {
      const canvas = document.createElement('canvas')
      newCapabilities.supportsWebGL = !!(window.WebGLRenderingContext && canvas.getContext('webgl'))
    } catch (e) {
      newCapabilities.supportsWebGL = false
    }

    // WebRTC support
    newCapabilities.supportsWebRTC = !!(window.RTCPeerConnection || window.webkitRTCPeerConnection)

    // Service Worker support
    newCapabilities.supportsServiceWorker = 'serviceWorker' in navigator

    // IndexedDB support
    newCapabilities.supportsIndexedDB = !!(window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB)

    // Connection speed (basic detection)
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection) {
        const effectiveType = connection.effectiveType
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          newCapabilities.connection = 'slow'
        } else {
          newCapabilities.connection = 'fast'
        }
      }
    }

    // Memory detection (Chrome only)
    if ('memory' in performance) {
      const memory = (performance as any).memory
      newCapabilities.memory = memory.jsHeapSizeLimit / (1024 * 1024) // MB
    }

    // CPU cores
    newCapabilities.cores = navigator.hardwareConcurrency || 4

    setCapabilities(newCapabilities)
    return newCapabilities
  }, [])

  // Determine available features based on capabilities
  const determineFeatures = useCallback((caps: DeviceCapabilities) => {
    const newFeatures: ProgressiveFeatures = {
      advancedAnimations: true,
      complexComponents: true,
      realTimeCollaboration: true,
      advancedFilters: true,
      heavyVisualizations: true,
      backgroundProcessing: true,
      offlineMode: true,
      aiFeatures: true
    }

    // Reduce features based on device capabilities
    if (caps.prefersReducedMotion) {
      newFeatures.advancedAnimations = false
    }

    if (caps.deviceType === 'mobile') {
      newFeatures.heavyVisualizations = false
      newFeatures.realTimeCollaboration = false
      newFeatures.complexComponents = false
    }

    if (caps.screenSize === 'small') {
      newFeatures.advancedFilters = false
    }

    if (caps.connection === 'slow') {
      newFeatures.aiFeatures = false
      newFeatures.backgroundProcessing = false
      newFeatures.realTimeCollaboration = false
    }

    if (!caps.supportsWebGL) {
      newFeatures.heavyVisualizations = false
    }

    if (!caps.supportsWebRTC) {
      newFeatures.realTimeCollaboration = false
    }

    if (!caps.supportsServiceWorker) {
      newFeatures.offlineMode = false
    }

    // Memory-based limitations
    if (caps.memory && caps.memory < 100) { // Less than 100MB
      newFeatures.complexComponents = false
      newFeatures.aiFeatures = false
    }

    setFeatures(newFeatures)
    return newFeatures
  }, [])

  // Set loading priorities based on features and capabilities
  const setLoadPriorities = useCallback((caps: DeviceCapabilities, feats: ProgressiveFeatures) => {
    const priorities: LoadingPriority = {
      critical: ['core-components', 'basic-navigation', 'essential-forms'],
      high: ['component-library', 'basic-editor', 'save-system'],
      medium: [],
      low: []
    }

    // Add features based on device capabilities
    if (feats.realTimeCollaboration) {
      priorities.medium.push('collaboration-tools')
    } else {
      priorities.low.push('collaboration-tools')
    }

    if (feats.aiFeatures) {
      priorities.low.push('ai-assistant', 'smart-suggestions')
    } else {
      priorities.low.push('ai-assistant', 'smart-suggestions')
    }

    if (feats.heavyVisualizations) {
      priorities.low.push('data-visualization')
    } else {
      priorities.low.push('data-visualization')
    }

    // Mobile-specific priorities
    if (caps.deviceType === 'mobile') {
      priorities.critical.push('mobile-layout')
    }

    // Slow connection adjustments
    if (caps.connection === 'slow') {
      // Move heavy features to low priority
      priorities.low = [...priorities.low, ...priorities.medium.splice(0)]
      priorities.medium = []
    }

    setLoadingPriority(priorities)
    return priorities
  }, [])

  // Lazy load components based on priority
  const lazyLoadComponent = useCallback(async (componentName: string, priority: keyof LoadingPriority) => {
    const componentMap: Record<string, () => Promise<any>> = {
      'collaboration-tools': () => import('../components/collaboration/collaboration-panel'),
      'ai-assistant': () => import('../components/ai/ai-chat-interface')
    }

    if (componentMap[componentName]) {
      try {
        const module = await componentMap[componentName]()
        return module.default || module
      } catch (error) {
        console.warn(`Failed to load ${componentName}:`, error)
        return null
      }
    }

    return null
  }, [])

  // Initialize progressive enhancement
  useEffect(() => {
    const initProgressiveEnhancement = async () => {
      const caps = detectCapabilities()
      const feats = determineFeatures(caps)
      const priorities = setLoadPriorities(caps, feats)

      // Load critical components first
      for (const component of priorities.critical) {
        await lazyLoadComponent(component, 'critical')
      }

      // Then load high priority components
      for (const component of priorities.high) {
        await lazyLoadComponent(component, 'high')
      }

      setIsInitialized(true)
    }

    initProgressiveEnhancement()
  }, [detectCapabilities, determineFeatures, setLoadPriorities, lazyLoadComponent])

  // Load medium priority components after initialization
  useEffect(() => {
    if (!isInitialized) return

    const loadMediumPriority = async () => {
      for (const component of loadingPriority.medium) {
        await lazyLoadComponent(component, 'medium')
      }
    }

    loadMediumPriority()
  }, [isInitialized, loadingPriority.medium, lazyLoadComponent])

  // Update capabilities on resize
  useEffect(() => {
    const handleResize = () => {
      detectCapabilities()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [detectCapabilities])

  // Update reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => {
      setCapabilities(prev => ({ ...prev, prefersReducedMotion: mediaQuery.matches }))
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return {
    capabilities,
    features,
    loadingPriority,
    isInitialized,
    lazyLoadComponent
  }
}
