'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Star, Eye, Loader2 } from 'lucide-react'
import { apiHelpers } from '@/lib/api'

interface Template {
  id: string
  name: string
  description: string
  category: string
  thumbnail: string
  isPremium: boolean
  tags: string[]
  pages: string[]
  features: string[]
  localizedFor?: string
}

export function Templates() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await apiHelpers.getTemplates({ limit: 6 })
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

  return (
    <section className="py-24">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Beautiful Templates for Every Business
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from hundreds of professionally designed templates. 
            All templates are mobile-responsive and optimized for Pakistani businesses.
          </p>
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <Card key={template.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                    {template.thumbnail ? (
                      <img 
                        src={`http://localhost:3005${template.thumbnail}`} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Eye className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  {template.isPremium && (
                    <Badge className="absolute top-4 right-4 bg-primary">
                      Premium
                    </Badge>
                  )}
                </div>
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {template.pages?.length || 0} pages
                      </span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {template.features?.length || 0} features
                      </span>
                    </div>
                    <div className="text-sm font-semibold">
                      {template.isPremium ? 'Premium' : 'Free'}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.features?.slice(0, 2).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {template.features?.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.features.length - 2} more
                      </Badge>
                    )}
                  </div>
                  
                  <Button className="w-full group-hover:bg-primary/90">
                    Use Template
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/dashboard/templates">
            <Button variant="outline" size="lg">
              View All Templates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}