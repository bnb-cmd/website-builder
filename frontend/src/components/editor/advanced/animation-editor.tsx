'use client'

import { useState } from 'react'
import { Element } from '@/types/editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Clock,
  Zap,
  Move,
  RotateCw,
  Maximize,
  Minimize,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'

interface AnimationEditorProps {
  element: Element
  onUpdateElement: (elementId: string, updates: Partial<Element>) => void
  onClose?: () => void
}

interface Animation {
  id: string
  name: string
  type: 'entrance' | 'exit' | 'emphasis' | 'motion'
  effect: string
  duration: number
  delay: number
  easing: string
  repeat: number | 'infinite'
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  fillMode: 'none' | 'forwards' | 'backwards' | 'both'
}

const animationEffects = {
  entrance: [
    { value: 'fadeIn', label: 'Fade In' },
    { value: 'slideInLeft', label: 'Slide In Left' },
    { value: 'slideInRight', label: 'Slide In Right' },
    { value: 'slideInUp', label: 'Slide In Up' },
    { value: 'slideInDown', label: 'Slide In Down' },
    { value: 'zoomIn', label: 'Zoom In' },
    { value: 'bounceIn', label: 'Bounce In' },
    { value: 'flipIn', label: 'Flip In' },
    { value: 'rotateIn', label: 'Rotate In' }
  ],
  exit: [
    { value: 'fadeOut', label: 'Fade Out' },
    { value: 'slideOutLeft', label: 'Slide Out Left' },
    { value: 'slideOutRight', label: 'Slide Out Right' },
    { value: 'slideOutUp', label: 'Slide Out Up' },
    { value: 'slideOutDown', label: 'Slide Out Down' },
    { value: 'zoomOut', label: 'Zoom Out' },
    { value: 'bounceOut', label: 'Bounce Out' },
    { value: 'flipOut', label: 'Flip Out' },
    { value: 'rotateOut', label: 'Rotate Out' }
  ],
  emphasis: [
    { value: 'pulse', label: 'Pulse' },
    { value: 'shake', label: 'Shake' },
    { value: 'wobble', label: 'Wobble' },
    { value: 'swing', label: 'Swing' },
    { value: 'tada', label: 'Tada' },
    { value: 'heartBeat', label: 'Heart Beat' },
    { value: 'flash', label: 'Flash' },
    { value: 'rubber', label: 'Rubber Band' },
    { value: 'jello', label: 'Jello' }
  ],
  motion: [
    { value: 'float', label: 'Float' },
    { value: 'rotate', label: 'Rotate' },
    { value: 'scale', label: 'Scale' },
    { value: 'skew', label: 'Skew' },
    { value: 'moveX', label: 'Move Horizontal' },
    { value: 'moveY', label: 'Move Vertical' },
    { value: 'moveLoop', label: 'Move Loop' },
    { value: 'pendulum', label: 'Pendulum' },
    { value: 'orbit', label: 'Orbit' }
  ]
}

const easingOptions = [
  { value: 'linear', label: 'Linear' },
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'cubic-bezier(0.68,-0.55,0.265,1.55)', label: 'Back' },
  { value: 'cubic-bezier(0.175,0.885,0.32,1.275)', label: 'Elastic' },
  { value: 'cubic-bezier(0.6,-0.28,0.735,0.045)', label: 'Bounce' }
]

