'use client'

import { Element } from '@/types/editor'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MousePointer,
  Eye,
  Zap,
  Plus,
  Trash2,
  Copy
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface InteractionsPanelProps {
  element: Element
  onUpdateElement: (elementId: string, updates: Partial<Element>) => void
  onClose?: () => void
}

interface Interaction {
  id: string
  trigger: 'hover' | 'click' | 'scrollIntoView'
  action: 'playAnimation' | 'link' | 'reveal' | 'toggleState'
  targetAnimation?: string
  link?: string
  targetElement?: string
  toggleState?: { property: string, value: any }
}

const triggerOptions = [
  { value: 'hover', label: 'Mouse Hover', icon: MousePointer },
  { value: 'click', label: 'Mouse Click', icon: MousePointer },
  { value: 'scrollIntoView', label: 'Scrolls into View', icon: Eye }
]

const actionOptions = [
  { value: 'playAnimation', label: 'Play Animation', icon: Zap },
  { value: 'link', label: 'Open Link', icon: MousePointer },
  { value: 'reveal', label: 'Reveal Element', icon: Eye },
  { value: 'toggleState', label: 'Toggle State', icon: Zap }
]

export function InteractionsPanel({ element, onUpdateElement, onClose }: InteractionsPanelProps) {
  const interactions = element.interactions || []
  const animations = element.animations || []

  const updateInteractions = (updatedInteractions: Interaction[]) => {
    onUpdateElement(element.id, { interactions: updatedInteractions })
  }

  const addInteraction = () => {
    const newInteraction: Interaction = {
      id: `interaction_${Date.now()}`,
      trigger: 'click',
      action: 'playAnimation'
    }
    updateInteractions([...interactions, newInteraction])
  }

  const updateInteraction = (id: string, updates: Partial<Interaction>) => {
    const updated = interactions.map(inter => 
      inter.id === id ? { ...inter, ...updates } : inter
    )
    updateInteractions(updated)
  }

  const deleteInteraction = (id: string) => {
    updateInteractions(interactions.filter(inter => inter.id !== id))
  }

  const duplicateInteraction = (id: string) => {
    const interToDuplicate = interactions.find(i => i.id === id)
    if (interToDuplicate) {
      const newInteraction = {
        ...interToDuplicate,
        id: `interaction_${Date.now()}`
      }
      updateInteractions([...interactions, newInteraction])
    }
  }

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Interactions & Effects</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            ×
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Add dynamic behavior to your elements.
        </p>
      </div>

      <Tabs defaultValue="interactions" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 p-4">
          <TabsContent value="interactions" className="mt-0">
            <div className="space-y-4">
              {interactions.map((interaction) => (
                <Card key={interaction.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div>
                          <Label>Trigger</Label>
                          <Select 
                            value={interaction.trigger} 
                            onValueChange={(v: Interaction['trigger']) => updateInteraction(interaction.id, { trigger: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {triggerOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  <div className="flex items-center gap-2">
                                    <opt.icon className="h-4 w-4" />
                                    {opt.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Action</Label>
                          <Select 
                            value={interaction.action}
                            onValueChange={(v: Interaction['action']) => updateInteraction(interaction.id, { action: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {actionOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  <div className="flex items-center gap-2">
                                    <opt.icon className="h-4 w-4" />
                                    {opt.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => duplicateInteraction(interaction.id)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => deleteInteraction(interaction.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Action specific settings */}
                    {interaction.action === 'playAnimation' && (
                      <div>
                        <Label>Animation to Play</Label>
                        <Select 
                          value={interaction.targetAnimation} 
                          onValueChange={(v) => updateInteraction(interaction.id, { targetAnimation: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an animation" />
                          </SelectTrigger>
                          <SelectContent>
                            {animations.map(anim => (
                              <SelectItem key={anim.id} value={anim.id}>
                                {anim.name}
                              </SelectItem>
                            ))}
                            {animations.length === 0 && (
                              <div className="p-2 text-sm text-muted-foreground text-center">
                                No animations on this element.
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              <Button variant="outline" className="w-full" onClick={addInteraction}>
                <Plus className="h-4 w-4 mr-2" />
                Add Interaction
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="effects" className="mt-0">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Apply visual effects like parallax, mouse tracking, and more.
              </p>
              {/* Effect settings would go here */}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
