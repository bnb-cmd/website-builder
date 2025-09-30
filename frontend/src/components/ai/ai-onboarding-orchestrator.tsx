'use client'

import React, { useState, useEffect, useCallback } from 'react'
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
import { 
  Loader2, 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Globe, 
  Palette, 
  Target,
  Brain,
  Zap,
  Users,
  TrendingUp,
  BarChart3,
  Settings,
  Lightbulb,
  Star,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  SkipForward,
  RotateCcw
} from 'lucide-react'

// AI Onboarding Orchestrator Types
interface UserProfile {
  id: string
  businessName: string
  businessType: string
  industry: string
  targetAudience: string
  businessGoals: string[]
  brandPersonality: string
  preferredStyle: string
  colorPreferences: string[]
  contentTone: string
  technicalLevel: 'beginner' | 'intermediate' | 'advanced'
  budget: 'low' | 'medium' | 'high'
  timeline: 'urgent' | 'normal' | 'flexible'
  language: string
  location: string
  competitors: string[]
  uniqueValue: string
}

interface AIRecommendation {
  id: string
  type: 'template' | 'layout' | 'content' | 'design' | 'feature' | 'seo' | 'marketing'
  title: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  confidence: number
  estimatedImpact: 'high' | 'medium' | 'low'
  estimatedTime: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  tags: string[]
  implementation: {
    steps: string[]
    resources: string[]
    tools: string[]
  }
  benefits: string[]
  alternatives: string[]
  dependencies: string[]
  aiReasoning: string
}

interface OnboardingStep {
  id: string
  title: string
  description: string
  type: 'form' | 'choice' | 'ai-analysis' | 'preview' | 'customization'
  required: boolean
  estimatedTime: string
  dependencies: string[]
  aiInsights?: string
  recommendations?: AIRecommendation[]
}

interface OnboardingJourney {
  id: string
  userId: string
  currentStep: number
  totalSteps: number
  completedSteps: string[]
  skippedSteps: string[]
  userProfile: Partial<UserProfile>
  aiRecommendations: AIRecommendation[]
  personalizedTemplates: any[]
  customizations: any[]
  progress: number
  estimatedCompletionTime: string
  difficulty: 'easy' | 'medium' | 'hard'
  aiConfidence: number
  lastUpdated: string
  status: 'active' | 'paused' | 'completed' | 'abandoned'
}

interface AIOnboardingOrchestratorProps {
  userId: string
  onComplete: (journey: OnboardingJourney) => void
  onSave: (journey: OnboardingJourney) => void
  onSkip: (stepId: string) => void
}

