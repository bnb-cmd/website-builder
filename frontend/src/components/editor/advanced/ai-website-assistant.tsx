'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Sparkles, 
  MessageSquare, 
  Palette, 
  Layout, 
  Type, 
  Image, 
  Zap,
  Globe,
  Target,
  Briefcase,
  Send,
  Loader2,
  Check,
  X,
  Wand2,
  Brain,
  Lightbulb,
  Mic,
  Camera,
  FileText,
  Star
} from 'lucide-react'
import { apiHelpers } from '@/lib/api'
import { useWebsiteStore } from '@/store/website-store'
import toast from 'react-hot-toast'

interface AIAssistantProps {
  onSuggestion?: (suggestion: any) => void
  websiteId?: string
}

interface AISuggestion {
  id: string
  type: 'layout' | 'content' | 'color' | 'component' | 'seo' | 'performance'
  title: string
  description: string
  preview?: string
  confidence: number
  action: () => void
}

export function AIWebsiteAssistant({ onSuggestion, websiteId }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('chat')
  const [isGenerating, setIsGenerating] = useState(false)
  const [buildProgress, setBuildProgress] = useState(0)
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [chatMessages, setChatMessages] = useState<Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>>([])
  const [userInput, setUserInput] = useState('')
  const [businessInfo, setBusinessInfo] = useState({
    type: '',
    name: '',
    description: '',
    targetAudience: '',
    style: '',
    features: [] as string[]
  })
  
  const { addElement, updateTheme, elements } = useWebsiteStore()

  // Business types for Pakistani market
  const businessTypes = [
    { value: 'restaurant', label: 'Restaurant & Food', icon: '🍽️' },
    { value: 'retail', label: 'Retail Store', icon: '🛍️' },
    { value: 'service', label: 'Service Business', icon: '💼' },
    { value: 'education', label: 'Education', icon: '🎓' },
    { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
    { value: 'realestate', label: 'Real Estate', icon: '🏠' },
    { value: 'technology', label: 'Technology', icon: '💻' },
    { value: 'creative', label: 'Creative & Arts', icon: '🎨' },
    { value: 'nonprofit', label: 'Non-Profit', icon: '❤️' },
    { value: 'personal', label: 'Personal/Portfolio', icon: '👤' }
  ]

  const designStyles = [
    { value: 'modern', label: 'Modern & Minimal' },
    { value: 'professional', label: 'Professional & Corporate' },
    { value: 'creative', label: 'Creative & Bold' },
    { value: 'elegant', label: 'Elegant & Sophisticated' },
    { value: 'friendly', label: 'Friendly & Approachable' },
    { value: 'traditional', label: 'Traditional & Classic' }
  ]

  const handleAIBuildWebsite = async () => {
    if (!businessInfo.type || !businessInfo.name) {
      toast.error('Please provide business type and name')
      return
    }

    setIsGenerating(true)
    setBuildProgress(0)

    try {
      // Step 1: Generate website structure
      setBuildProgress(10)
      const structureResponse = await apiHelpers.generateContent({
        prompt: `Create a website structure for a ${businessInfo.type} business named "${businessInfo.name}". 
                 Description: ${businessInfo.description}. 
                 Target audience: ${businessInfo.targetAudience}.
                 Style: ${businessInfo.style}.
                 Include sections for: ${businessInfo.features.join(', ')}`,
        contentType: 'website_structure',
        language: 'ENGLISH',
        businessType: businessInfo.type.toUpperCase()
      })

      setBuildProgress(30)

      // Step 2: Generate color palette
      const colorResponse = await apiHelpers.generateColors({
        businessType: businessInfo.type.toUpperCase(),
        brandPersonality: businessInfo.style,
        language: 'ENGLISH'
      })

      setBuildProgress(50)

      // Step 3: Apply theme
      if (colorResponse.data.data) {
        updateTheme({
          colors: {
            primary: colorResponse.data.data.primary,
            secondary: colorResponse.data.data.secondary,
            accent: colorResponse.data.data.accent,
            background: '#ffffff',
            text: '#1a1a1a',
            muted: '#f5f5f5'
          }
        })
      }

      setBuildProgress(70)

      // Step 4: Generate and add sections
      const sections = await generateWebsiteSections(businessInfo)
      
      for (const section of sections) {
        addElement(section)
      }

      setBuildProgress(100)

      toast.success('Website generated successfully!')
      
      // Add AI message
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: `I've created a ${businessInfo.style} website for your ${businessInfo.type} business "${businessInfo.name}". The design includes all requested features and is optimized for your target audience.`,
        timestamp: new Date()
      }])

    } catch (error) {
      console.error('AI website generation failed:', error)
      toast.error('Failed to generate website')
    } finally {
      setIsGenerating(false)
      setBuildProgress(0)
    }
  }

  const generateWebsiteSections = async (info: typeof businessInfo) => {
    const sections = []

    // Hero Section
    sections.push({
      id: `hero-${Date.now()}`,
      type: 'hero' as const,
      props: {
        title: info.name,
        subtitle: info.description || `Welcome to ${info.name}`,
        buttonText: 'Get Started',
        backgroundImage: ''
      },
      children: [],
      style: {
        minHeight: '600px',
        textAlign: 'center',
        padding: '80px 20px'
      },
      position: { x: 0, y: 0 }
    })

    // Features Section
    if (info.features.includes('features')) {
      sections.push({
        id: `features-${Date.now()}`,
        type: 'features' as const,
        props: {
          title: 'Why Choose Us',
          subtitle: 'Discover what makes us special',
          features: generateFeatures(info.type)
        },
        children: [],
        style: {
          padding: '60px 20px'
        },
        position: { x: 0, y: 0 }
      })
    }

    // About Section
    if (info.features.includes('about')) {
      sections.push({
        id: `about-${Date.now()}`,
        type: 'container' as const,
        props: {
          layout: 'horizontal'
        },
        children: [
          {
            id: `about-text-${Date.now()}`,
            type: 'text' as const,
            props: {
              content: await generateAboutContent(info)
            },
            children: [],
            style: { padding: '20px' },
            position: { x: 0, y: 0 }
          }
        ],
        style: {
          padding: '60px 20px',
          backgroundColor: '#f8f9fa'
        },
        position: { x: 0, y: 0 }
      })
    }

    // Contact Section
    if (info.features.includes('contact')) {
      sections.push({
        id: `contact-${Date.now()}`,
        type: 'contact' as const,
        props: {
          title: 'Get In Touch',
          subtitle: 'We\'d love to hear from you'
        },
        children: [],
        style: {
          padding: '60px 20px'
        },
        position: { x: 0, y: 0 }
      })
    }

    return sections
  }

  const generateFeatures = (businessType: string): any[] => {
    const featuresByType: Record<string, any[]> = {
      restaurant: [
        { icon: 'star', title: 'Fresh Ingredients', description: 'Locally sourced, always fresh' },
        { icon: 'zap', title: 'Fast Delivery', description: '30-minute delivery guarantee' },
        { icon: 'shield', title: 'Safe & Hygienic', description: 'Following all safety protocols' }
      ],
      retail: [
        { icon: 'star', title: 'Quality Products', description: 'Curated selection of premium items' },
        { icon: 'truck', title: 'Free Shipping', description: 'On orders above Rs. 2000' },
        { icon: 'shield', title: 'Secure Payment', description: 'Multiple payment options' }
      ],
      service: [
        { icon: 'star', title: 'Expert Team', description: 'Highly skilled professionals' },
        { icon: 'clock', title: '24/7 Support', description: 'Always here to help' },
        { icon: 'shield', title: 'Guaranteed Quality', description: '100% satisfaction guarantee' }
      ]
    }

    return featuresByType[businessType] || featuresByType.service
  }

  const generateAboutContent = async (info: typeof businessInfo): Promise<string> => {
    const templates = {
      restaurant: `Welcome to ${info.name}, where culinary excellence meets warm hospitality. Our passion for food and dedication to quality has made us a favorite destination for food lovers.`,
      retail: `${info.name} is your trusted destination for quality products. We pride ourselves on offering an exceptional shopping experience with carefully curated selections.`,
      service: `At ${info.name}, we are committed to delivering exceptional ${info.type} services. Our experienced team ensures that every client receives personalized attention and outstanding results.`
    }

    return templates[info.type as keyof typeof templates] || templates.service
  }

  const handleChatSubmit = async () => {
    if (!userInput.trim()) return

    const newMessage = {
      role: 'user' as const,
      content: userInput,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, newMessage])
    setUserInput('')
    setIsGenerating(true)

    try {
      const response = await apiHelpers.generateContent({
        prompt: `Website building assistant. Current website has ${elements.length} elements. User says: "${userInput}". Provide helpful website building advice.`,
        contentType: 'assistant',
        language: 'ENGLISH'
      })

      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.data.content,
        timestamp: new Date()
      }])

      // Generate relevant suggestions based on chat
      generateSmartSuggestions(userInput)

    } catch (error) {
      console.error('Chat failed:', error)
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      }])
    } finally {
      setIsGenerating(false)
    }
  }

  const generateSmartSuggestions = (query: string) => {
    const newSuggestions: AISuggestion[] = []

    // Color suggestions
    if (query.toLowerCase().includes('color') || query.toLowerCase().includes('theme')) {
      newSuggestions.push({
        id: 'color-1',
        type: 'color',
        title: 'Update Color Scheme',
        description: 'Try a modern blue and white color scheme for a professional look',
        confidence: 0.9,
        action: () => {
          updateTheme({
            colors: {
              primary: '#0066cc',
              secondary: '#003d7a',
              accent: '#00a8ff',
              background: '#ffffff',
              text: '#1a1a1a',
              muted: '#f0f4f8'
            }
          })
          toast.success('Color scheme updated!')
        }
      })
    }

    // Layout suggestions
    if (query.toLowerCase().includes('layout') || query.toLowerCase().includes('design')) {
      newSuggestions.push({
        id: 'layout-1',
        type: 'layout',
        title: 'Add a Feature Grid',
        description: 'Showcase your key features in an attractive grid layout',
        confidence: 0.85,
        action: () => {
          addElement({
            id: `features-${Date.now()}`,
            type: 'features',
            props: {
              title: 'Our Features',
              features: []
            },
            children: [],
            style: { padding: '40px 20px' },
            position: { x: 0, y: 0 }
          })
          toast.success('Feature grid added!')
        }
      })
    }

    setSuggestions(newSuggestions)
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-[600px] z-50 shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Website Assistant</CardTitle>
              <CardDescription className="text-xs">
                I'll help you build your perfect website
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 rounded-none">
              <TabsTrigger value="build" className="text-xs">
                <Wand2 className="h-3 w-3 mr-1" />
                Build
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-xs">
                <MessageSquare className="h-3 w-3 mr-1" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="suggest" className="text-xs">
                <Lightbulb className="h-3 w-3 mr-1" />
                Suggest
              </TabsTrigger>
            </TabsList>

            {/* AI Website Builder */}
            <TabsContent value="build" className="p-4 space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Business Type</label>
                  <Select
                    value={businessInfo.type}
                    onValueChange={(value) => setBusinessInfo(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <span className="flex items-center">
                            <span className="mr-2">{type.icon}</span>
                            {type.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Business Name</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="Enter your business name"
                    value={businessInfo.name}
                    onChange={(e) => setBusinessInfo(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    className="mt-1"
                    placeholder="Briefly describe your business..."
                    value={businessInfo.description}
                    onChange={(e) => setBusinessInfo(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Design Style</label>
                  <Select
                    value={businessInfo.style}
                    onValueChange={(value) => setBusinessInfo(prev => ({ ...prev, style: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose a design style" />
                    </SelectTrigger>
                    <SelectContent>
                      {designStyles.map(style => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Features to Include</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['hero', 'about', 'features', 'gallery', 'testimonials', 'contact', 'pricing', 'blog'].map(feature => (
                      <label key={feature} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={businessInfo.features.includes(feature)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBusinessInfo(prev => ({ ...prev, features: [...prev.features, feature] }))
                            } else {
                              setBusinessInfo(prev => ({ ...prev, features: prev.features.filter(f => f !== feature) }))
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm capitalize">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Building your website...</span>
                      <span>{buildProgress}%</span>
                    </div>
                    <Progress value={buildProgress} className="h-2" />
                  </div>
                )}

                <Button
                  onClick={handleAIBuildWebsite}
                  disabled={isGenerating || !businessInfo.type || !businessInfo.name}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Building...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Website with AI
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* AI Chat Assistant */}
            <TabsContent value="chat" className="p-0">
              <div className="flex flex-col h-[400px]">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-8">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Ask me anything about building your website!</p>
                      <p className="text-xs mt-1">Try: "How can I make my site more professional?"</p>
                    </div>
                  )}
                  
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t p-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                      placeholder="Ask me anything..."
                      className="flex-1 px-3 py-2 border rounded-md text-sm"
                      disabled={isGenerating}
                    />
                    <Button
                      size="sm"
                      onClick={handleChatSubmit}
                      disabled={isGenerating || !userInput.trim()}
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* AI Suggestions */}
            <TabsContent value="suggest" className="p-4">
              <div className="space-y-3">
                {suggestions.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No suggestions yet</p>
                    <p className="text-xs mt-1">Chat with me to get personalized suggestions</p>
                  </div>
                )}

                {suggestions.map(suggestion => (
                  <div
                    key={suggestion.id}
                    className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="secondary" className="text-xs">
                            {suggestion.type}
                          </Badge>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.round(suggestion.confidence * 5)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <h4 className="font-medium text-sm">{suggestion.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {suggestion.description}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={suggestion.action}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <div className="border-t p-3">
            <div className="grid grid-cols-4 gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <Mic className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Camera className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <FileText className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Zap className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
