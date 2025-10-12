"use client"

import React, { useState, useCallback } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { cn } from '../../lib/utils'
import { ComponentNode, PageSchema, ResponsiveLayout, ResponsiveStyles } from '../../lib/schema'
import { 
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Move,
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
  Type,
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
  Tag
} from 'lucide-react'

interface ResponsiveDesignProps {
  components: ComponentNode[]
  selectedComponent: ComponentNode | null
  onComponentUpdate: (component: ComponentNode) => void
  onComponentsUpdate: (components: ComponentNode[]) => void
  pageSchema: PageSchema
  deviceMode: 'desktop' | 'tablet' | 'mobile'
  onDeviceModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

const ResponsiveDesign: React.FC<ResponsiveDesignProps> = ({
  components,
  selectedComponent,
  onComponentUpdate,
  onComponentsUpdate,
  pageSchema,
  deviceMode,
  onDeviceModeChange
}) => {
  const [isEditingBreakpoint, setIsEditingBreakpoint] = useState(false)
  const [breakpointValues, setBreakpointValues] = useState({
    tablet: 768,
    mobile: 480
  })

  // Device configurations
  const deviceConfigs = {
    desktop: {
      name: 'Desktop',
      icon: <Monitor className="w-4 h-4" />,
      width: 1200,
      height: 800,
      breakpoint: 'default'
    },
    tablet: {
      name: 'Tablet',
      icon: <Tablet className="w-4 h-4" />,
      width: breakpointValues.tablet,
      height: 1024,
      breakpoint: 'tablet'
    },
    mobile: {
      name: 'Mobile',
      icon: <Smartphone className="w-4 h-4" />,
      width: breakpointValues.mobile,
      height: 667,
      breakpoint: 'mobile'
    }
  }

  // Get component styles for current device mode
  const getComponentStyles = (component: ComponentNode): Record<string, any> => {
    const styles = component.styles[deviceMode] || component.styles.default
    return styles || {}
  }

  // Get component layout for current device mode
  const getComponentLayout = (component: ComponentNode): ResponsiveLayout => {
    const layout = component.layout[deviceMode] || component.layout.default
    return layout || { x: 0, y: 0, width: 100, height: 100, zIndex: 1 }
  }

  // Update component styles for current device mode
  const updateComponentStyles = useCallback((component: ComponentNode, newStyles: Record<string, any>) => {
    const updatedComponent = {
      ...component,
      styles: {
        ...component.styles,
        [deviceMode]: {
          ...component.styles[deviceMode],
          ...newStyles
        }
      }
    }
    onComponentUpdate(updatedComponent)
  }, [deviceMode, onComponentUpdate])

  // Update component layout for current device mode
  const updateComponentLayout = useCallback((component: ComponentNode, newLayout: Partial<ResponsiveLayout>) => {
    const updatedComponent = {
      ...component,
      layout: {
        ...component.layout,
        [deviceMode]: {
          ...component.layout[deviceMode],
          ...newLayout
        }
      }
    }
    onComponentUpdate(updatedComponent)
  }, [deviceMode, onComponentUpdate])

  // Copy styles from one breakpoint to another
  const copyStylesToBreakpoint = useCallback((fromBreakpoint: DeviceMode, toBreakpoint: DeviceMode) => {
    const updatedComponents = components.map(component => {
      const fromStyles = component.styles[fromBreakpoint] || component.styles.default
      const fromLayout = component.layout[fromBreakpoint] || component.layout.default

      return {
        ...component,
        styles: {
          ...component.styles,
          [toBreakpoint]: fromStyles
        },
        layout: {
          ...component.layout,
          [toBreakpoint]: fromLayout
        }
      }
    })

    onComponentsUpdate(updatedComponents)
  }, [components, onComponentsUpdate])

  // Reset breakpoint styles
  const resetBreakpointStyles = useCallback((breakpoint: DeviceMode) => {
    const updatedComponents = components.map(component => {
      const defaultStyles = component.styles.default
      const defaultLayout = component.layout.default

      return {
        ...component,
        styles: {
          ...component.styles,
          [breakpoint]: defaultStyles
        },
        layout: {
          ...component.layout,
          [breakpoint]: defaultLayout
        }
      }
    })

    onComponentsUpdate(updatedComponents)
  }, [components, onComponentsUpdate])

  // Apply responsive styles to all components
  const applyResponsiveStyles = useCallback(() => {
    const updatedComponents = components.map(component => {
      const defaultStyles = component.styles.default
      const defaultLayout = component.layout.default

      // Apply responsive adjustments based on device mode
      let responsiveStyles = { ...defaultStyles }
      let responsiveLayout = { ...defaultLayout }

      if (deviceMode === 'tablet') {
        // Tablet adjustments
        responsiveStyles = {
          ...responsiveStyles,
          fontSize: Math.max(14, (responsiveStyles.fontSize || 16) * 0.9),
          padding: Math.max(10, (responsiveStyles.padding || 20) * 0.8)
        }
        responsiveLayout = {
          ...responsiveLayout,
          width: Math.min(responsiveLayout.width, breakpointValues.tablet - 40)
        }
      } else if (deviceMode === 'mobile') {
        // Mobile adjustments
        responsiveStyles = {
          ...responsiveStyles,
          fontSize: Math.max(12, (responsiveStyles.fontSize || 16) * 0.8),
          padding: Math.max(8, (responsiveStyles.padding || 20) * 0.6),
          textAlign: 'center'
        }
        responsiveLayout = {
          ...responsiveLayout,
          width: Math.min(responsiveLayout.width, breakpointValues.mobile - 20),
          height: Math.max(responsiveLayout.height, 40)
        }
      }

      return {
        ...component,
        styles: {
          ...component.styles,
          [deviceMode]: responsiveStyles
        },
        layout: {
          ...component.layout,
          [deviceMode]: responsiveLayout
        }
      }
    })

    onComponentsUpdate(updatedComponents)
  }, [components, deviceMode, breakpointValues, onComponentsUpdate])

  // Get breakpoint override count
  const getBreakpointOverrideCount = (breakpoint: DeviceMode): number => {
    return components.filter(component => {
      const styles = component.styles[breakpoint]
      const layout = component.layout[breakpoint]
      return styles && Object.keys(styles).length > 0 || layout && Object.keys(layout).length > 0
    }).length
  }

  return (
    <div className="space-y-4">
      {/* Device Mode Selector */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Layout className="w-5 h-5 mr-2" />
            Responsive Design
          </h3>
          <Badge variant="secondary" className="text-xs">
            {deviceConfigs[deviceMode].width}×{deviceConfigs[deviceMode].height}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {Object.entries(deviceConfigs).map(([mode, config]) => (
            <Button
              key={mode}
              variant={deviceMode === mode ? "default" : "outline"}
              size="sm"
              onClick={() => onDeviceModeChange(mode as DeviceMode)}
              className="flex flex-col items-center space-y-1 h-auto py-3"
            >
              {config.icon}
              <span className="text-xs">{config.name}</span>
              <span className="text-xs text-gray-500">{config.width}px</span>
            </Button>
          ))}
        </div>

        {/* Breakpoint Settings */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Breakpoint Settings</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingBreakpoint(!isEditingBreakpoint)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {isEditingBreakpoint && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label className="text-xs w-16">Tablet:</Label>
                <Input
                  type="number"
                  value={breakpointValues.tablet}
                  onChange={(e) => setBreakpointValues(prev => ({
                    ...prev,
                    tablet: parseInt(e.target.value) || 768
                  }))}
                  className="h-8 text-xs"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
              <div className="flex items-center space-x-2">
                <Label className="text-xs w-16">Mobile:</Label>
                <Input
                  type="number"
                  value={breakpointValues.mobile}
                  onChange={(e) => setBreakpointValues(prev => ({
                    ...prev,
                    mobile: parseInt(e.target.value) || 480
                  }))}
                  className="h-8 text-xs"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Breakpoint Overrides */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Breakpoint Overrides</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyResponsiveStyles()}
            >
              <Zap className="w-4 h-4 mr-2" />
              Auto-Apply
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {Object.entries(deviceConfigs).map(([mode, config]) => {
            const overrideCount = getBreakpointOverrideCount(mode as DeviceMode)
            const isActive = deviceMode === mode

            return (
              <div
                key={mode}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-colors",
                  isActive ? "border-blue-300 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-center space-x-3">
                  {config.icon}
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {config.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {config.width}×{config.height}px
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant={overrideCount > 0 ? "default" : "secondary"} className="text-xs">
                    {overrideCount} overrides
                  </Badge>
                  
                  {mode !== 'desktop' && (
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyStylesToBreakpoint('desktop', mode as DeviceMode)}
                        title="Copy from Desktop"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => resetBreakpointStyles(mode as DeviceMode)}
                        title="Reset to Default"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Component Properties */}
      {selectedComponent && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Component Properties</h3>
            <Badge variant="outline" className="text-xs">
              {selectedComponent.type}
            </Badge>
          </div>

          <div className="space-y-4">
            {/* Layout Properties */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Layout</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-500">X Position</Label>
                  <Input
                    type="number"
                    value={getComponentLayout(selectedComponent).x || 0}
                    onChange={(e) => updateComponentLayout(selectedComponent, {
                      x: parseInt(e.target.value) || 0
                    })}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Y Position</Label>
                  <Input
                    type="number"
                    value={getComponentLayout(selectedComponent).y || 0}
                    onChange={(e) => updateComponentLayout(selectedComponent, {
                      y: parseInt(e.target.value) || 0
                    })}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Width</Label>
                  <Input
                    type="number"
                    value={getComponentLayout(selectedComponent).width || 100}
                    onChange={(e) => updateComponentLayout(selectedComponent, {
                      width: parseInt(e.target.value) || 100
                    })}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Height</Label>
                  <Input
                    type="number"
                    value={getComponentLayout(selectedComponent).height || 100}
                    onChange={(e) => updateComponentLayout(selectedComponent, {
                      height: parseInt(e.target.value) || 100
                    })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Style Properties */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Styles</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-500">Font Size</Label>
                  <Input
                    type="number"
                    value={getComponentStyles(selectedComponent).fontSize || 16}
                    onChange={(e) => updateComponentStyles(selectedComponent, {
                      fontSize: parseInt(e.target.value) || 16
                    })}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Padding</Label>
                  <Input
                    type="number"
                    value={getComponentStyles(selectedComponent).padding || 0}
                    onChange={(e) => updateComponentStyles(selectedComponent, {
                      padding: parseInt(e.target.value) || 0
                    })}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Background Color</Label>
                  <Input
                    type="color"
                    value={getComponentStyles(selectedComponent).backgroundColor || '#ffffff'}
                    onChange={(e) => updateComponentStyles(selectedComponent, {
                      backgroundColor: e.target.value
                    })}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Text Color</Label>
                  <Input
                    type="color"
                    value={getComponentStyles(selectedComponent).color || '#000000'}
                    onChange={(e) => updateComponentStyles(selectedComponent, {
                      color: e.target.value
                    })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Visibility & Lock */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={selectedComponent.visible ?? true}
                  onCheckedChange={(checked) => onComponentUpdate({
                    ...selectedComponent,
                    visible: checked
                  })}
                />
                <Label className="text-sm">Visible</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={selectedComponent.locked ?? false}
                  onCheckedChange={(checked) => onComponentUpdate({
                    ...selectedComponent,
                    locked: checked
                  })}
                />
                <Label className="text-sm">Locked</Label>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default ResponsiveDesign
