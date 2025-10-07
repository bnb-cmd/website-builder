import React, { useState } from 'react'
import { useRouter } from '../lib/router'
import { useAuthStore, useWebsiteStore } from '../lib/store'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'
import { Checkbox } from '../components/ui/checkbox'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'
// Using alert for notifications instead of toast to avoid import issues
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Globe, 
  Store, 
  Utensils,
  Briefcase,
  Heart,
  GraduationCap,
  Car,
  Home,
  Gamepad,
  Palette,
  CheckCircle,
  Loader2,
  Zap
} from 'lucide-react'

interface BusinessInfo {
  name: string
  description: string
  industry: string
  target_audience: string
  goals: string[]
  style_preference: string
  features: string[]
  contact_info: {
    phone?: string
    email?: string
    address?: string
  }
}

const industries = [
  { id: 'business', name: 'Business & Services', icon: Briefcase, color: 'bg-blue-500' },
  { id: 'ecommerce', name: 'E-commerce & Retail', icon: Store, color: 'bg-green-500' },
  { id: 'restaurant', name: 'Restaurant & Food', icon: Utensils, color: 'bg-orange-500' },
  { id: 'healthcare', name: 'Healthcare & Medical', icon: Heart, color: 'bg-red-500' },
  { id: 'education', name: 'Education & Training', icon: GraduationCap, color: 'bg-purple-500' },
  { id: 'automotive', name: 'Automotive', icon: Car, color: 'bg-gray-600' },
  { id: 'realestate', name: 'Real Estate', icon: Home, color: 'bg-yellow-600' },
  { id: 'entertainment', name: 'Entertainment', icon: Gamepad, color: 'bg-pink-500' },
  { id: 'creative', name: 'Creative & Design', icon: Palette, color: 'bg-indigo-500' },
  { id: 'other', name: 'Other', icon: Globe, color: 'bg-slate-500' }
]

const stylePreferences = [
  { id: 'modern', name: 'Modern & Minimal', description: 'Clean lines, lots of white space' },
  { id: 'professional', name: 'Professional & Corporate', description: 'Trustworthy, established look' },
  { id: 'creative', name: 'Creative & Artistic', description: 'Bold colors, unique layouts' },
  { id: 'traditional', name: 'Traditional & Classic', description: 'Timeless, conventional design' }
]

const commonGoals = [
  'Increase online presence',
  'Generate more leads',
  'Sell products online',
  'Showcase portfolio',
  'Provide information',
  'Build brand awareness',
  'Accept online bookings',
  'Collect customer feedback'
]

const commonFeatures = [
  'Contact form',
  'Online booking',
  'E-commerce store',
  'Photo gallery',
  'Blog/News section',
  'Social media integration',
  'Customer testimonials',
  'Live chat support',
  'Multi-language support',
  'Payment integration'
]

export const OnboardingPage: React.FC = () => {
  const { navigate } = useRouter()
  const { user } = useAuthStore()
  const { createWebsite } = useWebsiteStore()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: '',
    description: '',
    industry: '',
    target_audience: '',
    goals: [],
    style_preference: '',
    features: [],
    contact_info: {}
  })

  const totalSteps = 6
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleGoalToggle = (goal: string) => {
    setBusinessInfo(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }))
  }

  const handleFeatureToggle = (feature: string) => {
    setBusinessInfo(prev => ({
      ...prev,
      features: prev.features.includes(feature) 
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const generateWebsite = async () => {
    if (!user) {
      alert('Please log in to continue')
      navigate('/login')
      return
    }

    setIsGenerating(true)
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Create website based on AI analysis
      const websiteData = {
        name: businessInfo.name || 'My Website',
        template: `ai-generated-${businessInfo.industry}`,
        status: 'draft' as const,
        settings: {
          language: 'en' as const,
          rtl: false,
          theme: {
            primaryColor: getThemeColor(businessInfo.style_preference),
            secondaryColor: '#e9ebef',
            fontFamily: 'Inter'
          },
          integrations: {
            ecommerce: businessInfo.features.includes('E-commerce store'),
            payments: {
              jazzcash: businessInfo.features.includes('Payment integration'),
              easypaisa: businessInfo.features.includes('Payment integration'),
              stripe: false
            }
          }
        }
      }

      const newWebsite = await createWebsite(websiteData)
      
      alert('🎉 Your website has been generated successfully!')
      navigate(`/dashboard/websites/${newWebsite.id}/edit`)
      
    } catch (error) {
      alert('Failed to generate website. Please try again.')
      console.error('Website generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getThemeColor = (style: string) => {
    switch (style) {
      case 'modern': return '#030213'
      case 'professional': return '#1e40af'
      case 'creative': return '#7c3aed'
      case 'traditional': return '#059669'
      default: return '#030213'
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return businessInfo.name.trim() !== ''
      case 2: return businessInfo.industry !== ''
      case 3: return businessInfo.description.trim() !== ''
      case 4: return businessInfo.goals.length > 0
      case 5: return businessInfo.style_preference !== ''
      case 6: return true
      default: return false
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please log in to use the AI Website Builder</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button onClick={() => navigate('/login')}>Go to Login</Button>
            <Button variant="outline" onClick={() => navigate('/register')}>Create Account</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900/10 dark:to-slate-900" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-primary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-secondary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000" />
      
      {/* Header */}
      <div className="border-b glass-effect backdrop-blur-md sticky top-0 z-40 border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="glass-effect">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">AI Website Builder</span>
              </div>
            </div>
            <Badge className="gradient-accent text-white border-none shadow-lg px-4 py-2">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          <Progress value={progress} className="mt-4 h-2" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Step 1: Business Name */}
        {currentStep === 1 && (
          <Card>
            <div className="text-center py-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            <CardHeader className="text-center pt-0">
              <CardTitle className="text-2xl">What's your business name?</CardTitle>
              <CardDescription>
                Let's start with the basics. What should we call your website?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                  id="business-name"
                  placeholder="e.g., Ahmad's Electronics, Karachi Cafe, etc."
                  value={businessInfo.name}
                  onChange={(e) => setBusinessInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-2"
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleNext} disabled={!isStepValid()}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Industry Selection */}
        {currentStep === 2 && (
          <Card>
            <div className="text-center py-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
                <Briefcase className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardHeader className="text-center pt-0">
              <CardTitle className="text-2xl">What industry are you in?</CardTitle>
              <CardDescription>
                This helps us create a design that fits your business perfectly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup 
                value={businessInfo.industry} 
                onValueChange={(value) => setBusinessInfo(prev => ({ ...prev, industry: value }))}
                className="grid grid-cols-2 gap-4"
              >
                {industries.map((industry) => {
                  const Icon = industry.icon
                  return (
                    <div key={industry.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={industry.id} id={industry.id} />
                      <Label 
                        htmlFor={industry.id} 
                        className="flex items-center space-x-3 cursor-pointer flex-1 p-3 rounded-lg border hover:bg-muted/50"
                      >
                        <div className={`w-8 h-8 rounded-lg ${industry.color} flex items-center justify-center`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">{industry.name}</span>
                      </Label>
                    </div>
                  )
                })}
              </RadioGroup>
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleNext} disabled={!isStepValid()}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Business Description */}
        {currentStep === 3 && (
          <Card>
            <div className="text-center py-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6">
                <Globe className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardHeader className="text-center pt-0">
              <CardTitle className="text-2xl">Tell us about your business</CardTitle>
              <CardDescription>
                Describe what you do and who you serve. This helps our AI create relevant content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., We sell high-quality electronics and mobile phones in Karachi. We've been serving customers for 10 years with competitive prices and excellent customer service."
                  value={businessInfo.description}
                  onChange={(e) => setBusinessInfo(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-2 min-h-[120px]"
                />
              </div>
              <div>
                <Label htmlFor="target-audience">Who are your customers?</Label>
                <Input
                  id="target-audience"
                  placeholder="e.g., Young professionals, families, tech enthusiasts"
                  value={businessInfo.target_audience}
                  onChange={(e) => setBusinessInfo(prev => ({ ...prev, target_audience: e.target.value }))}
                  className="mt-2"
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleNext} disabled={!isStepValid()}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Goals */}
        {currentStep === 4 && (
          <Card>
            <div className="text-center py-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardHeader className="text-center pt-0">
              <CardTitle className="text-2xl">What are your goals?</CardTitle>
              <CardDescription>
                Select all that apply. This helps us prioritize the right features for your website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {commonGoals.map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal}
                      checked={businessInfo.goals.includes(goal)}
                      onCheckedChange={() => handleGoalToggle(goal)}
                    />
                    <Label htmlFor={goal} className="text-sm cursor-pointer">
                      {goal}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleNext} disabled={!isStepValid()}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Style Preference */}
        {currentStep === 5 && (
          <Card>
            <div className="text-center py-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mb-6">
                <Palette className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardHeader className="text-center pt-0">
              <CardTitle className="text-2xl">Choose your style</CardTitle>
              <CardDescription>
                Pick a design style that matches your brand personality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup 
                value={businessInfo.style_preference} 
                onValueChange={(value) => setBusinessInfo(prev => ({ ...prev, style_preference: value }))}
                className="space-y-4"
              >
                {stylePreferences.map((style) => (
                  <div key={style.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={style.id} id={style.id} />
                    <Label 
                      htmlFor={style.id} 
                      className="flex-1 cursor-pointer p-4 rounded-lg border hover:bg-muted/50"
                    >
                      <div className="font-medium">{style.name}</div>
                      <div className="text-sm text-muted-foreground">{style.description}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleNext} disabled={!isStepValid()}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Features & Contact */}
        {currentStep === 6 && (
          <Card>
            <div className="text-center py-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-6">
                <Zap className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardHeader className="text-center pt-0">
              <CardTitle className="text-2xl">Final touches</CardTitle>
              <CardDescription>
                Select features you'd like and add your contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Features to include:</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {commonFeatures.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={businessInfo.features.includes(feature)}
                        onCheckedChange={() => handleFeatureToggle(feature)}
                      />
                      <Label htmlFor={feature} className="text-sm cursor-pointer">
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Contact Information (Optional):</Label>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+92 300 1234567"
                      value={businessInfo.contact_info.phone || ''}
                      onChange={(e) => setBusinessInfo(prev => ({
                        ...prev,
                        contact_info: { ...prev.contact_info, phone: e.target.value }
                      }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="info@yourbusiness.com"
                      value={businessInfo.contact_info.email || ''}
                      onChange={(e) => setBusinessInfo(prev => ({
                        ...prev,
                        contact_info: { ...prev.contact_info, email: e.target.value }
                      }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={generateWebsite} disabled={isGenerating} size="lg">
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Generate My Website
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Processing Overlay */}
        {isGenerating && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardContent className="p-8 text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary-foreground animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI is working its magic ✨</h3>
                  <p className="text-muted-foreground">
                    Creating your personalized website based on your business information...
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Analyzing your business requirements</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Selecting optimal design elements</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>Generating content and layout</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}