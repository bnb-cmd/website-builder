'use client'

import { useState } from 'react'
import { Element } from '@/types/editor'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useWebsiteStore } from '@/store/website-store'
import { 
  Bot,
  Sparkles,
  RefreshCw,
  LayoutGrid,
  Palette,
  Image as ImageIcon,
  Check,
  Wand2
} from 'lucide-react'

interface AIDesignAssistantPanelProps {
  onClose?: () => void
}

interface Suggestion {
  id: string
  title: string
  description: string
  action: () => void
  category: 'layout' | 'color' | 'typography' | 'content'
}

export function AIDesignAssistantPanel({ onClose }: AIDesignAssistantPanelProps) {
  const { selectedElement, updateElement, addElement } = useWebsiteStore()
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [imagePrompt, setImagePrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const generateSuggestions = () => {
    setIsLoading(true)
    // Simulate AI analysis and suggestion generation
    setTimeout(() => {
      const newSuggestions: Suggestion[] = []
      
      if (selectedElement) {
        newSuggestions.push({
          id: 's1',
          title: 'Improve Layout',
          description: 'Convert this container to a 3-column responsive grid for better organization.',
          action: () => console.log('Applying 3-column grid'),
          category: 'layout'
        })
        newSuggestions.push({
          id: 's2',
          title: 'Enhance Color Contrast',
          description: 'The text color has low contrast with the background. Update to a more accessible color.',
          action: () => updateElement(selectedElement.id, { style: { ...selectedElement.style, color: '#FFFFFF' } }),
          category: 'color'
        })
      }
      
      newSuggestions.push({
        id: 's3',
        title: 'Apply Harmonious Palette',
        description: 'Generate and apply a new, professionally designed color palette to the entire site.',
        action: () => console.log('Applying new color palette'),
        category: 'color'
      })

      setSuggestions(newSuggestions)
      setIsLoading(false)
    }, 1500)
  }

  const generateImage = () => {
    setIsLoading(true)
    // Simulate AI image generation
    setTimeout(() => {
      setGeneratedImage(`https://source.unsplash.com/random/400x300/?${encodeURIComponent(imagePrompt)}`)
      setIsLoading(false)
    }, 2000)
  }

  const colorPalettes = [
    { name: 'Ocean Breeze', colors: ['#A2D2FF', '#BDE0FE', '#FFAFCC', '#FFC8DD', '#CDB4DB'] },
    { name: 'Forest Walk', colors: ['#ccd5ae', '#e9edc9', '#fefae0', '#faedcd', '#d4a373'] },
    { name: 'Sunset Vibes', colors: ['#fec89a', '#fde2e4', '#fad2e1', '#c5dedd', '#a2d2ff'] },
    { name: 'Modern Corporate', colors: ['#0d1b2a', '#1b263b', '#415a77', '#778da9', '#e0e1dd'] }
  ]

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Design Assistant
          </h3>
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
          Let AI help you design faster and better.
        </p>
      </div>
      
      <Tabs defaultValue="suggestions" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="palettes">Colors</TabsTrigger>
          <TabsTrigger value="graphics">Graphics</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="flex-1">
          <TabsContent value="suggestions" className="p-4 mt-0">
            <div className="space-y-4">
              <Button className="w-full" onClick={generateSuggestions} disabled={isLoading}>
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Analyze Page & Get Suggestions
              </Button>
              
              {suggestions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Recommendations</h4>
                  {suggestions.map(suggestion => (
                    <Card key={suggestion.id}>
                      <CardContent className="p-3">
                        <p className="font-semibold">{suggestion.title}</p>
                        <p className="text-sm text-muted-foreground my-2">{suggestion.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{suggestion.category}</Badge>
                          <Button size="sm" onClick={suggestion.action}>
                            <Wand2 className="h-4 w-4 mr-2" />
                            Apply Fix
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="palettes" className="p-4 mt-0">
            <div className="space-y-4">
              <Button className="w-full">
                <Palette className="h-4 w-4 mr-2" />
                Generate AI Color Palettes
              </Button>
              
              <div className="space-y-3">
                {colorPalettes.map(palette => (
                  <Card key={palette.name}>
                    <CardContent className="p-3">
                      <p className="font-semibold mb-2">{palette.name}</p>
                      <div className="flex gap-1 h-8 rounded-md overflow-hidden mb-2">
                        {palette.colors.map(color => (
                          <div key={color} style={{ backgroundColor: color }} className="flex-1" />
                        ))}
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Apply Palette
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="graphics" className="p-4 mt-0">
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">AI Image Generation</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Describe an image, and AI will create it for you.
                  </p>
                  <textarea
                    placeholder="e.g., 'A futuristic cityscape in Karachi at sunset'"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="w-full p-2 border border-border rounded-md text-sm bg-background"
                    rows={3}
                  />
                  <Button className="w-full mt-2" onClick={generateImage} disabled={isLoading}>
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <ImageIcon className="h-4 w-4 mr-2" />
                    )}
                    Generate Image
                  </Button>
                </CardContent>
              </Card>
              
              {generatedImage && (
                <Card>
                  <CardContent className="p-3">
                    <img src={generatedImage} alt={imagePrompt} className="rounded-md w-full" />
                    <Button className="w-full mt-3" onClick={() => {
                      if (selectedElement?.type === 'image') {
                        updateElement(selectedElement.id, { props: { ...selectedElement.props, src: generatedImage } })
                      }
                    }}>
                      Use This Image
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