export function AIOnboardingOrchestrator({ 
  userId, 
  onComplete, 
  onSave, 
  onSkip 
}: AIOnboardingOrchestratorProps) {
  const [journey, setJourney] = useState<OnboardingJourney | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [aiThinking, setAiThinking] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [selectedRecommendations, setSelectedRecommendations] = useState<Set<string>>(new Set())

  // Initialize or load existing journey
  useEffect(() => {
    initializeJourney()
  }, [userId])

  const initializeJourney = async () => {
    setIsLoading(true)
    try {
      // Check if user has existing journey
      const existingJourney = await loadExistingJourney(userId)
      
      if (existingJourney) {
        setJourney(existingJourney)
        setCurrentStep(existingJourney.currentStep)
      } else {
        // Create new journey
        const newJourney = await createNewJourney(userId)
        setJourney(newJourney)
        setCurrentStep(0)
      }
    } catch (error) {
      console.error('Failed to initialize journey:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadExistingJourney = async (userId: string): Promise<OnboardingJourney | null> => {
    // Mock implementation - replace with actual API call
    return null
  }

  const createNewJourney = async (userId: string): Promise<OnboardingJourney> => {
    // Mock implementation - replace with actual API call
    return {
      id: `journey-${Date.now()}`,
      userId,
      currentStep: 0,
      totalSteps: 8,
      completedSteps: [],
      skippedSteps: [],
      userProfile: {},
      aiRecommendations: [],
      personalizedTemplates: [],
      customizations: [],
      progress: 0,
      estimatedCompletionTime: '15-20 minutes',
      difficulty: 'medium',
      aiConfidence: 0.85,
      lastUpdated: new Date().toISOString(),
      status: 'active'
    }
  }

  const generateAIRecommendations = async (profile: Partial<UserProfile>) => {
    setAiThinking(true)
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const recommendations: AIRecommendation[] = [
        {
          id: 'rec-1',
          type: 'template',
          title: 'Modern Business Template',
          description: 'Perfect for professional services with clean design',
          priority: 'high',
          confidence: 0.92,
          estimatedImpact: 'high',
          estimatedTime: '5 minutes',
          difficulty: 'easy',
          category: 'Business',
          tags: ['professional', 'clean', 'modern'],
          implementation: {
            steps: ['Select template', 'Customize colors', 'Add content'],
            resources: ['Template library', 'Color picker'],
            tools: ['Drag & drop editor']
          },
          benefits: ['Professional appearance', 'Mobile responsive', 'SEO optimized'],
          alternatives: ['Creative template', 'Minimalist template'],
          dependencies: ['Business information'],
          aiReasoning: 'Based on your business type and target audience, this template provides the best balance of professionalism and modern appeal.'
        },
        {
          id: 'rec-2',
          type: 'feature',
          title: 'Contact Form Integration',
          description: 'Essential for lead generation and customer inquiries',
          priority: 'critical',
          confidence: 0.88,
          estimatedImpact: 'high',
          estimatedTime: '3 minutes',
          difficulty: 'easy',
          category: 'Lead Generation',
          tags: ['contact', 'forms', 'leads'],
          implementation: {
            steps: ['Add contact form', 'Configure fields', 'Set up notifications'],
            resources: ['Form builder', 'Email templates'],
            tools: ['Form editor']
          },
          benefits: ['Lead capture', 'Customer inquiries', 'Professional communication'],
          alternatives: ['Phone number', 'Email link'],
          dependencies: ['Business contact information'],
          aiReasoning: 'Contact forms are crucial for service-based businesses to convert visitors into leads.'
        }
      ]

      if (journey) {
        setJourney({
          ...journey,
          aiRecommendations: recommendations,
          aiConfidence: 0.88
        })
      }
    } catch (error) {
      console.error('Failed to generate recommendations:', error)
    } finally {
      setAiThinking(false)
    }
  }

  const handleStepComplete = async (stepData: any) => {
    if (!journey) return

    setIsLoading(true)
    try {
      const updatedJourney = {
        ...journey,
        currentStep: currentStep + 1,
        completedSteps: [...journey.completedSteps, `step-${currentStep}`],
        userProfile: { ...journey.userProfile, ...stepData },
        progress: ((currentStep + 1) / journey.totalSteps) * 100,
        lastUpdated: new Date().toISOString()
      }

      setJourney(updatedJourney)
      await onSave(updatedJourney)

      // Generate AI recommendations after key steps
      if (currentStep === 2 || currentStep === 4) {
        await generateAIRecommendations(updatedJourney.userProfile)
        setShowRecommendations(true)
      }

      setCurrentStep(prev => prev + 1)
    } catch (error) {
      console.error('Failed to complete step:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkipStep = async (stepId: string) => {
    if (!journey) return

    const updatedJourney = {
      ...journey,
      skippedSteps: [...journey.skippedSteps, stepId],
      currentStep: currentStep + 1,
      lastUpdated: new Date().toISOString()
    }

    setJourney(updatedJourney)
    await onSkip(stepId)
    setCurrentStep(prev => prev + 1)
  }

  const handleRecommendationSelect = (recommendationId: string) => {
    setSelectedRecommendations(prev => {
      const newSet = new Set(prev)
      if (newSet.has(recommendationId)) {
        newSet.delete(recommendationId)
      } else {
        newSet.add(recommendationId)
      }
      return newSet
    })
  }

  const applySelectedRecommendations = async () => {
    if (!journey) return

    const selectedRecs = journey.aiRecommendations.filter(rec => 
      selectedRecommendations.has(rec.id)
    )

    // Apply recommendations to journey
    const updatedJourney = {
      ...journey,
      customizations: [...journey.customizations, ...selectedRecs],
      lastUpdated: new Date().toISOString()
    }

    setJourney(updatedJourney)
    await onSave(updatedJourney)
    setShowRecommendations(false)
  }

  if (isLoading || !journey) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Initializing your AI-powered journey...</p>
        </div>
      </div>
    )
  }

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to AI Website Builder',
      description: 'Let\'s create your perfect website together',
      type: 'form' as const,
      required: true,
      estimatedTime: '2 minutes'
    },
    {
      id: 'business-info',
      title: 'Tell us about your business',
      description: 'Help us understand your business better',
      type: 'form' as const,
      required: true,
      estimatedTime: '3 minutes'
    },
    {
      id: 'goals-preferences',
      title: 'Your goals and preferences',
      description: 'What do you want to achieve?',
      type: 'choice' as const,
      required: true,
      estimatedTime: '2 minutes'
    },
    {
      id: 'ai-analysis',
      title: 'AI Analysis',
      description: 'Our AI is analyzing your requirements',
      type: 'ai-analysis' as const,
      required: false,
      estimatedTime: '1 minute'
    },
    {
      id: 'template-selection',
      title: 'Choose your template',
      description: 'Select from AI-recommended templates',
      type: 'choice' as const,
      required: true,
      estimatedTime: '3 minutes'
    },
    {
      id: 'customization',
      title: 'Customize your design',
      description: 'Make it uniquely yours',
      type: 'customization' as const,
      required: false,
      estimatedTime: '5 minutes'
    },
    {
      id: 'content-setup',
      title: 'Add your content',
      description: 'Fill in your business information',
      type: 'form' as const,
      required: true,
      estimatedTime: '4 minutes'
    },
    {
      id: 'final-review',
      title: 'Review and launch',
      description: 'Final check before going live',
      type: 'preview' as const,
      required: true,
      estimatedTime: '2 minutes'
    }
  ]

  const currentStepData = steps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI-Powered Website Builder
          </h1>
          <p className="text-gray-600">
            Let our AI create the perfect website for your business
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {currentStepData.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentStepData.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  Step {currentStep + 1} of {journey.totalSteps}
                </div>
                <div className="text-xs text-gray-400">
                  {currentStepData.estimatedTime}
                </div>
              </div>
            </div>
            <Progress value={journey.progress} className="h-2" />
          </CardContent>
        </Card>

        {/* AI Recommendations Panel */}
        {showRecommendations && journey.aiRecommendations.length > 0 && (
          <Card className="mb-8 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg text-blue-900">
                    AI Recommendations
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {journey.aiConfidence * 100}% confidence
                </Badge>
              </div>
              <CardDescription className="text-blue-700">
                Based on your profile, here are personalized recommendations:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {journey.aiRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedRecommendations.has(rec.id)
                        ? 'border-blue-500 bg-blue-100'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleRecommendationSelect(rec.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                          <Badge variant={
                            rec.priority === 'critical' ? 'destructive' :
                            rec.priority === 'high' ? 'default' : 'secondary'
                          }>
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {rec.estimatedTime}
                          </span>
                          <span className="flex items-center">
                            <Award className="w-3 h-3 mr-1" />
                            {rec.difficulty}
                          </span>
                          <span className="flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {rec.estimatedImpact} impact
                          </span>
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedRecommendations.has(rec.id)}
                        onChange={() => handleRecommendationSelect(rec.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setShowRecommendations(false)}>
                  Skip for now
                </Button>
                <Button onClick={applySelectedRecommendations}>
                  Apply Selected ({selectedRecommendations.size})
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Thinking Indicator */}
        {aiThinking && (
          <Card className="mb-8 border-purple-200 bg-purple-50/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                <div>
                  <h4 className="font-semibold text-purple-900">AI is thinking...</h4>
                  <p className="text-sm text-purple-700">
                    Analyzing your preferences and generating personalized recommendations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step Content */}
        <Card>
          <CardContent className="p-8">
            {renderStepContent(currentStepData, journey, handleStepComplete, handleSkipStep)}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Step content renderer
function renderStepContent(
  step: any, 
  journey: OnboardingJourney, 
  onComplete: (data: any) => void, 
  onSkip: (stepId: string) => void
) {
  switch (step.id) {
    case 'welcome':
      return <WelcomeStep onComplete={onComplete} />
    case 'business-info':
      return <BusinessInfoStep onComplete={onComplete} />
    case 'goals-preferences':
      return <GoalsPreferencesStep onComplete={onComplete} />
    case 'ai-analysis':
      return <AIAnalysisStep onComplete={onComplete} />
    case 'template-selection':
      return <TemplateSelectionStep onComplete={onComplete} />
    case 'customization':
      return <CustomizationStep onComplete={onComplete} />
    case 'content-setup':
      return <ContentSetupStep onComplete={onComplete} />
    case 'final-review':
      return <FinalReviewStep onComplete={onComplete} />
    default:
      return <div>Step not implemented</div>
  }
}

// Individual step components
function WelcomeStep({ onComplete }: { onComplete: (data: any) => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to Your AI Website Builder
        </h2>
        <p className="text-gray-600">
          We'll create a stunning website tailored specifically for your business. 
          Our AI will guide you through every step.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div className="p-4 bg-blue-50 rounded-lg">
          <Brain className="w-6 h-6 text-blue-600 mb-2" />
          <h3 className="font-semibold">AI-Powered</h3>
          <p className="text-sm text-gray-600">Smart recommendations and automated content generation</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <Zap className="w-6 h-6 text-green-600 mb-2" />
          <h3 className="font-semibold">Fast & Easy</h3>
          <p className="text-sm text-gray-600">Create professional websites in minutes, not hours</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <Target className="w-6 h-6 text-purple-600 mb-2" />
          <h3 className="font-semibold">Goal-Oriented</h3>
          <p className="text-sm text-gray-600">Designed to help you achieve your business objectives</p>
        </div>
      </div>
      <Button onClick={() => onComplete({})} size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600">
        Let's Get Started
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}

function BusinessInfoStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    industry: '',
    targetAudience: '',
    uniqueValue: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="businessName">Business Name *</Label>
        <Input
          id="businessName"
          value={formData.businessName}
          onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
          placeholder="Enter your business name"
          className="mt-1"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="businessType">Business Type</Label>
        <Select value={formData.businessType} onValueChange={(value) => setFormData(prev => ({ ...prev, businessType: value }))}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select business type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="service">Service Business</SelectItem>
            <SelectItem value="ecommerce">E-commerce Store</SelectItem>
            <SelectItem value="restaurant">Restaurant</SelectItem>
            <SelectItem value="consulting">Consulting</SelectItem>
            <SelectItem value="nonprofit">Non-profit</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="industry">Industry</Label>
        <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="food">Food & Beverage</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="targetAudience">Target Audience</Label>
        <Textarea
          id="targetAudience"
          value={formData.targetAudience}
          onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
          placeholder="Describe your ideal customers..."
          className="mt-1"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="uniqueValue">What makes you unique?</Label>
        <Textarea
          id="uniqueValue"
          value={formData.uniqueValue}
          onChange={(e) => setFormData(prev => ({ ...prev, uniqueValue: e.target.value }))}
          placeholder="What sets your business apart from competitors?"
          className="mt-1"
          rows={3}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={!formData.businessName}>
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  )
}

function GoalsPreferencesStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [goals, setGoals] = useState<string[]>([])
  const [preferences, setPreferences] = useState({
    style: '',
    colorScheme: '',
    technicalLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced'
  })

  const businessGoals = [
    { id: 'increase-sales', label: 'Increase Sales', description: 'Drive more revenue' },
    { id: 'build-brand', label: 'Build Brand Awareness', description: 'Get your name out there' },
    { id: 'generate-leads', label: 'Generate Leads', description: 'Capture potential customers' },
    { id: 'showcase-work', label: 'Showcase Work', description: 'Display your portfolio' },
    { id: 'provide-info', label: 'Provide Information', description: 'Share business details' },
    { id: 'build-community', label: 'Build Community', description: 'Connect with customers' }
  ]

  const toggleGoal = (goalId: string) => {
    setGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete({ goals, preferences })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>What are your main business goals? *</Label>
        <p className="text-sm text-gray-600 mt-1">Select all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {businessGoals.map((goal) => (
            <div
              key={goal.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                goals.includes(goal.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleGoal(goal.id)}
            >
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={goals.includes(goal.id)}
                  onChange={() => toggleGoal(goal.id)}
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

      <div>
        <Label>Preferred Style</Label>
        <Select value={preferences.style} onValueChange={(value) => setPreferences(prev => ({ ...prev, style: value }))}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select your preferred style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="modern">Modern & Clean</SelectItem>
            <SelectItem value="classic">Classic & Professional</SelectItem>
            <SelectItem value="creative">Creative & Bold</SelectItem>
            <SelectItem value="minimalist">Minimalist</SelectItem>
            <SelectItem value="vintage">Vintage & Retro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Technical Comfort Level</Label>
        <Select value={preferences.technicalLevel} onValueChange={(value: any) => setPreferences(prev => ({ ...prev, technicalLevel: value }))}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select your technical level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner - I prefer simple tools</SelectItem>
            <SelectItem value="intermediate">Intermediate - I can handle some complexity</SelectItem>
            <SelectItem value="advanced">Advanced - I want full control</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={goals.length === 0}>
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  )
}

function AIAnalysisStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [analysisComplete, setAnalysisComplete] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnalysisComplete(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (analysisComplete) {
      setTimeout(() => onComplete({}), 1000)
    }
  }, [analysisComplete, onComplete])

  return (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
        <Brain className="w-8 h-8 text-white animate-pulse" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          AI is Analyzing Your Profile
        </h2>
        <p className="text-gray-600">
          Our AI is processing your information to create personalized recommendations
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-blue-800">Analyzing business requirements</span>
        </div>
        <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-800">Matching with industry best practices</span>
        </div>
        <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
          <CheckCircle className="w-5 h-5 text-purple-600" />
          <span className="text-sm text-purple-800">Generating personalized recommendations</span>
        </div>
      </div>

      {analysisComplete && (
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Analysis Complete!</span>
          </div>
        </div>
      )}
    </div>
  )
}

function TemplateSelectionStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [selectedTemplate, setSelectedTemplate] = useState('')

  const templates = [
    {
      id: 'modern-business',
      name: 'Modern Business',
      description: 'Clean and professional design',
      category: 'Business',
      preview: '/api/placeholder/300/200'
    },
    {
      id: 'creative-portfolio',
      name: 'Creative Portfolio',
      description: 'Bold and artistic layout',
      category: 'Portfolio',
      preview: '/api/placeholder/300/200'
    },
    {
      id: 'ecommerce-store',
      name: 'E-commerce Store',
      description: 'Optimized for online sales',
      category: 'E-commerce',
      preview: '/api/placeholder/300/200'
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete({ selectedTemplate })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Choose Your Template *</Label>
        <p className="text-sm text-gray-600 mt-1">Select the template that best fits your business</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                <Globe className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold">{template.name}</h3>
              <p className="text-sm text-gray-600">{template.description}</p>
              <Badge variant="secondary" className="mt-2">
                {template.category}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={!selectedTemplate}>
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  )
}

function CustomizationStep({ onComplete }: { onComplete: (data: any) => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
        <Palette className="w-8 h-8 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Customize Your Design
        </h2>
        <p className="text-gray-600">
          You can customize colors, fonts, and layout after creating your website
        </p>
      </div>
      <Button onClick={() => onComplete({})} size="lg">
        Skip Customization
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}

function ContentSetupStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [content, setContent] = useState({
    headline: '',
    description: '',
    contactEmail: '',
    phone: '',
    address: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(content)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="headline">Main Headline *</Label>
        <Input
          id="headline"
          value={content.headline}
          onChange={(e) => setContent(prev => ({ ...prev, headline: e.target.value }))}
          placeholder="Enter your main headline"
          className="mt-1"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Business Description</Label>
        <Textarea
          id="description"
          value={content.description}
          onChange={(e) => setContent(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe what your business does..."
          className="mt-1"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            id="contactEmail"
            type="email"
            value={content.contactEmail}
            onChange={(e) => setContent(prev => ({ ...prev, contactEmail: e.target.value }))}
            placeholder="your@email.com"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={content.phone}
            onChange={(e) => setContent(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="+1 (555) 123-4567"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Business Address</Label>
        <Textarea
          id="address"
          value={content.address}
          onChange={(e) => setContent(prev => ({ ...prev, address: e.target.value }))}
          placeholder="Enter your business address"
          className="mt-1"
          rows={2}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={!content.headline}>
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  )
}

function FinalReviewStep({ onComplete }: { onComplete: (data: any) => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Ready to Launch!
        </h2>
        <p className="text-gray-600">
          Your website is ready. You can always make changes later.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div className="p-4 bg-green-50 rounded-lg">
          <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
          <h3 className="font-semibold">Template Selected</h3>
          <p className="text-sm text-gray-600">Your design is ready</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <CheckCircle className="w-6 h-6 text-blue-600 mb-2" />
          <h3 className="font-semibold">Content Added</h3>
          <p className="text-sm text-gray-600">Your information is in place</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <CheckCircle className="w-6 h-6 text-purple-600 mb-2" />
          <h3 className="font-semibold">AI Optimized</h3>
          <p className="text-sm text-gray-600">Best practices applied</p>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Button variant="outline" size="lg">
          Preview Website
        </Button>
        <Button onClick={() => onComplete({})} size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600">
          Launch Website
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}