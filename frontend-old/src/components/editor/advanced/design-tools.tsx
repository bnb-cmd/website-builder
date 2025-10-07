'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ColorPicker } from '../color-picker'
import { 
  Wand2,
  Sparkles,
  Droplets,
  Sun,
  Contrast,
  Palette,
  Filter,
  Move,
  RotateCw,
  Maximize2,
  FlipHorizontal,
  FlipVertical,
  Layers,
  Zap,
  Image as ImageIcon,
  Type,
  Square,
  Circle,
  Triangle,
  Star,
  Heart,
  Hexagon,
  Download,
  Upload,
  Crop,
  PaintBucket,
  Eraser,
  Copy,
  RefreshCw,
  Undo,
  Redo,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react'
import { PentagonIcon } from '@/components/icons/custom-icons'
import { Element } from '@/types/editor'
import { cn } from '@/lib/utils'

interface DesignToolsProps {
  selectedElement: Element | null
  onUpdateElement: (elementId: string, updates: Partial<Element>) => void
  onAddElement: (element: Element) => void
}

interface Filter {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  cssFilter: string
  preview: string
}

const filters: Filter[] = [
  { id: 'none', name: 'None', icon: Circle, cssFilter: 'none', preview: '' },
  { id: 'grayscale', name: 'Grayscale', icon: Circle, cssFilter: 'grayscale(100%)', preview: 'grayscale(100%)' },
  { id: 'sepia', name: 'Sepia', icon: Circle, cssFilter: 'sepia(100%)', preview: 'sepia(100%)' },
  { id: 'blur', name: 'Blur', icon: Circle, cssFilter: 'blur(3px)', preview: 'blur(1px)' },
  { id: 'brightness', name: 'Bright', icon: Sun, cssFilter: 'brightness(1.5)', preview: 'brightness(1.5)' },
  { id: 'contrast', name: 'Contrast', icon: Contrast, cssFilter: 'contrast(1.5)', preview: 'contrast(1.5)' },
  { id: 'vintage', name: 'Vintage', icon: Circle, cssFilter: 'sepia(50%) saturate(1.5)', preview: 'sepia(50%) saturate(1.5)' },
  { id: 'cold', name: 'Cold', icon: Circle, cssFilter: 'hue-rotate(180deg)', preview: 'hue-rotate(180deg)' },
  { id: 'warm', name: 'Warm', icon: Circle, cssFilter: 'hue-rotate(30deg) saturate(1.2)', preview: 'hue-rotate(30deg)' }
]

const shapes = [
  { id: 'rectangle', name: 'Rectangle', icon: Square },
  { id: 'circle', name: 'Circle', icon: Circle },
  { id: 'triangle', name: 'Triangle', icon: Triangle },
  { id: 'star', name: 'Star', icon: Star },
  { id: 'heart', name: 'Heart', icon: Heart },
  { id: 'hexagon', name: 'Hexagon', icon: Hexagon },
  { id: 'pentagon', name: 'Pentagon', icon: PentagonIcon }
]

const textEffects = [
  { id: 'none', name: 'None', style: {} },
  { id: 'shadow', name: 'Shadow', style: { textShadow: '2px 2px 4px rgba(0,0,0,0.3)' } },
  { id: 'outline', name: 'Outline', style: { textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' } },
  { id: 'glow', name: 'Glow', style: { textShadow: '0 0 10px currentColor' } },
  { id: '3d', name: '3D', style: { textShadow: '3px 3px 0 #888, 4px 4px 0 #999, 5px 5px 0 #aaa' } },
  { id: 'gradient', name: 'Gradient', style: { 
    background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  }}
]

const animations = [
  { id: 'none', name: 'None', animation: '' },
  { id: 'fadeIn', name: 'Fade In', animation: 'fadeIn 1s ease-in' },
  { id: 'slideIn', name: 'Slide In', animation: 'slideInLeft 1s ease-out' },
  { id: 'bounceIn', name: 'Bounce In', animation: 'bounceIn 1s ease-out' },
  { id: 'pulse', name: 'Pulse', animation: 'pulse 2s infinite' },
  { id: 'shake', name: 'Shake', animation: 'shake 0.5s' },
  { id: 'rotate', name: 'Rotate', animation: 'rotate 2s linear infinite' }
]

export function DesignTools({ selectedElement, onUpdateElement, onAddElement }: DesignToolsProps) {
  const [activeTab, setActiveTab] = useState('effects')
  const [opacity, setOpacity] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(100)
  const [blur, setBlur] = useState(0)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturate, setSaturate] = useState(100)
  const [selectedFilter, setSelectedFilter] = useState('none')
  const [selectedAnimation, setSelectedAnimation] = useState('none')
  const [shadowX, setShadowX] = useState(0)
  const [shadowY, setShadowY] = useState(0)
  const [shadowBlur, setShadowBlur] = useState(0)
  const [shadowColor, setShadowColor] = useState('#000000')
  const [borderRadius, setBorderRadius] = useState(0)

  const updateStyle = (key: string, value: any) => {
    if (!selectedElement) return
    
    onUpdateElement(selectedElement.id, {
      style: {
        ...selectedElement.style,
        [key]: value
      }
    })
  }

  const applyFilter = (filter: string) => {
    if (!selectedElement) return
    setSelectedFilter(filter)
    updateStyle('filter', filter)
  }

  const applyAnimation = (animation: string) => {
    if (!selectedElement) return
    setSelectedAnimation(animation)
    updateStyle('animation', animation)
  }

  const applyTransform = () => {
    if (!selectedElement) return
    
    const transforms = []
    if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`)
    if (scale !== 100) transforms.push(`scale(${scale / 100})`)
    
    updateStyle('transform', transforms.join(' '))
  }

  const applyShadow = () => {
    if (!selectedElement) return
    
    const shadow = `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColor}`
    
    if (selectedElement.type === 'text' || selectedElement.type === 'heading') {
      updateStyle('textShadow', shadow)
    } else {
      updateStyle('boxShadow', shadow)
    }
  }

  const addShape = (shapeId: string) => {
    const shape = shapes.find(s => s.id === shapeId)
    if (!shape) return

    const newElement: Element = {
      id: `shape-${Date.now()}`,
      type: 'container',
      props: {
        name: shape.name,
        shape: shapeId
      },
      children: [],
      style: {
        width: '100px',
        height: '100px',
        backgroundColor: '#0f172a',
        borderRadius: shapeId === 'circle' ? '50%' : '0',
        clipPath: getShapeClipPath(shapeId)
      },
      position: { x: 0, y: 0 }
    }

    onAddElement(newElement)
  }

  const getShapeClipPath = (shapeId: string): string => {
    switch (shapeId) {
      case 'triangle':
        return 'polygon(50% 0%, 0% 100%, 100% 100%)'
      case 'star':
        return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
      case 'heart':
        return 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")'
      case 'hexagon':
        return 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
      case 'pentagon':
        return 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
      default:
        return 'none'
    }
  }

  const flipElement = (direction: 'horizontal' | 'vertical') => {
    if (!selectedElement) return
    
    const currentTransform = selectedElement.style?.transform || ''
    const scaleX = direction === 'horizontal' ? -1 : 1
    const scaleY = direction === 'vertical' ? -1 : 1
    
    updateStyle('transform', `${currentTransform} scale(${scaleX}, ${scaleY})`)
  }

  const resetTransform = () => {
    if (!selectedElement) return
    
    setOpacity(100)
    setRotation(0)
    setScale(100)
    setBlur(0)
    setBrightness(100)
    setContrast(100)
    setSaturate(100)
    setSelectedFilter('none')
    setShadowX(0)
    setShadowY(0)
    setShadowBlur(0)
    setBorderRadius(0)
    
    onUpdateElement(selectedElement.id, {
      style: {
        ...selectedElement.style,
        opacity: 1,
        transform: 'none',
        filter: 'none',
        boxShadow: 'none',
        textShadow: 'none',
        borderRadius: '0'
      }
    })
  }

  return (
    <Card className="w-80 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center">
            <Wand2 className="h-4 w-4 mr-2" />
            Design Tools
          </div>
          {selectedElement && (
            <Badge variant="secondary" className="text-xs">
              {selectedElement.type}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 rounded-none">
            <TabsTrigger value="effects" className="text-xs">Effects</TabsTrigger>
            <TabsTrigger value="transform" className="text-xs">Transform</TabsTrigger>
            <TabsTrigger value="shapes" className="text-xs">Shapes</TabsTrigger>
            <TabsTrigger value="animate" className="text-xs">Animate</TabsTrigger>
          </TabsList>

          {/* Effects Tab */}
          <TabsContent value="effects" className="p-4 space-y-4">
            {/* Filters */}
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                Filters
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    className={cn(
                      'p-3 rounded-lg border text-center hover:bg-muted/50 transition-colors',
                      selectedFilter === filter.id && 'border-primary bg-primary/10'
                    )}
                    onClick={() => applyFilter(filter.cssFilter)}
                  >
                    <div
                      className="w-8 h-8 mx-auto mb-1 bg-gradient-to-br from-slate-900 to-purple-500 rounded"
                      style={{ filter: filter.preview }}
                    />
                    <span className="text-xs">{filter.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Advanced Filters */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs">Opacity</Label>
                  <span className="text-xs text-muted-foreground">{opacity}%</span>
                </div>
                <Slider
                  value={[opacity]}
                  onValueChange={([value]) => {
                    setOpacity(value)
                    updateStyle('opacity', value / 100)
                  }}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs">Blur</Label>
                  <span className="text-xs text-muted-foreground">{blur}px</span>
                </div>
                <Slider
                  value={[blur]}
                  onValueChange={([value]) => {
                    setBlur(value)
                    updateStyle('filter', `blur(${value}px)`)
                  }}
                  min={0}
                  max={20}
                  step={1}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs">Brightness</Label>
                  <span className="text-xs text-muted-foreground">{brightness}%</span>
                </div>
                <Slider
                  value={[brightness]}
                  onValueChange={([value]) => {
                    setBrightness(value)
                    updateStyle('filter', `brightness(${value}%)`)
                  }}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs">Contrast</Label>
                  <span className="text-xs text-muted-foreground">{contrast}%</span>
                </div>
                <Slider
                  value={[contrast]}
                  onValueChange={([value]) => {
                    setContrast(value)
                    updateStyle('filter', `contrast(${value}%)`)
                  }}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>
            </div>

            <Separator />

            {/* Shadow */}
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                Shadow
              </Label>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">X</Label>
                    <Slider
                      value={[shadowX]}
                      onValueChange={([value]) => {
                        setShadowX(value)
                        applyShadow()
                      }}
                      min={-20}
                      max={20}
                      step={1}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Y</Label>
                    <Slider
                      value={[shadowY]}
                      onValueChange={([value]) => {
                        setShadowY(value)
                        applyShadow()
                      }}
                      min={-20}
                      max={20}
                      step={1}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Blur</Label>
                    <Slider
                      value={[shadowBlur]}
                      onValueChange={([value]) => {
                        setShadowBlur(value)
                        applyShadow()
                      }}
                      min={0}
                      max={20}
                      step={1}
                    />
                  </div>
                </div>
                <ColorPicker
                  value={shadowColor}
                  onChange={(color) => {
                    setShadowColor(color)
                    applyShadow()
                  }}
                />
              </div>
            </div>
          </TabsContent>

          {/* Transform Tab */}
          <TabsContent value="transform" className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => flipElement('horizontal')}
              >
                <FlipHorizontal className="h-4 w-4 mr-2" />
                Flip H
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => flipElement('vertical')}
              >
                <FlipVertical className="h-4 w-4 mr-2" />
                Flip V
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs">Rotation</Label>
                  <span className="text-xs text-muted-foreground">{rotation}°</span>
                </div>
                <Slider
                  value={[rotation]}
                  onValueChange={([value]) => {
                    setRotation(value)
                    applyTransform()
                  }}
                  min={-180}
                  max={180}
                  step={1}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs">Scale</Label>
                  <span className="text-xs text-muted-foreground">{scale}%</span>
                </div>
                <Slider
                  value={[scale]}
                  onValueChange={([value]) => {
                    setScale(value)
                    applyTransform()
                  }}
                  min={50}
                  max={200}
                  step={1}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs">Border Radius</Label>
                  <span className="text-xs text-muted-foreground">{borderRadius}px</span>
                </div>
                <Slider
                  value={[borderRadius]}
                  onValueChange={([value]) => {
                    setBorderRadius(value)
                    updateStyle('borderRadius', `${value}px`)
                  }}
                  min={0}
                  max={50}
                  step={1}
                />
              </div>
            </div>

            <Separator />

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={resetTransform}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Transform
            </Button>
          </TabsContent>

          {/* Shapes Tab */}
          <TabsContent value="shapes" className="p-4">
            <div className="grid grid-cols-3 gap-2">
              {shapes.map((shape) => (
                <button
                  key={shape.id}
                  className="p-4 rounded-lg border hover:bg-muted/50 transition-colors text-center"
                  onClick={() => addShape(shape.id)}
                >
                  <shape.icon className="h-8 w-8 mx-auto mb-1" />
                  <span className="text-xs">{shape.name}</span>
                </button>
              ))}
            </div>

            <Separator className="my-4" />

            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                Text Effects
              </Label>
              <div className="space-y-2">
                {selectedElement?.type === 'text' || selectedElement?.type === 'heading' ? (
                  textEffects.map((effect) => (
                    <Button
                      key={effect.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        if (!selectedElement) return
                        onUpdateElement(selectedElement.id, {
                          style: {
                            ...selectedElement.style,
                            ...effect.style
                          }
                        })
                      }}
                    >
                      <Type className="h-4 w-4 mr-2" />
                      {effect.name}
                    </Button>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    Select a text element to apply effects
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Animate Tab */}
          <TabsContent value="animate" className="p-4">
            <div className="space-y-4">
              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Entrance Animation
                </Label>
                <Select value={selectedAnimation} onValueChange={applyAnimation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {animations.map((animation) => (
                      <SelectItem key={animation.id} value={animation.animation}>
                        {animation.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Animation Settings</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" disabled={!selectedElement}>
                    <Zap className="h-4 w-4 mr-2" />
                    Speed
                  </Button>
                  <Button variant="outline" size="sm" disabled={!selectedElement}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Loop
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Preview
                </Label>
                <div 
                  className="h-24 bg-muted rounded-lg flex items-center justify-center"
                  style={{ animation: selectedAnimation }}
                >
                  <div className="w-16 h-16 bg-primary rounded-lg" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
