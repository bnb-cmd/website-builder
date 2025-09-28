'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { 
  Palette, 
  Type, 
  Layout, 
  Wand2, 
  Download, 
  Upload, 
  Eye, 
  Edit, 
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Sparkles,
  Copy,
  RefreshCw
} from 'lucide-react'
import { apiHelpers } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface DesignSystem {
  id: string
  name: string
  description?: string
  brandName?: string
  brandValues: string[]
  brandPersonality?: string
  primaryColors: any[]
  secondaryColors: any[]
  neutralColors: any[]
  fontFamilies: any[]
  fontSizes: any[]
  spacingScale: any[]
  borderRadius: any[]
  shadows: any[]
  components: any
  aiGenerated: boolean
  status: string
  createdAt: string
}

interface DesignSystemGeneratorProps {
  websiteId: string
}

export function DesignSystemGenerator({ websiteId }: DesignSystemGeneratorProps) {
  const [designSystems, setDesignSystems] = useState<DesignSystem[]>([])
  const [selectedSystem, setSelectedSystem] = useState<DesignSystem | null>(null)
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [aiPrompt, setAiPrompt] = useState({
    prompt: '',
    industry: '',
    targetAudience: '',
    brandPersonality: '',
    colorPreferences: [] as string[],
    stylePreferences: [] as string[],
    mood: ''
  })

  const [newSystem, setNewSystem] = useState({
    name: '',
    description: '',
    brandName: '',
    brandValues: [] as string[],
    brandPersonality: ''
  })

  useEffect(() => {
    fetchDesignSystems()
  }, [websiteId])

  const fetchDesignSystems = async () => {
    try {
      const response = await apiHelpers.getDesignSystems(websiteId)
      setDesignSystems(response.data.data || [])
    } catch (error) {
      toast.error('Failed to fetch design systems')
    } finally {
      setLoading(false)
    }
  }

  const generateAIDesignSystem = async () => {
    try {
      const settings = {
        industry: aiPrompt.industry,
        targetAudience: aiPrompt.targetAudience,
        brandPersonality: aiPrompt.brandPersonality,
        colorPreferences: aiPrompt.colorPreferences,
        stylePreferences: aiPrompt.stylePreferences,
        mood: aiPrompt.mood
      }

      await apiHelpers.generateAIDesignSystem(websiteId, {
        prompt: aiPrompt.prompt,
        settings
      })
      
      toast.success('AI design system generation started!')
      setIsGenerateDialogOpen(false)
      setAiPrompt({
        prompt: '',
        industry: '',
        targetAudience: '',
        brandPersonality: '',
        colorPreferences: [],
        stylePreferences: [],
        mood: ''
      })
      fetchDesignSystems()
    } catch (error) {
      toast.error('Failed to generate design system')
    }
  }

  const createDesignSystem = async () => {
    try {
      await apiHelpers.createDesignSystem(websiteId, newSystem)
      toast.success('Design system created!')
      setIsCreateDialogOpen(false)
      setNewSystem({
        name: '',
        description: '',
        brandName: '',
        brandValues: [],
        brandPersonality: ''
      })
      fetchDesignSystems()
    } catch (error) {
      toast.error('Failed to create design system')
    }
  }

  const applyDesignSystem = async (systemId: string) => {
    try {
      await apiHelpers.applyDesignSystem(systemId, { websiteId })
      toast.success('Design system applied to website!')
    } catch (error) {
      toast.error('Failed to apply design system')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'GENERATING': return 'bg-blue-100 text-blue-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'APPLIED': return 'bg-purple-100 text-purple-800'
      case 'ARCHIVED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'GENERATING': return <Clock className="h-4 w-4" />
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />
      case 'APPLIED': return <CheckCircle className="h-4 w-4" />
      default: return <Edit className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Design System Generator</h1>
          <p className="text-muted-foreground">Create and manage brand design systems with AI</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Wand2 className="h-4 w-4 mr-2" />
                AI Generate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate AI Design System</DialogTitle>
                <DialogDescription>
                  Create a complete design system using AI based on your brand requirements.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Brand Description</label>
                  <Textarea
                    value={aiPrompt.prompt}
                    onChange={(e) => setAiPrompt({ ...aiPrompt, prompt: e.target.value })}
                    placeholder="Describe your brand, target audience, and design preferences..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Industry</label>
                    <Select value={aiPrompt.industry} onValueChange={(value) => setAiPrompt({ ...aiPrompt, industry: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                        <SelectItem value="food">Food & Beverage</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Brand Personality</label>
                    <Select value={aiPrompt.brandPersonality} onValueChange={(value) => setAiPrompt({ ...aiPrompt, brandPersonality: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select personality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="traditional">Traditional</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Target Audience</label>
                  <Input
                    value={aiPrompt.targetAudience}
                    onChange={(e) => setAiPrompt({ ...aiPrompt, targetAudience: e.target.value })}
                    placeholder="e.g., Young professionals, Families, Seniors"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Mood</label>
                  <Input
                    value={aiPrompt.mood}
                    onChange={(e) => setAiPrompt({ ...aiPrompt, mood: e.target.value })}
                    placeholder="e.g., Trustworthy, Innovative, Elegant"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={generateAIDesignSystem}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Design System
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Manual
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Design System</DialogTitle>
                <DialogDescription>
                  Create a design system manually with custom settings.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={newSystem.name}
                    onChange={(e) => setNewSystem({ ...newSystem, name: e.target.value })}
                    placeholder="Enter design system name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newSystem.description}
                    onChange={(e) => setNewSystem({ ...newSystem, description: e.target.value })}
                    placeholder="Describe this design system"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Brand Name</label>
                  <Input
                    value={newSystem.brandName}
                    onChange={(e) => setNewSystem({ ...newSystem, brandName: e.target.value })}
                    placeholder="Enter brand name"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createDesignSystem}>
                    Create Design System
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Design Systems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designSystems.map((system) => (
          <Card 
            key={system.id} 
            className={`cursor-pointer hover:shadow-lg transition-shadow ${selectedSystem?.id === system.id ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedSystem(system)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{system.name}</CardTitle>
                  <CardDescription>{system.brandName || 'Design System'}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {system.aiGenerated && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      AI
                    </Badge>
                  )}
                  <Badge className={getStatusColor(system.status)}>
                    {getStatusIcon(system.status)}
                    <span className="ml-1">{system.status}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {system.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {system.description}
                  </p>
                )}
                
                <div className="flex gap-2">
                  {system.brandValues.slice(0, 3).map((value) => (
                    <Badge key={value} variant="outline" className="text-xs">
                      {value}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedSystem(system)
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                  {system.status === 'COMPLETED' && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        applyDesignSystem(system.id)
                      }}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Apply
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Design System Preview */}
      {selectedSystem && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              {selectedSystem.name} - Design System Preview
            </CardTitle>
            <CardDescription>
              Complete design system with colors, typography, spacing, and components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="colors" className="space-y-6">
              <TabsList>
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="typography">Typography</TabsTrigger>
                <TabsTrigger value="spacing">Spacing</TabsTrigger>
                <TabsTrigger value="components">Components</TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Primary Colors</h4>
                  <div className="flex gap-4">
                    {selectedSystem.primaryColors?.map((color: any, index: number) => (
                      <div key={index} className="text-center">
                        <div 
                          className="w-16 h-16 rounded-lg border shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        />
                        <p className="text-sm font-medium mt-2">{color.name}</p>
                        <p className="text-xs text-muted-foreground">{color.hex}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Secondary Colors</h4>
                  <div className="flex gap-4">
                    {selectedSystem.secondaryColors?.map((color: any, index: number) => (
                      <div key={index} className="text-center">
                        <div 
                          className="w-16 h-16 rounded-lg border shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        />
                        <p className="text-sm font-medium mt-2">{color.name}</p>
                        <p className="text-xs text-muted-foreground">{color.hex}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Neutral Colors</h4>
                  <div className="flex gap-4">
                    {selectedSystem.neutralColors?.map((color: any, index: number) => (
                      <div key={index} className="text-center">
                        <div 
                          className="w-16 h-16 rounded-lg border shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        />
                        <p className="text-sm font-medium mt-2">{color.name}</p>
                        <p className="text-xs text-muted-foreground">{color.hex}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="typography" className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Font Families</h4>
                  <div className="space-y-3">
                    {selectedSystem.fontFamilies?.map((font: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <p className="font-medium">{font.name}</p>
                        <p className="text-sm text-muted-foreground">{font.usage}</p>
                        <p className="text-sm" style={{ fontFamily: font.name }}>
                          The quick brown fox jumps over the lazy dog
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Font Sizes</h4>
                  <div className="space-y-2">
                    {selectedSystem.fontSizes?.map((size: any, index: number) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 text-sm text-muted-foreground">{size.name}</div>
                        <div 
                          className="flex-1"
                          style={{ fontSize: `${size.size}px`, lineHeight: `${size.lineHeight}px` }}
                        >
                          Sample text ({size.size}px)
                        </div>
                        <div className="text-xs text-muted-foreground">{size.usage}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="spacing" className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Spacing Scale</h4>
                  <div className="space-y-2">
                    {selectedSystem.spacingScale?.map((space: any, index: number) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 text-sm text-muted-foreground">{space.name}</div>
                        <div 
                          className="bg-primary h-4 rounded"
                          style={{ width: `${space.value}px` }}
                        />
                        <div className="text-sm">{space.value}px</div>
                        <div className="text-xs text-muted-foreground">{space.usage}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Border Radius</h4>
                  <div className="flex gap-4">
                    {selectedSystem.borderRadius?.map((radius: any, index: number) => (
                      <div key={index} className="text-center">
                        <div 
                          className="w-12 h-12 bg-primary"
                          style={{ borderRadius: `${radius.value}px` }}
                        />
                        <p className="text-sm font-medium mt-2">{radius.name}</p>
                        <p className="text-xs text-muted-foreground">{radius.value}px</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="components" className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Button Styles</h4>
                  <div className="flex gap-4">
                    {selectedSystem.components?.buttons && Object.entries(selectedSystem.components.buttons).map(([key, button]: [string, any]) => (
                      <button
                        key={key}
                        className="px-4 py-2 rounded"
                        style={{
                          backgroundColor: button.backgroundColor,
                          color: button.color,
                          border: button.border,
                          borderRadius: button.borderRadius,
                          fontSize: button.fontSize,
                          fontWeight: button.fontWeight
                        }}
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)} Button
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Card Styles</h4>
                  <div className="max-w-sm">
                    {selectedSystem.components?.cards && Object.entries(selectedSystem.components.cards).map(([key, card]: [string, any]) => (
                      <div
                        key={key}
                        className="p-4"
                        style={{
                          backgroundColor: card.backgroundColor,
                          borderRadius: card.borderRadius,
                          padding: card.padding,
                          boxShadow: card.boxShadow,
                          border: card.border
                        }}
                      >
                        <h5 className="font-medium mb-2">Sample Card</h5>
                        <p className="text-sm text-muted-foreground">This is a sample card using the {key} style.</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
