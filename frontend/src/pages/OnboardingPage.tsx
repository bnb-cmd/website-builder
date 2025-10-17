"use client";
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Globe, 
  Palette, 
  Target,
  Zap,
  Brain,
  Wand2
} from '@/lib/icons'

const OnboardingPage: React.FC = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    industry: '',
    targetAudience: '',
    websitePurpose: '',
    designPreferences: '',
    colorScheme: '',
    contentTone: '',
    features: [] as string[],
    budget: '',
    timeline: ''
  })

  const totalSteps = 5

  const businessTypes = [
    'Business',
    'E-commerce',
    'Restaurant',
    'Portfolio',
    'Education',
    'Medical',
    'Real Estate',
    'Events',
    'Blog',
    'Non-Profit',
    'Fitness',
    'Travel'
  ]

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Food & Beverage',
    'Real Estate',
    'Entertainment',
    'Sports',
    'Travel',
    'Automotive',
    'Fashion'
  ]

  const websitePurposes = [
    'Showcase products/services',
    'Generate leads',
    'Sell products online',
    'Share information',
    'Build brand awareness',
    'Provide customer support',
    'Create community',
    'Generate revenue'
  ]

  const designPreferences = [
    'Modern & Minimalist',
    'Professional & Corporate',
    'Creative & Artistic',
    'Bold & Vibrant',
    'Elegant & Sophisticated',
    'Friendly & Approachable',
    'Tech-focused',
    'Traditional & Classic'
  ]

  const colorSchemes = [
    'Blue & White (Professional)',
    'Green & White (Natural)',
    'Red & White (Bold)',
    'Purple & White (Creative)',
    'Orange & White (Energetic)',
    'Black & White (Minimal)',
    'Custom Colors',
    'Let AI choose'
  ]

  const contentTones = [
    'Professional & Formal',
    'Friendly & Casual',
    'Authoritative & Expert',
    'Creative & Inspiring',
    'Educational & Informative',
    'Conversational & Personal',
    'Urgent & Action-oriented',
    'Calm & Reassuring'
  ]

  const features = [
    'Contact Forms',
    'Online Store',
    'Blog/News',
    'Gallery/Portfolio',
    'Booking System',
    'Customer Reviews',
    'Social Media Integration',
    'Email Newsletter',
    'Live Chat',
    'Multi-language Support',
    'SEO Optimization',
    'Analytics Dashboard'
  ]

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

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleGenerateWebsite = async () => {
    try {
      // Here you would call your AI API to generate the website
      console.log('Generating website with data:', formData)
      
      // For now, redirect to the editor
      router.push('/dashboard/websites/new')
    } catch (error) {
      console.error('Failed to generate website:', error)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Tell us about your business</h2>
              <p className="text-muted-foreground">
                Help us understand your business to create the perfect website
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
                <Select value={formData.businessType} onValueChange={(value) => setFormData(prev => ({ ...prev, businessType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry.toLowerCase()}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Textarea
                  id="targetAudience"
                  placeholder="Describe your ideal customers (e.g., small business owners, young professionals, families)"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">What's your website's purpose?</h2>
              <p className="text-muted-foreground">
                Help us understand what you want to achieve with your website
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Primary Purpose *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {websitePurposes.map((purpose) => (
                    <Button
                      key={purpose}
                      variant={formData.websitePurpose === purpose ? 'default' : 'outline'}
                      className="h-auto p-4 text-left justify-start"
                      onClick={() => setFormData(prev => ({ ...prev, websitePurpose: purpose }))}
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{purpose}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Palette className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Design preferences</h2>
              <p className="text-muted-foreground">
                Help us create a design that matches your brand
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Design Style *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {designPreferences.map((style) => (
                    <Button
                      key={style}
                      variant={formData.designPreferences === style ? 'default' : 'outline'}
                      className="h-auto p-4 text-left justify-start"
                      onClick={() => setFormData(prev => ({ ...prev, designPreferences: style }))}
                    >
                      <div className="font-medium">{style}</div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color Scheme</Label>
                <Select value={formData.colorScheme} onValueChange={(value) => setFormData(prev => ({ ...prev, colorScheme: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a color scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorSchemes.map((scheme) => (
                      <SelectItem key={scheme} value={scheme.toLowerCase()}>
                        {scheme}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Content Tone</Label>
                <Select value={formData.contentTone} onValueChange={(value) => setFormData(prev => ({ ...prev, contentTone: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your content tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTones.map((tone) => (
                      <SelectItem key={tone} value={tone.toLowerCase()}>
                        {tone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Wand2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Features & functionality</h2>
              <p className="text-muted-foreground">
                Select the features you need for your website
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature) => (
                  <Button
                    key={feature}
                    variant={formData.features.includes(feature) ? 'default' : 'outline'}
                    className="h-auto p-4 text-left justify-start"
                    onClick={() => handleFeatureToggle(feature)}
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{feature}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Final details</h2>
              <p className="text-muted-foreground">
                A few more details to help us create your perfect website
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Budget Range</Label>
                <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free Plan</SelectItem>
                    <SelectItem value="basic">Basic (PKR 2,499/month)</SelectItem>
                    <SelectItem value="premium">Premium (PKR 4,999/month)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (PKR 9,999/month)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Timeline</Label>
                <Select value={formData.timeline} onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="When do you need it?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">ASAP (within 24 hours)</SelectItem>
                    <SelectItem value="week">Within a week</SelectItem>
                    <SelectItem value="month">Within a month</SelectItem>
                    <SelectItem value="flexible">Flexible timeline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">W</span>
              </div>
              <span className="font-semibold text-lg">WebBuilder</span>
            </div>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>AI-Powered</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8">
              {renderStep()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleGenerateWebsite} className="bg-gradient-to-r from-primary to-primary/80">
                <Zap className="h-4 w-4 mr-2" />
                Generate My Website
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage