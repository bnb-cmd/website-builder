'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Sparkles, 
  Wand2, 
  Globe, 
  Palette, 
  Type, 
  Image, 
  Layout, 
  Zap,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react'

interface AISuggestion {
  id: string
  type: 'content' | 'design' | 'layout' | 'seo' | 'image'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  implementation: string
  estimatedTime: string
  benefits: string[]
  applied: boolean
  elementId?: string
}

interface LanguageOption {
  value: string
  label: string
  nativeLabel: string
  rtl: boolean
}

interface AIEditorPanelProps {
  websiteId: string
  currentElement?: any
  onApplySuggestion: (suggestion: AISuggestion) => void
  onGenerateContent: (type: string, language: string) => void
}

export function AIEditorPanel({ 
  websiteId, 
  currentElement, 
  onApplySuggestion, 
  onGenerateContent 
}: AIEditorPanelProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('ENGLISH')
  const [aiUsage, setAiUsage] = useState({ used: 0, remaining: 100, total: 100 })
  const [activeTab, setActiveTab] = useState('suggestions')

  const languages: LanguageOption[] = [
    { value: 'ENGLISH', label: 'English', nativeLabel: 'English', rtl: false },
    { value: 'URDU', label: 'Urdu', nativeLabel: 'اردو', rtl: true },
    { value: 'PUNJABI', label: 'Punjabi', nativeLabel: 'پنجابی', rtl: true },
    { value: 'SINDHI', label: 'Sindhi', nativeLabel: 'سنڌي', rtl: true },
    { value: 'PASHTO', label: 'Pashto', nativeLabel: 'پښتو', rtl: true }
  ]

  useEffect(() => {
    loadAISuggestions()
    loadAIUsage()
  }, [websiteId, currentElement])

  const loadAISuggestions = async () => {
    setIsLoading(true)
    try {
      // Mock suggestions - in real implementation, this would call the AI service
      const mockSuggestions: AISuggestion[] = [
        {
          id: '1',
          type: 'content',
          title: 'Urdu Content Optimization',
          description: 'Optimize your content for Urdu-speaking audience',
          priority: 'high',
          implementation: 'Add Urdu translations and RTL support',
          estimatedTime: '5 minutes',
          benefits: ['Better local engagement', 'Cultural relevance', 'Accessibility'],
          applied: false,
          elementId: currentElement?.id
        },
        {
          id: '2',
          type: 'design',
          title: 'Pakistan Color Scheme',
          description: 'Apply Pakistan-inspired color palette',
          priority: 'medium',
          implementation: 'Use green and white colors with Pakistani cultural elements',
          estimatedTime: '3 minutes',
          benefits: ['Cultural connection', 'Brand recognition', 'Local appeal'],
          applied: false,
          elementId: currentElement?.id
        },
        {
          id: '3',
          type: 'layout',
          title: 'Mobile-First Layout',
          description: 'Optimize layout for mobile devices',
          priority: 'high',
          implementation: 'Adjust spacing, font sizes, and touch targets',
          estimatedTime: '10 minutes',
          benefits: ['Better mobile experience', 'Higher conversion', 'SEO benefits'],
          applied: false,
          elementId: currentElement?.id
        },
        {
          id: '4',
          type: 'seo',
          title: 'Local SEO Optimization',
          description: 'Optimize for Pakistani search terms',
          priority: 'medium',
          implementation: 'Add local keywords and meta descriptions',
          estimatedTime: '7 minutes',
          benefits: ['Better local search visibility', 'Targeted traffic', 'Business growth'],
          applied: false,
          elementId: currentElement?.id
        }
      ]

      setSuggestions(mockSuggestions)
    } catch (error) {
      console.error('Failed to load AI suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadAIUsage = async () => {
    try {
      // Mock usage data - in real implementation, this would call the API
      setAiUsage({ used: 25, remaining: 75, total: 100 })
    } catch (error) {
      console.error('Failed to load AI usage:', error)
    }
  }

  const handleApplySuggestion = async (suggestion: AISuggestion) => {
    try {
      await onApplySuggestion(suggestion)
      
      // Update suggestion as applied
      setSuggestions(prev => 
        prev.map(s => 
          s.id === suggestion.id ? { ...s, applied: true } : s
        )
      )
    } catch (error) {
      console.error('Failed to apply suggestion:', error)
    }
  }

  const handleGenerateContent = async (type: string) => {
    try {
      await onGenerateContent(type, selectedLanguage)
    } catch (error) {
      console.error('Failed to generate content:', error)
    }
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'content':
        return <Type className="w-4 h-4" />
      case 'design':
        return <Palette className="w-4 h-4" />
      case 'layout':
        return <Layout className="w-4 h-4" />
      case 'seo':
        return <Zap className="w-4 h-4" />
      case 'image':
        return <Image className="w-4 h-4" />
      default:
        return <Sparkles className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>AI Assistant</span>
          </CardTitle>
          <CardDescription>
            Get AI-powered suggestions for your website
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* AI Usage */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>AI Usage</span>
              <span>{aiUsage.used}/{aiUsage.total} tokens</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(aiUsage.used / aiUsage.total) * 100}%` }}
              />
            </div>
            {aiUsage.remaining < 20 && (
              <p className="text-xs text-red-600 mt-1">
                Low on AI quota. Consider upgrading your plan.
              </p>
            )}
          </div>

          {/* Language Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Content Language</label>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => setSelectedLanguage(lang.value)}
                  className={`p-2 text-xs border rounded transition-colors ${
                    selectedLanguage === lang.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{lang.label}</div>
                  <div className="text-gray-600">{lang.nativeLabel}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              <TabsTrigger value="generate">Generate</TabsTrigger>
            </TabsList>

            <TabsContent value="suggestions" className="space-y-3">
              {isLoading ? (
                <div className="text-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Loading suggestions...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">AI Suggestions</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadAISuggestions}
                      disabled={isLoading}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Refresh
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className={`p-3 border rounded-lg ${
                          suggestion.applied ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getSuggestionIcon(suggestion.type)}
                            <h4 className="font-medium text-sm">{suggestion.title}</h4>
                          </div>
                          <Badge className={`text-xs ${getPriorityColor(suggestion.priority)}`}>
                            {suggestion.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-2">{suggestion.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {suggestion.estimatedTime}
                          </span>
                          {suggestion.applied && (
                            <span className="flex items-center text-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Applied
                            </span>
                          )}
                        </div>

                        {!suggestion.applied && (
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => handleApplySuggestion(suggestion)}
                          >
                            <Wand2 className="w-3 h-3 mr-1" />
                            Apply Suggestion
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="generate" className="space-y-3">
              <h3 className="font-medium">Generate Content</h3>
              
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleGenerateContent('hero')}
                >
                  <Type className="w-4 h-4 mr-2" />
                  Hero Section Text
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleGenerateContent('about')}
                >
                  <Type className="w-4 h-4 mr-2" />
                  About Us Content
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleGenerateContent('services')}
                >
                  <Type className="w-4 h-4 mr-2" />
                  Services Description
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleGenerateContent('contact')}
                >
                  <Type className="w-4 h-4 mr-2" />
                  Contact Information
                </Button>
              </div>

              <Alert>
                <Globe className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Content will be generated in {languages.find(l => l.value === selectedLanguage)?.nativeLabel} 
                  {selectedLanguage !== 'ENGLISH' && ' with RTL support'}
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <div className="pt-4 border-t">
            <h4 className="font-medium text-sm mb-2">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerateContent('optimize')}
              >
                <Zap className="w-3 h-3 mr-1" />
                Optimize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerateContent('translate')}
              >
                <Globe className="w-3 h-3 mr-1" />
                Translate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
