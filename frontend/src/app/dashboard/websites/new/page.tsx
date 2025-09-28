'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Check, Star, Eye } from 'lucide-react'

// Demo templates
const templates = [
  {
    id: 'restaurant-deluxe',
    name: 'Restaurant Deluxe',
    category: 'Restaurant',
    price: 2500,
    isPremium: true,
    rating: 4.9,
    downloads: 1250,
    description: 'Perfect for restaurants, cafes, and food businesses',
    features: ['Online Menu', 'Reservations', 'Gallery', 'Contact Forms'],
    thumbnail: '/placeholder-template.png'
  },
  {
    id: 'modern-business',
    name: 'Modern Business',
    category: 'Business',
    price: 0,
    isPremium: false,
    rating: 4.8,
    downloads: 2100,
    description: 'Clean and professional template for business websites',
    features: ['About Section', 'Services', 'Testimonials', 'Contact'],
    thumbnail: '/placeholder-template.png'
  },
  {
    id: 'ecommerce-pro',
    name: 'E-commerce Pro',
    category: 'E-commerce',
    price: 3500,
    isPremium: true,
    rating: 4.9,
    downloads: 890,
    description: 'Complete online store template with shopping cart',
    features: ['Product Catalog', 'Shopping Cart', 'Checkout', 'Payment Gateway'],
    thumbnail: '/placeholder-template.png'
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    category: 'Portfolio',
    price: 0,
    isPremium: false,
    rating: 4.7,
    downloads: 1560,
    description: 'Showcase your work with this stunning portfolio template',
    features: ['Gallery', 'Portfolio', 'About', 'Contact'],
    thumbnail: '/placeholder-template.png'
  }
]

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

  const handleCreate = () => {
    // Simulate website creation
    router.push('/dashboard/websites')
  }

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate)

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
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="restaurant">Restaurant & Food</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Eye className="h-8 w-8 text-muted-foreground" />
                    </div>
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
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{template.rating}</span>
                        <span className="text-muted-foreground">({template.downloads} downloads)</span>
                      </div>
                      <div className="font-semibold">
                        {template.price === 0 ? 'Free' : `PKR ${template.price}`}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {template.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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
                      <Eye className="h-4 w-4 text-muted-foreground" />
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
                  {selectedTemplateData?.price === 0 ? 'Free' : `PKR ${selectedTemplateData?.price}`}
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
