'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Check, Star, Eye, Loader2 } from 'lucide-react'
import { apiHelpers } from '@/lib/api'

// Template interface matching backend
interface Template {
  id: string
  name: string
  category: string
  description: string
  thumbnail: string
  isPremium: boolean
  tags: string[]
  pages: string[]
  features: string[]
  localizedFor?: string
}

export default function NewWebsitePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [websiteData, setWebsiteData] = useState({
    name: '',
    domain: '',
    category: '',
    template: ''
  })
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await apiHelpers.getTemplates({ limit: 50 })
        setTemplates(response.data.templates || [])
        
      } catch (err: any) {
        console.error('Failed to fetch templates:', err)
        setError(`Failed to load templates: ${err.message || 'Unknown error'}`)
        setTemplates([])
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleCreate = async () => {
    try {
      // Map category to businessType enum
      const categoryToBusinessType: { [key: string]: string } = {
        'Business': 'OTHER',
        'E-commerce': 'ECOMMERCE',
        'Restaurant': 'RESTAURANT',
        'Portfolio': 'CREATIVE',
        'Education': 'EDUCATION',
        'Medical': 'HEALTHCARE',
        'Real Estate': 'REAL_ESTATE',
        'Events': 'OTHER',
        'Blog': 'OTHER',
        'Non-Profit': 'NON_PROFIT',
        'Fitness': 'SERVICE',
        'Travel': 'SERVICE'
      }

      const businessType = categoryToBusinessType[websiteData.category] || 'OTHER'

      console.log('🚀 Creating website with data:', {
        name: websiteData.name,
        subdomain: websiteData.subdomain,
        category: websiteData.category,
        businessType,
        templateId: selectedTemplate,
        description: selectedTemplateData?.description || '',
        language: 'ENGLISH',
        status: 'DRAFT'
      })

      // Create website using API
      const createData = {
        name: websiteData.name,
        subdomain: websiteData.subdomain,
        category: websiteData.category,
        templateId: selectedTemplate,
        description: selectedTemplateData?.description || '',
        businessType,
        language: 'ENGLISH',
        status: 'DRAFT'
      }

      console.log('📡 Calling API to create website...')
      const response = await apiHelpers.createWebsite(createData)
      console.log('✅ API Response:', response)
      
      if (response.data) {
        console.log('🎯 Redirecting to editor:', `/dashboard/websites/${response.data.id}/edit`)
        // Redirect to website editor
        router.push(`/dashboard/websites/${response.data.id}/edit`)
      } else {
        console.error('❌ No data in response:', response)
      }
    } catch (error) {
      console.error('❌ Failed to create website:', error)
      // For now, just redirect to websites page
      router.push('/dashboard/websites')
    }
  }

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate)

  // Pre-defined categories that match backend templates
  const predefinedCategories = [
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
  
  // Get unique categories from templates (fallback)
  const categories = templates.length > 0 ? [...new Set(templates.map(t => t.category))] : predefinedCategories

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/websites">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Websites
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create New Website</h1>
          <p className="text-muted-foreground">
            Step {step} of 3: {step === 1 ? 'Basic Information' : step === 2 ? 'Choose Template' : 'Review & Create'}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              stepNumber === step 
                ? 'bg-primary text-primary-foreground' 
                : stepNumber < step 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
            }`}>
              {stepNumber < step ? <Check className="h-4 w-4" /> : stepNumber}
            </div>
            {stepNumber < 3 && (
              <div className={`w-16 h-0.5 mx-2 ${
                stepNumber < step ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Tell us about your website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Website Name *</Label>
              <Input
                id="name"
                value={websiteData.name}
                onChange={(e) => setWebsiteData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="My Awesome Website"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Domain Name</Label>
              <div className="flex">
                <Input
                  id="domain"
                  value={websiteData.domain}
                  onChange={(e) => setWebsiteData(prev => ({ ...prev, domain: e.target.value }))}
                  placeholder="mywebsite"
                  className="rounded-r-none"
                />
                <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                  .pakistanbuilder.com
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                You can connect your custom domain later
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Website Category</Label>
              <Select value={websiteData.category} onValueChange={(value) => setWebsiteData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleNext} disabled={!websiteData.name}>
                Next: Choose Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Choose Template</CardTitle>
              <CardDescription>
                Select a template that matches your website category
              </CardDescription>
            </CardHeader>
          </Card>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading templates...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card 
                  key={template.id} 
                  className={`cursor-pointer transition-all ${
                    selectedTemplate === template.id 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden relative">
                      {template.thumbnail ? (
                        <>
                          <img 
                            src={`http://localhost:3002${template.thumbnail}`} 
                            alt={template.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }}
                          />
                          <div 
                            className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100"
                            style={{ display: 'none' }}
                          >
                            <div className="text-center">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">
                                  {template.name.charAt(0)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 font-medium">{template.name}</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <Eye className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      {template.isPremium && (
                        <Badge className="absolute top-2 right-2">Premium</Badge>
                      )}
                      {selectedTemplate === template.id && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="bg-primary text-primary-foreground rounded-full p-2">
                            <Check className="h-4 w-4" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                        <Badge variant="outline" className="mt-2">{template.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <span className="text-muted-foreground">
                            {template.pages?.length || 0} pages
                          </span>
                        </div>
                        <div className="font-semibold">
                          {template.isPremium ? 'Premium' : 'Free'}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {template.features?.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {template.features?.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={!selectedTemplate}>
              Next: Review & Create
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Create</CardTitle>
            <CardDescription>
              Review your website details before creating
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Website Name</Label>
                <p className="text-lg">{websiteData.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Domain</Label>
                <p className="text-lg">
                  {websiteData.domain ? `${websiteData.domain}.pakistanbuilder.com` : 'Not specified'}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <p className="text-lg capitalize">{websiteData.category}</p>
              </div>
              {selectedTemplateData && (
                <div>
                  <Label className="text-sm font-medium">Template</Label>
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                      {selectedTemplateData.thumbnail ? (
                        <img 
                          src={selectedTemplateData.thumbnail} 
                          alt={selectedTemplateData.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{selectedTemplateData.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedTemplateData.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total Cost:</span>
                <span>
                  {selectedTemplateData?.isPremium ? 'Premium Template' : 'Free'}
                </span>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleCreate}>
                Create Website
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}