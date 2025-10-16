"use client"

import React, { useState, useCallback, useEffect } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { cn } from '../../lib/utils'
import { ComponentNode, PageSchema } from '../../lib/schema'
import { 
  Languages,
  Type,
  AlignLeft,
  AlignRight,
  RotateCcw,
  Copy,
  Trash2,
  Edit,
  Save,
  Undo,
  Redo,
  Settings,
  Palette,
  Layout,
  Image,
  Video,
  Music,
  MapPin,
  Calendar,
  Users,
  Star,
  Heart,
  MessageCircle,
  Mail,
  Phone,
  Globe,
  Download,
  Upload,
  Code,
  Database,
  BarChart,
  PieChart,
  TrendingUp,
  Zap,
  Shield,
  Folder,
  Tag,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Move,
  RotateCcw as RotateIcon
} from 'lucide-react'

interface RTLSupportProps {
  components: ComponentNode[]
  selectedComponent: ComponentNode | null
  onComponentUpdate: (component: ComponentNode) => void
  onComponentsUpdate: (components: ComponentNode[]) => void
  pageSchema: PageSchema
  onPageSchemaUpdate: (schema: PageSchema) => void
}

interface LanguageConfig {
  code: string
  name: string
  nativeName: string
  direction: 'ltr' | 'rtl'
  fontFamily: string
  fontUrl?: string
}

const RTLSupport: React.FC<RTLSupportProps> = ({
  components,
  selectedComponent,
  onComponentUpdate,
  onComponentsUpdate,
  pageSchema,
  onPageSchemaUpdate
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<'ENGLISH' | 'URDU' | 'اردو'>(
    pageSchema.settings.language || 'ENGLISH'
  )
  const [currentDirection, setCurrentDirection] = useState<'ltr' | 'rtl'>(
    pageSchema.settings.direction || 'ltr'
  )
  const [isRTLMode, setIsRTLMode] = useState(currentDirection === 'rtl')
  const [fontLoaded, setFontLoaded] = useState(false)

  // Language configurations
  const languageConfigs: Record<string, LanguageConfig> = {
    ENGLISH: {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      direction: 'ltr',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    URDU: {
      code: 'ur',
      name: 'Urdu',
      nativeName: 'اردو',
      direction: 'rtl',
      fontFamily: 'Noto Nastaliq Urdu, Jameel Noori Nastaleeq, serif',
      fontUrl: 'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap'
    }
  }

  // Load Urdu fonts
  useEffect(() => {
    if (currentLanguage === 'URDU' && languageConfigs.URDU?.fontUrl) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = languageConfigs.URDU!.fontUrl
      document.head.appendChild(link)
      
      link.onload = () => setFontLoaded(true)
      
      return () => {
        document.head.removeChild(link)
      }
    } else {
      setFontLoaded(true)
    }
  }, [currentLanguage])

  // Auto-detect language from text content
  const detectLanguage = useCallback((text: string): 'ENGLISH' | 'URDU' => {
    if (!text) return 'ENGLISH'
    
    // Simple Urdu detection based on Unicode ranges
    const urduRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/
    return urduRegex.test(text) ? 'URDU' : 'ENGLISH'
  }, [])

  // Convert text to RTL-aware format
  const convertToRTL = useCallback((text: string): string => {
    if (!text) return text
    
    // Split text into words and reverse order for RTL
    const words = text.split(' ')
    return words.reverse().join(' ')
  }, [])

  // Mirror layout properties for RTL
  const mirrorLayoutForRTL = useCallback((layout: any) => {
    if (!isRTLMode) return layout
    
    return {
      ...layout,
      // Mirror horizontal positioning
      x: layout.x,
      // Adjust text alignment
      textAlign: layout.textAlign === 'left' ? 'right' : 
                 layout.textAlign === 'right' ? 'left' : layout.textAlign,
      // Mirror flex direction
      flexDirection: layout.flexDirection === 'row' ? 'row-reverse' :
                    layout.flexDirection === 'row-reverse' ? 'row' : layout.flexDirection
    }
  }, [isRTLMode])

  // Mirror styles for RTL
  const mirrorStylesForRTL = useCallback((styles: Record<string, any>) => {
    if (!isRTLMode) return styles
    
    const mirroredStyles = { ...styles }
    
    // Mirror text alignment
    if (mirroredStyles.textAlign === 'left') {
      mirroredStyles.textAlign = 'right'
    } else if (mirroredStyles.textAlign === 'right') {
      mirroredStyles.textAlign = 'left'
    }
    
    // Mirror flex properties
    if (mirroredStyles.justifyContent === 'flex-start') {
      mirroredStyles.justifyContent = 'flex-end'
    } else if (mirroredStyles.justifyContent === 'flex-end') {
      mirroredStyles.justifyContent = 'flex-start'
    }
    
    // Mirror padding and margin
    if (mirroredStyles.paddingLeft) {
      mirroredStyles.paddingRight = mirroredStyles.paddingLeft
      delete mirroredStyles.paddingLeft
    }
    if (mirroredStyles.paddingRight) {
      mirroredStyles.paddingLeft = mirroredStyles.paddingRight
      delete mirroredStyles.paddingRight
    }
    
    if (mirroredStyles.marginLeft) {
      mirroredStyles.marginRight = mirroredStyles.marginLeft
      delete mirroredStyles.marginLeft
    }
    if (mirroredStyles.marginRight) {
      mirroredStyles.marginLeft = mirroredStyles.marginRight
      delete mirroredStyles.marginRight
    }
    
    return mirroredStyles
  }, [isRTLMode])

  // Handle language change
  const handleLanguageChange = useCallback((language: 'ENGLISH' | 'URDU' | 'اردو') => {
    setCurrentLanguage(language)
    const config = languageConfigs[language]
    if (config) {
      setCurrentDirection(config.direction)
      setIsRTLMode(config.direction === 'rtl')
    }
    
    // Update page schema
    const updatedSchema = {
      ...pageSchema,
      settings: {
        ...pageSchema.settings,
        language: language,
        direction: config?.direction || 'ltr'
      }
    }
    onPageSchemaUpdate(updatedSchema)
  }, [pageSchema, onPageSchemaUpdate])

  // Handle direction toggle
  const handleDirectionToggle = useCallback((direction: 'ltr' | 'rtl') => {
    setCurrentDirection(direction)
    setIsRTLMode(direction === 'rtl')
    
    // Update page schema
    const updatedSchema = {
      ...pageSchema,
      settings: {
        ...pageSchema.settings,
        direction: direction
      }
    }
    onPageSchemaUpdate(updatedSchema)
  }, [pageSchema, onPageSchemaUpdate])

  // Apply RTL to all components
  const applyRTLToAllComponents = useCallback(() => {
    const updatedComponents = components.map(component => {
      const updatedComponent = { ...component }
      
      // Update language and direction
      updatedComponent.language = currentLanguage
      updatedComponent.direction = currentDirection
      
      // Mirror styles for RTL
      updatedComponent.styles = {
        ...updatedComponent.styles,
        default: mirrorStylesForRTL(updatedComponent.styles.default),
        tablet: updatedComponent.styles.tablet ? 
                mirrorStylesForRTL(updatedComponent.styles.tablet) : undefined,
        mobile: updatedComponent.styles.mobile ? 
                mirrorStylesForRTL(updatedComponent.styles.mobile) : undefined
      }
      
      // Mirror layout for RTL
      updatedComponent.layout = {
        ...updatedComponent.layout,
        default: mirrorLayoutForRTL(updatedComponent.layout.default),
        tablet: updatedComponent.layout.tablet ? 
                mirrorLayoutForRTL(updatedComponent.layout.tablet) : undefined,
        mobile: updatedComponent.layout.mobile ? 
                mirrorLayoutForRTL(updatedComponent.layout.mobile) : undefined
      }
      
      return updatedComponent
    })
    
    onComponentsUpdate(updatedComponents)
  }, [components, currentLanguage, currentDirection, mirrorStylesForRTL, mirrorLayoutForRTL, onComponentsUpdate])

  // Auto-detect and apply language to selected component
  const autoDetectLanguage = useCallback(() => {
    if (!selectedComponent) return
    
    const textContent = selectedComponent.props.title || 
                       selectedComponent.props.subtitle || 
                       selectedComponent.props.content || 
                       selectedComponent.props.text || ''
    
    const detectedLanguage = detectLanguage(textContent)
    
    if (detectedLanguage !== currentLanguage) {
      handleLanguageChange(detectedLanguage)
    }
  }, [selectedComponent, currentLanguage, detectLanguage, handleLanguageChange])

  // Convert component text to RTL
  const convertComponentTextToRTL = useCallback(() => {
    if (!selectedComponent) return
    
    const updatedComponent = { ...selectedComponent }
    
    // Convert text properties to RTL
    const textProps = ['title', 'subtitle', 'content', 'text', 'description', 'buttonText']
    textProps.forEach(prop => {
      if (updatedComponent.props[prop] && typeof updatedComponent.props[prop] === 'string') {
        updatedComponent.props[prop] = convertToRTL(updatedComponent.props[prop])
      }
    })
    
    // Convert array text properties
    if (updatedComponent.props.features && Array.isArray(updatedComponent.props.features)) {
      updatedComponent.props.features = updatedComponent.props.features.map((feature: any) => ({
        ...feature,
        title: feature.title ? convertToRTL(feature.title) : feature.title,
        description: feature.description ? convertToRTL(feature.description) : feature.description
      }))
    }
    
    if (updatedComponent.props.testimonials && Array.isArray(updatedComponent.props.testimonials)) {
      updatedComponent.props.testimonials = updatedComponent.props.testimonials.map((testimonial: any) => ({
        ...testimonial,
        content: testimonial.content ? convertToRTL(testimonial.content) : testimonial.content
      }))
    }
    
    onComponentUpdate(updatedComponent)
  }, [selectedComponent, convertToRTL, onComponentUpdate])

  // Get current language config
  const currentConfig = languageConfigs[currentLanguage]

  return (
    <div className="space-y-4">
      {/* Language & Direction Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Languages className="w-5 h-5 mr-2" />
            Language & RTL Support
          </h3>
          <Badge variant={isRTLMode ? "default" : "secondary"} className="text-xs">
            {isRTLMode ? 'RTL' : 'LTR'}
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Language Selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Language</Label>
            <Select value={currentLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(languageConfigs).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center space-x-2">
                      <span>{config.nativeName}</span>
                      <span className="text-gray-500">({config.name})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Direction Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                checked={isRTLMode}
                onCheckedChange={(checked) => handleDirectionToggle(checked ? 'rtl' : 'ltr')}
              />
              <Label className="text-sm">Right-to-Left (RTL)</Label>
            </div>
            <div className="flex items-center space-x-2">
              {isRTLMode ? (
                <AlignRight className="w-4 h-4 text-blue-500" />
              ) : (
                <AlignLeft className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>

          {/* Font Status */}
          <div className="flex items-center justify-between">
            <Label className="text-sm text-gray-600">Font Status</Label>
            <Badge variant={fontLoaded ? "default" : "secondary"} className="text-xs">
              {fontLoaded ? 'Loaded' : 'Loading...'}
            </Badge>
          </div>

          {/* Current Font */}
          <div className="text-sm text-gray-600">
            <Label className="block mb-1">Current Font:</Label>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              {currentConfig?.fontFamily || 'Default'}
            </code>
          </div>
        </div>
      </Card>

      {/* RTL Actions */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">RTL Actions</h3>
          <Badge variant="outline" className="text-xs">
            {components.length} components
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={applyRTLToAllComponents}
            className="flex items-center space-x-2"
          >
            <RotateIcon className="w-4 h-4" />
            <span>Apply RTL to All</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={autoDetectLanguage}
            disabled={!selectedComponent}
            className="flex items-center space-x-2"
          >
            <Type className="w-4 h-4" />
            <span>Auto-Detect</span>
          </Button>
        </div>

        {selectedComponent && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Selected Component</Label>
              <Badge variant="outline" className="text-xs">
                {selectedComponent.type}
              </Badge>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={convertComponentTextToRTL}
              className="w-full flex items-center space-x-2"
            >
              <Type className="w-4 h-4" />
              <span>Convert Text to RTL</span>
            </Button>
          </div>
        )}
      </Card>

      {/* RTL Preview */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">RTL Preview</h3>
          <Badge variant="outline" className="text-xs">
            {currentConfig?.nativeName || 'Default'}
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Sample Text */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <Label className="text-sm font-medium mb-2 block">Sample Text</Label>
            <div
              className={cn(
                "text-sm leading-relaxed",
                isRTLMode && "text-right"
              )}
              style={{
                fontFamily: currentConfig?.fontFamily || 'inherit',
                direction: currentDirection
              }}
            >
              {currentLanguage === 'URDU' ? (
                <div>
                  <p>آپ کا خوش آمدید! یہ اردو میں لکھا گیا متن ہے۔</p>
                  <p>یہ دائیں سے بائیں پڑھا جاتا ہے۔</p>
                </div>
              ) : (
                <div>
                  <p>Welcome! This is sample text in English.</p>
                  <p>This text is read from left to right.</p>
                </div>
              )}
            </div>
          </div>

          {/* Layout Preview */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <Label className="text-sm font-medium mb-2 block">Layout Preview</Label>
            <div
              className={cn(
                "flex items-center justify-between p-3 bg-gray-50 rounded",
                isRTLMode && "flex-row-reverse"
              )}
              style={{ direction: currentDirection }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Item 1</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Item 2</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Item 3</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* RTL Settings */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">RTL Settings</h3>
          <Settings className="w-5 h-5 text-gray-400" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Auto-detect language</Label>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-sm">Mirror layouts</Label>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-sm">Convert text direction</Label>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-sm">Apply to all breakpoints</Label>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default RTLSupport
