'use client'

import { useState } from 'react'
import { Element, WebsiteData } from '@/types/editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { 
  Search, 
  Globe, 
  Share2, 
  Eye, 
  AlertCircle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Image,
  FileText,
  Link,
  Smartphone,
  Hash,
  Settings,
  Bot,
  Sparkles
} from 'lucide-react'

interface SEOManagerProps {
  websiteData: WebsiteData
  onUpdateSEO: (seoData: any) => void
}

interface SEOIssue {
  type: 'error' | 'warning' | 'suggestion'
  category: string
  message: string
  fix?: string
}

export function SEOManager({ websiteData, onUpdateSEO }: SEOManagerProps) {
  const [seoData, setSEOData] = useState({
    title: websiteData.seo?.title || '',
    description: websiteData.seo?.description || '',
    keywords: websiteData.seo?.keywords || [],
    ogTitle: websiteData.seo?.ogTitle || '',
    ogDescription: websiteData.seo?.ogDescription || '',
    ogImage: websiteData.seo?.ogImage || '',
    twitterCard: websiteData.seo?.twitterCard || 'summary_large_image',
    canonicalUrl: websiteData.seo?.canonicalUrl || '',
    robots: websiteData.seo?.robots || 'index, follow',
    schema: websiteData.seo?.schema || {},
    sitemap: websiteData.seo?.sitemap || true,
    analytics: websiteData.seo?.analytics || { google: '', facebook: '' }
  })

  const [seoScore, setSEOScore] = useState(0)
  const [issues, setIssues] = useState<SEOIssue[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeSEO = () => {
    setIsAnalyzing(true)
    const newIssues: SEOIssue[] = []
    let score = 100

    // Title checks
    if (!seoData.title) {
      newIssues.push({
        type: 'error',
        category: 'Title',
        message: 'Page title is missing',
        fix: 'Add a unique, descriptive title between 50-60 characters'
      })
      score -= 20
    } else if (seoData.title.length < 30) {
      newIssues.push({
        type: 'warning',
        category: 'Title',
        message: 'Page title is too short',
        fix: 'Expand your title to at least 30 characters'
      })
      score -= 10
    } else if (seoData.title.length > 60) {
      newIssues.push({
        type: 'warning',
        category: 'Title',
        message: 'Page title is too long',
        fix: 'Keep your title under 60 characters'
      })
      score -= 10
    }

    // Description checks
    if (!seoData.description) {
      newIssues.push({
        type: 'error',
        category: 'Description',
        message: 'Meta description is missing',
        fix: 'Add a compelling description between 150-160 characters'
      })
      score -= 20
    } else if (seoData.description.length < 120) {
      newIssues.push({
        type: 'warning',
        category: 'Description',
        message: 'Meta description is too short',
        fix: 'Expand your description to at least 120 characters'
      })
      score -= 10
    } else if (seoData.description.length > 160) {
      newIssues.push({
        type: 'warning',
        category: 'Description',
        message: 'Meta description is too long',
        fix: 'Keep your description under 160 characters'
      })
      score -= 10
    }

    // Keywords check
    if (!seoData.keywords || seoData.keywords.length === 0) {
      newIssues.push({
        type: 'suggestion',
        category: 'Keywords',
        message: 'No keywords specified',
        fix: 'Add relevant keywords for better search visibility'
      })
      score -= 5
    }

    // Open Graph checks
    if (!seoData.ogImage) {
      newIssues.push({
        type: 'warning',
        category: 'Social Media',
        message: 'Open Graph image is missing',
        fix: 'Add an image for better social media sharing'
      })
      score -= 10
    }

    // Schema markup
    if (!seoData.schema || Object.keys(seoData.schema).length === 0) {
      newIssues.push({
        type: 'suggestion',
        category: 'Structured Data',
        message: 'No schema markup found',
        fix: 'Add structured data to help search engines understand your content'
      })
      score -= 5
    }

    setIssues(newIssues)
    setSEOScore(Math.max(0, score))
    setTimeout(() => setIsAnalyzing(false), 1000)
  }

  const generateAISuggestions = () => {
    // Simulate AI-powered suggestions
    const suggestions = [
      `Based on your content, consider using "Pakistani website builder" as a primary keyword`,
      `Your title could be more engaging. Try: "${seoData.title} - Build Stunning Websites in Minutes"`,
      `Add location-specific keywords like "Pakistan", "Karachi", "Lahore" for local SEO`,
      `Include action words in your description like "Create", "Build", "Design" to improve CTR`
    ]
    
    return suggestions
  }

  const updateSEOField = (field: string, value: any) => {
    const updated = { ...seoData, [field]: value }
    setSEOData(updated)
    onUpdateSEO(updated)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>SEO Health Check</span>
            <Button onClick={analyzeSEO} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>Analyzing...</>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analyze SEO
                </>
              )}
            </Button>
          </CardTitle>
          <CardDescription>
            Optimize your website for search engines and social media
          </CardDescription>
        </CardHeader>
        <CardContent>
          {seoScore > 0 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">SEO Score</span>
                  <span className={`text-2xl font-bold ${
                    seoScore >= 80 ? 'text-green-500' :
                    seoScore >= 60 ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                    {seoScore}/100
                  </span>
                </div>
                <Progress value={seoScore} className="h-3" />
              </div>

              {issues.length > 0 && (
                <ScrollArea className="h-48 rounded-md border p-4">
                  <div className="space-y-3">
                    {issues.map((issue, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {issue.type === 'error' ? (
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        ) : issue.type === 'warning' ? (
                          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{issue.message}</p>
                          {issue.fix && (
                            <p className="text-xs text-muted-foreground mt-1">{issue.fix}</p>
                          )}
                          <Badge variant="outline" className="mt-1">
                            {issue.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic SEO</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="ai">AI Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={seoData.title}
                  onChange={(e) => updateSEOField('title', e.target.value)}
                  placeholder="Your Amazing Website"
                  maxLength={60}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Appears in search results and browser tabs</span>
                  <span>{seoData.title.length}/60</span>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Meta Description</Label>
                <Textarea
                  id="description"
                  value={seoData.description}
                  onChange={(e) => updateSEOField('description', e.target.value)}
                  placeholder="A compelling description of your website..."
                  rows={3}
                  maxLength={160}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Appears below the title in search results</span>
                  <span>{seoData.description.length}/160</span>
                </div>
              </div>

              <div>
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={seoData.keywords.join(', ')}
                  onChange={(e) => updateSEOField('keywords', e.target.value.split(',').map(k => k.trim()))}
                  placeholder="website builder, pakistan, urdu support"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate keywords with commas
                </p>
              </div>

              <div>
                <Label htmlFor="canonical">Canonical URL</Label>
                <Input
                  id="canonical"
                  value={seoData.canonicalUrl}
                  onChange={(e) => updateSEOField('canonicalUrl', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  type="url"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The preferred URL for this page
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Preview</CardTitle>
              <CardDescription>
                Control how your website appears when shared on social media
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ogTitle">Open Graph Title</Label>
                <Input
                  id="ogTitle"
                  value={seoData.ogTitle || seoData.title}
                  onChange={(e) => updateSEOField('ogTitle', e.target.value)}
                  placeholder="Title for social media"
                />
              </div>

              <div>
                <Label htmlFor="ogDescription">Open Graph Description</Label>
                <Textarea
                  id="ogDescription"
                  value={seoData.ogDescription || seoData.description}
                  onChange={(e) => updateSEOField('ogDescription', e.target.value)}
                  placeholder="Description for social media"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="ogImage">Open Graph Image</Label>
                <Input
                  id="ogImage"
                  value={seoData.ogImage}
                  onChange={(e) => updateSEOField('ogImage', e.target.value)}
                  placeholder="https://yourwebsite.com/image.jpg"
                  type="url"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended size: 1200x630 pixels
                </p>
              </div>

              {/* Preview Card */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium mb-2">Social Media Preview</h4>
                <div className="border rounded overflow-hidden bg-background">
                  {seoData.ogImage && (
                    <img 
                      src={seoData.ogImage} 
                      alt="Preview" 
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-3">
                    <p className="font-semibold line-clamp-1">
                      {seoData.ogTitle || seoData.title || 'Your Website Title'}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {seoData.ogDescription || seoData.description || 'Your website description'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      yourwebsite.com
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="robots">Robots Meta Tag</Label>
                <select
                  id="robots"
                  value={seoData.robots}
                  onChange={(e) => updateSEOField('robots', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="index, follow">Index & Follow (Recommended)</option>
                  <option value="noindex, follow">No Index, Follow</option>
                  <option value="index, nofollow">Index, No Follow</option>
                  <option value="noindex, nofollow">No Index, No Follow</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sitemap">Generate Sitemap</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically create XML sitemap
                  </p>
                </div>
                <Switch
                  id="sitemap"
                  checked={seoData.sitemap}
                  onCheckedChange={(checked) => updateSEOField('sitemap', checked)}
                />
              </div>

              <div>
                <Label>Analytics Integration</Label>
                <div className="space-y-2 mt-2">
                  <Input
                    placeholder="Google Analytics ID (e.g., G-XXXXXXXXXX)"
                    value={seoData.analytics.google}
                    onChange={(e) => updateSEOField('analytics', { ...seoData.analytics, google: e.target.value })}
                  />
                  <Input
                    placeholder="Facebook Pixel ID"
                    value={seoData.analytics.facebook}
                    onChange={(e) => updateSEOField('analytics', { ...seoData.analytics, facebook: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Schema Markup</Label>
                <Textarea
                  value={JSON.stringify(seoData.schema, null, 2)}
                  onChange={(e) => {
                    try {
                      const schema = JSON.parse(e.target.value)
                      updateSEOField('schema', schema)
                    } catch {}
                  }}
                  placeholder='{"@context": "https://schema.org", "@type": "WebSite"}'
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Add structured data in JSON-LD format
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI SEO Assistant
              </CardTitle>
              <CardDescription>
                Get AI-powered suggestions to improve your SEO
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-primary/10 rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI Suggestions
                  </h4>
                  <div className="space-y-2">
                    {generateAISuggestions().map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <p className="text-sm flex-1">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analyze Competitors
                  </Button>
                  <Button variant="outline">
                    <Hash className="h-4 w-4 mr-2" />
                    Keyword Research
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Content Optimization
                  </Button>
                  <Button variant="outline">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Mobile SEO Check
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
