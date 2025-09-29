'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, Circle, ArrowRight, ArrowLeft, Sparkles, Globe, Palette, Target } from 'lucide-react'

interface Language {
  value: string
  label: string
  nativeLabel: string
}

interface SiteGoal {
  value: string
  label: string
  description: string
}

interface BrandTone {
  value: string
  label: string
  description: string
}

interface OnboardingData {
  businessName: string
  businessDescription: string
  targetAudience: string
  siteGoals: string[]
  brandTone: string
  brandColors: {
    primary: string
    secondary: string
    accent: string
  }
  keywords: string[]
  preferredLanguage: string
  additionalNotes: string
}

interface AIRecommendation {
  type: 'layout' | 'content' | 'design' | 'seo' | 'features'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  implementation: string
  estimatedTime: string
  benefits: string[]
}

interface OnboardingChecklist {
  completed: boolean
  steps: Array<{
    id: string
    title: string
    description: string
    completed: boolean
    required: boolean
    estimatedTime: string
  }>
}

export function AIOnboardingWizard({ userId, onComplete }: { userId: string; onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [languages, setLanguages] = useState<Language[]>([])
  const [siteGoals, setSiteGoals] = useState<SiteGoal[]>([])
  const [brandTones, setBrandTones] = useState<BrandTone[]>([])
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [checklist, setChecklist] = useState<OnboardingChecklist | null>(null)
  const [profileId, setProfileId] = useState<string | null>(null)

  const [formData, setFormData] = useState<OnboardingData>({
    businessName: '',
    businessDescription: '',
    targetAudience: '',
    siteGoals: [],
    brandTone: '',
    brandColors: {
      primary: '#1e40af',
      secondary: '#64748b',
      accent: '#f59e0b'
    },
    keywords: [],
    additionalNotes: '',
    preferredLanguage: 'ENGLISH'
  })

  const steps = [
    { id: 'welcome', title: 'Welcome', description: 'Let\'s get started with your AI-powered website' },
    { id: 'business', title: 'Business Info', description: 'Tell us about your business' },
    { id: 'goals', title: 'Site Goals', description: 'What do you want to achieve?' },
    { id: 'branding', title: 'Branding', description: 'Define your brand identity' },
    { id: 'language', title: 'Language', description: 'Choose your preferred language' },
    { id: 'recommendations', title: 'AI Recommendations', description: 'Get personalized suggestions' },
    { id: 'checklist', title: 'Next Steps', description: 'Your personalized roadmap' }
  ]

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      // Use hardcoded data for now since API endpoints are not working
      const languagesData = [
        { value: 'ENGLISH', label: 'English', nativeLabel: 'English' },
        { value: 'URDU', label: 'Urdu', nativeLabel: 'اردو' },
        { value: 'PUNJABI', label: 'Punjabi', nativeLabel: 'پنجابی' },
        { value: 'SINDHI', label: 'Sindhi', nativeLabel: 'سنڌي' },
        { value: 'PASHTO', label: 'Pashto', nativeLabel: 'پښتو' }
      ]

      const siteGoalsData = [
        { value: 'ecommerce', label: 'E-commerce Store', description: 'Sell products online' },
        { value: 'portfolio', label: 'Portfolio', description: 'Showcase your work' },
        { value: 'blog', label: 'Blog', description: 'Share articles and content' },
        { value: 'contact', label: 'Contact Page', description: 'Get customer inquiries' },
        { value: 'services', label: 'Services', description: 'Promote your services' },
        { value: 'about', label: 'About Us', description: 'Tell your story' },
        { value: 'gallery', label: 'Gallery', description: 'Showcase images' },
        { value: 'testimonials', label: 'Testimonials', description: 'Customer reviews' },
        { value: 'social-media', label: 'Social Media', description: 'Connect with followers' },
        { value: 'community', label: 'Community', description: 'Build a community' },
        { value: 'lead-generation', label: 'Lead Generation', description: 'Capture leads' },
        { value: 'online-store', label: 'Online Store', description: 'Complete online store' }
      ]

      const brandTonesData = [
        { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
        { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
        { value: 'modern', label: 'Modern', description: 'Contemporary and trendy' },
        { value: 'traditional', label: 'Traditional', description: 'Classic and timeless' },
        { value: 'creative', label: 'Creative', description: 'Artistic and innovative' },
        { value: 'casual', label: 'Casual', description: 'Relaxed and informal' },
        { value: 'luxury', label: 'Luxury', description: 'Premium and exclusive' },
        { value: 'minimalist', label: 'Minimalist', description: 'Clean and simple' }
      ]

      setLanguages(languagesData)
      setSiteGoals(siteGoalsData)
      setBrandTones(brandTonesData)
    } catch (error) {
      console.error('Failed to load initial data:', error)
    }
  }

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      await handleComplete()
      return
    }

    if (currentStep === 5) { // After language selection, generate recommendations
      await generateRecommendations()
    }

    setCurrentStep(prev => prev + 1)
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }

  const generateRecommendations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/v1/ai-onboarding/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...formData
        })
      })

      const result = await response.json()
      if (result.success) {
        setProfileId(result.data.id)
        setRecommendations(result.data.aiRecommendations || [])
      }
    } catch (error) {
      console.error('Failed to generate recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadChecklist = async () => {
    if (!profileId) return

    try {
      const response = await fetch(`/api/v1/ai-onboarding/checklist/${userId}`)
      const result = await response.json()
      if (result.success) {
        setChecklist(result.data)
      }
    } catch (error) {
      console.error('Failed to load checklist:', error)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      await loadChecklist()
      onComplete()
    } catch (error) {
      console.error('Failed to complete onboarding:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleSiteGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      siteGoals: prev.siteGoals.includes(goal)
        ? prev.siteGoals.filter(g => g !== goal)
        : [...prev.siteGoals, goal]
    }))
  }

  const addKeyword = (keyword: string) => {
    if (keyword.trim() && !formData.keywords.includes(keyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword.trim()]
      }))
    }
  }

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to AI-Powered Website Builder</h2>
              <p className="text-gray-600 mt-2">
                Let's create a stunning website tailored specifically for your Pakistani business. 
                Our AI will guide you through every step.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 bg-blue-50 rounded-lg">
                <Globe className="w-6 h-6 text-blue-600 mb-2" />
                <h3 className="font-semibold">Localized for Pakistan</h3>
                <p className="text-sm text-gray-600">Support for Urdu, Punjabi, and local payment methods</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <Sparkles className="w-6 h-6 text-green-600 mb-2" />
                <h3 className="font-semibold">AI-Powered</h3>
                <p className="text-sm text-gray-600">Smart recommendations and automated content generation</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <Target className="w-6 h-6 text-purple-600 mb-2" />
                <h3 className="font-semibold">Goal-Oriented</h3>
                <p className="text-sm text-gray-600">Designed to help you achieve your business objectives</p>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => updateFormData('businessName', e.target.value)}
                placeholder="Enter your business name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="businessDescription">Business Description</Label>
              <Textarea
                id="businessDescription"
                value={formData.businessDescription}
                onChange={(e) => updateFormData('businessDescription', e.target.value)}
                placeholder="Describe what your business does..."
                className="mt-1"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                value={formData.targetAudience}
                onChange={(e) => updateFormData('targetAudience', e.target.value)}
                placeholder="Who are your ideal customers?"
                className="mt-1"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label>What do you want to achieve with your website? *</Label>
              <p className="text-sm text-gray-600 mt-1">Select all that apply</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {siteGoals.map((goal) => (
                  <div
                    key={goal.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.siteGoals.includes(goal.value)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleSiteGoal(goal.value)}
                  >
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={formData.siteGoals.includes(goal.value)}
                        onChange={() => toggleSiteGoal(goal.value)}
                      />
                      <div>
                        <h3 className="font-medium">{goal.label}</h3>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>Brand Tone</Label>
              <Select value={formData.brandTone} onValueChange={(value) => updateFormData('brandTone', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your brand tone" />
                </SelectTrigger>
                <SelectContent>
                  {brandTones.map((tone) => (
                    <SelectItem key={tone.value} value={tone.value}>
                      <div>
                        <div className="font-medium">{tone.label}</div>
                        <div className="text-sm text-gray-600">{tone.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Brand Colors</Label>
              <div className="grid grid-cols-3 gap-4 mt-3">
                <div>
                  <Label htmlFor="primaryColor" className="text-sm">Primary</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      type="color"
                      id="primaryColor"
                      value={formData.brandColors.primary}
                      onChange={(e) => updateFormData('brandColors', { ...formData.brandColors, primary: e.target.value })}
                      className="w-8 h-8 rounded border"
                    />
                    <Input
                      value={formData.brandColors.primary}
                      onChange={(e) => updateFormData('brandColors', { ...formData.brandColors, primary: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor" className="text-sm">Secondary</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      type="color"
                      id="secondaryColor"
                      value={formData.brandColors.secondary}
                      onChange={(e) => updateFormData('brandColors', { ...formData.brandColors, secondary: e.target.value })}
                      className="w-8 h-8 rounded border"
                    />
                    <Input
                      value={formData.brandColors.secondary}
                      onChange={(e) => updateFormData('brandColors', { ...formData.brandColors, secondary: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accentColor" className="text-sm">Accent</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      type="color"
                      id="accentColor"
                      value={formData.brandColors.accent}
                      onChange={(e) => updateFormData('brandColors', { ...formData.brandColors, accent: e.target.value })}
                      className="w-8 h-8 rounded border"
                    />
                    <Input
                      value={formData.brandColors.accent}
                      onChange={(e) => updateFormData('brandColors', { ...formData.brandColors, accent: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Label>Keywords</Label>
              <p className="text-sm text-gray-600 mt-1">Add keywords that describe your business</p>
              <div className="flex space-x-2 mt-2">
                <Input
                  placeholder="Add keyword..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addKeyword(e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Add keyword..."]') as HTMLInputElement
                    if (input?.value) {
                      addKeyword(input.value)
                      input.value = ''
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="flex items-center space-x-1">
                    <span>{keyword}</span>
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label>Preferred Language *</Label>
              <p className="text-sm text-gray-600 mt-1">Choose the primary language for your website</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {languages.map((language) => (
                  <div
                    key={language.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.preferredLanguage === language.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateFormData('preferredLanguage', language.value)}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        checked={formData.preferredLanguage === language.value}
                        onChange={() => updateFormData('preferredLanguage', language.value)}
                        className="text-blue-600"
                      />
                      <div>
                        <h3 className="font-medium">{language.label}</h3>
                        <p className="text-sm text-gray-600">{language.nativeLabel}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                value={formData.additionalNotes}
                onChange={(e) => updateFormData('additionalNotes', e.target.value)}
                placeholder="Any specific requirements or preferences..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>Generating AI recommendations...</p>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-4">AI Recommendations</h3>
                  <p className="text-gray-600 mb-6">
                    Based on your profile, here are personalized recommendations for your website:
                  </p>
                </div>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <Card key={index} className={`border-l-4 ${
                      rec.priority === 'high' ? 'border-l-red-500' :
                      rec.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{rec.title}</CardTitle>
                          <Badge variant={
                            rec.priority === 'high' ? 'destructive' :
                            rec.priority === 'medium' ? 'default' : 'secondary'
                          }>
                            {rec.priority}
                          </Badge>
                        </div>
                        <CardDescription>{rec.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div>
                            <strong>Implementation:</strong> {rec.implementation}
                          </div>
                          <div>
                            <strong>Estimated Time:</strong> {rec.estimatedTime}
                          </div>
                          <div>
                            <strong>Benefits:</strong>
                            <ul className="list-disc list-inside mt-1">
                              {rec.benefits.map((benefit, i) => (
                                <li key={i} className="text-sm text-gray-600">{benefit}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Your Personalized Roadmap</h3>
              <p className="text-gray-600 mb-6">
                Here's your step-by-step guide to building your website:
              </p>
            </div>
            {checklist && (
              <div className="space-y-3">
                {checklist.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-4 border rounded-lg ${
                      step.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {step.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{step.title}</h4>
                        <p className="text-sm text-gray-600">{step.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {step.required ? 'Required' : 'Optional'} • {step.estimatedTime}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                Great! Your AI profile is complete. You can now start building your website with personalized recommendations.
              </AlertDescription>
            </Alert>
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true
      case 1:
        return formData.businessName.trim() !== ''
      case 2:
        return formData.siteGoals.length > 0
      case 3:
        return true
      case 4:
        return formData.preferredLanguage !== ''
      case 5:
        return !isLoading
      case 6:
        return true
      default:
        return false
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          <Progress value={(currentStep + 1) / steps.length * 100} className="mt-4" />
        </CardHeader>
        <CardContent>
          {renderStepContent()}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4 mr-2" />
              )}
              {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
