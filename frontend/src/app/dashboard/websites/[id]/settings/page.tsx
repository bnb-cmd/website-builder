"use client";

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Save,
  Globe,
  Settings,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Loader
} from '@/lib/icons'
import { useRouter } from '@/lib/router'
import { useWebsiteStore } from '@/lib/store'
import { apiHelpers } from '@/lib/api'
import { toast } from 'sonner'
import { SubdomainSettings } from '@/components/settings/SubdomainSettings'

interface WebsiteSettings {
  name: string
  description: string
  businessType: string
  language: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  customCSS: string
  customJS: string
  subdomain?: string
  customDomain?: string
}

export default function WebsiteSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { navigate } = useRouter()
  const { currentWebsite, updateWebsite } = useWebsiteStore()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  
  const [settings, setSettings] = useState<WebsiteSettings>({
    name: '',
    description: '',
    businessType: '',
    language: 'ENGLISH',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    customCSS: '',
    customJS: '',
    subdomain: '',
    customDomain: ''
  })

  useEffect(() => {
    if (currentWebsite) {
      setSettings({
        name: currentWebsite.name || '',
        description: currentWebsite.description || '',
        businessType: currentWebsite.businessType || '',
        language: currentWebsite.language || 'ENGLISH',
        metaTitle: currentWebsite.metaTitle || '',
        metaDescription: currentWebsite.metaDescription || '',
        metaKeywords: currentWebsite.metaKeywords || '',
        customCSS: currentWebsite.customCSS || '',
        customJS: currentWebsite.customJS || '',
        subdomain: currentWebsite.subdomain || '',
        customDomain: currentWebsite.customDomain || ''
      })
    }
  }, [currentWebsite])

  const handleSaveSettings = async () => {
    if (!currentWebsite) return
    
    setIsLoading(true)
    try {
      const response = await apiHelpers.updateWebsite(currentWebsite.id, {
        name: settings.name,
        description: settings.description,
        businessType: settings.businessType,
        language: settings.language,
        metaTitle: settings.metaTitle,
        metaDescription: settings.metaDescription,
        metaKeywords: settings.metaKeywords,
        customCSS: settings.customCSS,
        customJS: settings.customJS,
        subdomain: settings.subdomain,
        customDomain: settings.customDomain
      })
      
      if (response.success) {
        updateWebsite(currentWebsite.id, { ...currentWebsite, ...settings })
        toast.success('Settings saved successfully!')
      } else {
        toast.error('Failed to save settings')
      }
    } catch (error) {
      console.error('Save settings error:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'domain', label: 'Domain', icon: Globe },
    { id: 'seo', label: 'SEO', icon: Eye },
    { id: 'custom', label: 'Custom Code', icon: Settings }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/dashboard/websites/${currentWebsite?.id}/edit`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Editor
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Website Settings</h1>
            <p className="text-muted-foreground">
              Configure your website settings and preferences.
            </p>
          </div>
        </div>
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {tab.label}
              </Button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Update your website's basic information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Website Name</Label>
                      <Input
                        id="name"
                        value={settings.name}
                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                        placeholder="Enter website name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type</Label>
                      <Select 
                        value={settings.businessType} 
                        onValueChange={(value) => setSettings({ ...settings, businessType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                          <SelectItem value="RETAIL">Retail</SelectItem>
                          <SelectItem value="SERVICE">Service</SelectItem>
                          <SelectItem value="HEALTHCARE">Healthcare</SelectItem>
                          <SelectItem value="EDUCATION">Education</SelectItem>
                          <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                          <SelectItem value="FINANCE">Finance</SelectItem>
                          <SelectItem value="REAL_ESTATE">Real Estate</SelectItem>
                          <SelectItem value="ENTERTAINMENT">Entertainment</SelectItem>
                          <SelectItem value="NON_PROFIT">Non-Profit</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={settings.description}
                      onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                      placeholder="Enter website description"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={settings.language} 
                      onValueChange={(value) => setSettings({ ...settings, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ENGLISH">English</SelectItem>
                        <SelectItem value="URDU">Urdu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Domain Tab */}
          {activeTab === 'domain' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Domain Settings</CardTitle>
                  <CardDescription>
                    Configure your website's domain and subdomain settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-4">Subdomain Settings</h4>
                    <SubdomainSettings 
                      websiteId={currentWebsite?.id || ''} 
                      currentSubdomain={settings.subdomain}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-4">Custom Domain</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="customDomain">Custom Domain</Label>
                        <Input
                          id="customDomain"
                          value={settings.customDomain}
                          onChange={(e) => setSettings({ ...settings, customDomain: e.target.value })}
                          placeholder="example.com"
                        />
                        <p className="text-sm text-muted-foreground">
                          Enter your custom domain (premium feature)
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Optimize your website for search engines.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={settings.metaTitle}
                      onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                      placeholder="Enter meta title"
                    />
                    <p className="text-sm text-muted-foreground">
                      Recommended: 50-60 characters
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={settings.metaDescription}
                      onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                      placeholder="Enter meta description"
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground">
                      Recommended: 150-160 characters
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="metaKeywords">Meta Keywords</Label>
                    <Input
                      id="metaKeywords"
                      value={settings.metaKeywords}
                      onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                    <p className="text-sm text-muted-foreground">
                      Separate keywords with commas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Custom Code Tab */}
          {activeTab === 'custom' && (
            <Card>
              <CardHeader>
                <CardTitle>Custom Code</CardTitle>
                <CardDescription>
                  Add custom CSS and JavaScript to your website.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customCSS">Custom CSS</Label>
                    <Textarea
                      id="customCSS"
                      value={settings.customCSS}
                      onChange={(e) => setSettings({ ...settings, customCSS: e.target.value })}
                      placeholder="/* Add your custom CSS here */"
                      rows={10}
                      className="font-mono"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customJS">Custom JavaScript</Label>
                    <Textarea
                      id="customJS"
                      value={settings.customJS}
                      onChange={(e) => setSettings({ ...settings, customJS: e.target.value })}
                      placeholder="// Add your custom JavaScript here"
                      rows={10}
                      className="font-mono"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