export function AnimationEditor({ element, onUpdateElement, onClose }: AnimationEditorProps) {
  const [animations, setAnimations] = useState<Animation[]>(
    element.animations || []
  )
  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(
    animations[0]?.id || null
  )
  const [isPlaying, setIsPlaying] = useState(false)
  const [hoveredEffect, setHoveredEffect] = useState<string | null>(null)

  const currentAnimation = animations.find(a => a.id === selectedAnimation)

  const addAnimation = (type: Animation['type']) => {
    const newAnimation: Animation = {
      id: `anim_${Date.now()}`,
      name: `Animation ${animations.length + 1}`,
      type,
      effect: animationEffects[type][0].value,
      duration: 1000,
      delay: 0,
      easing: 'ease',
      repeat: 1,
      direction: 'normal',
      fillMode: 'both'
    }
    
    const updated = [...animations, newAnimation]
    setAnimations(updated)
    setSelectedAnimation(newAnimation.id)
    updateElementAnimations(updated)
  }

  const updateAnimation = (id: string, updates: Partial<Animation>) => {
    const updated = animations.map(anim => 
      anim.id === id ? { ...anim, ...updates } : anim
    )
    setAnimations(updated)
    updateElementAnimations(updated)
  }

  const deleteAnimation = (id: string) => {
    const updated = animations.filter(anim => anim.id !== id)
    setAnimations(updated)
    if (selectedAnimation === id) {
      setSelectedAnimation(updated[0]?.id || null)
    }
    updateElementAnimations(updated)
  }

  const duplicateAnimation = (id: string) => {
    const animToDuplicate = animations.find(a => a.id === id)
    if (animToDuplicate) {
      const newAnimation = {
        ...animToDuplicate,
        id: `anim_${Date.now()}`,
        name: `${animToDuplicate.name} (Copy)`
      }
      const updated = [...animations, newAnimation]
      setAnimations(updated)
      setSelectedAnimation(newAnimation.id)
      updateElementAnimations(updated)
    }
  }

  const updateElementAnimations = (anims: Animation[]) => {
    onUpdateElement(element.id, { animations: anims })
  }

  const playAnimation = () => {
    setIsPlaying(true)
    // In a real implementation, this would trigger the animation preview
    setTimeout(() => setIsPlaying(false), 2000)
  }

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Animation Editor</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            ×
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={isPlaying ? 'secondary' : 'default'}
            onClick={playAnimation}
            disabled={animations.length === 0}
          >
            {isPlaying ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {isPlaying ? 'Stop' : 'Preview'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setAnimations([])
              updateElementAnimations([])
            }}
            disabled={animations.length === 0}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      <Tabs defaultValue="animations" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="animations">Animations</TabsTrigger>
          <TabsTrigger value="transitions">Transitions</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 p-4">
          <TabsContent value="animations" className="mt-0">
            {/* Animation List */}
            <div className="space-y-2 mb-4">
              {animations.map((anim) => (
                <div
                  key={anim.id}
                  onClick={() => setSelectedAnimation(anim.id)}
                  className={`
                    p-3 rounded-lg border cursor-pointer transition-all
                    ${selectedAnimation === anim.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`
                        w-2 h-2 rounded-full
                        ${anim.type === 'entrance' ? 'bg-green-500' :
                          anim.type === 'exit' ? 'bg-red-500' :
                          anim.type === 'emphasis' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }
                      `} />
                      <span className="font-medium text-sm">{anim.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          duplicateAnimation(anim.id)
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteAnimation(anim.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {anim.effect} • {anim.duration}ms
                  </div>
                </div>
              ))}
            </div>

            {/* Add Animation Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              <Button
                size="sm"
                variant="outline"
                onClick={() => addAnimation('entrance')}
              >
                <ArrowDown className="h-4 w-4 mr-1" />
                Entrance
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => addAnimation('exit')}
              >
                <ArrowUp className="h-4 w-4 mr-1" />
                Exit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => addAnimation('emphasis')}
              >
                <Zap className="h-4 w-4 mr-1" />
                Emphasis
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => addAnimation('motion')}
              >
                <Move className="h-4 w-4 mr-1" />
                Motion
              </Button>
            </div>

            {/* Animation Properties */}
            {currentAnimation && (
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={currentAnimation.name}
                    onChange={(e) => updateAnimation(currentAnimation.id, { name: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Effect</Label>
                  <Select
                    value={currentAnimation.effect}
                    onValueChange={(value) => updateAnimation(currentAnimation.id, { effect: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {animationEffects[currentAnimation.type].map((effect) => (
                        <SelectItem 
                          key={effect.value} 
                          value={effect.value}
                          onMouseEnter={() => setHoveredEffect(effect.value)}
                          onMouseLeave={() => setHoveredEffect(null)}
                        >
                          {effect.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label>Duration</Label>
                    <span className="text-sm text-muted-foreground">
                      {currentAnimation.duration}ms
                    </span>
                  </div>
                  <Slider
                    value={[currentAnimation.duration]}
                    onValueChange={([value]) => updateAnimation(currentAnimation.id, { duration: value })}
                    min={100}
                    max={5000}
                    step={100}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label>Delay</Label>
                    <span className="text-sm text-muted-foreground">
                      {currentAnimation.delay}ms
                    </span>
                  </div>
                  <Slider
                    value={[currentAnimation.delay]}
                    onValueChange={([value]) => updateAnimation(currentAnimation.id, { delay: value })}
                    min={0}
                    max={5000}
                    step={100}
                  />
                </div>

                <div>
                  <Label>Easing</Label>
                  <Select
                    value={currentAnimation.easing}
                    onValueChange={(value) => updateAnimation(currentAnimation.id, { easing: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {easingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label>Repeat</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {currentAnimation.repeat === 'infinite' ? '∞' : currentAnimation.repeat}
                      </span>
                      <Switch
                        checked={currentAnimation.repeat === 'infinite'}
                        onCheckedChange={(checked) => 
                          updateAnimation(currentAnimation.id, { repeat: checked ? 'infinite' : 1 })
                        }
                      />
                    </div>
                  </div>
                  {currentAnimation.repeat !== 'infinite' && (
                    <Slider
                      value={[currentAnimation.repeat as number]}
                      onValueChange={([value]) => updateAnimation(currentAnimation.id, { repeat: value })}
                      min={1}
                      max={10}
                      step={1}
                    />
                  )}
                </div>

                <div>
                  <Label>Direction</Label>
                  <Select
                    value={currentAnimation.direction}
                    onValueChange={(value: Animation['direction']) => 
                      updateAnimation(currentAnimation.id, { direction: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="reverse">Reverse</SelectItem>
                      <SelectItem value="alternate">Alternate</SelectItem>
                      <SelectItem value="alternate-reverse">Alternate Reverse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="transitions" className="mt-0">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Configure hover, focus, and active state transitions.
              </p>
              {/* Transition settings would go here */}
            </div>
          </TabsContent>

          <TabsContent value="interactions" className="mt-0">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Set up scroll-triggered animations and interactive effects.
              </p>
              {/* Interaction settings would go here */}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
