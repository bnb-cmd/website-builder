'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Brain,
  Zap,
  Sparkles,
  Target,
  BarChart3,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  MessageSquare,
  Image,
  FileText,
  Code,
  Palette,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Users,
  Globe
} from 'lucide-react'

export default function AdvancedAIPage() {
  const [activeTab, setActiveTab] = useState('assistant')
  const [isGenerating, setIsGenerating] = useState(false)

  const aiFeatures = [
    {
      id: 1,
      name: 'Content Generator',
      description: 'Generate high-quality content for your website',
      status: 'active',
      usage: '85%',
      icon: FileText,
      color: 'text-blue-500'
    },
    {
      id: 2,
      name: 'Image Creator',
      description: 'Create custom images using AI',
      status: 'active',
      usage: '62%',
      icon: Image,
      color: 'text-green-500'
    },
    {
      id: 3,
      name: 'Code Assistant',
      description: 'AI-powered code generation and optimization',
      status: 'limited',
      usage: '23%',
      icon: Code,
      color: 'text-purple-500'
    },
    {
      id: 4,
      name: 'Design Optimizer',
      description: 'Optimize your website design automatically',
      status: 'active',
      usage: '78%',
      icon: Palette,
      color: 'text-orange-500'
    }
  ]

  const recentSessions = [
    {
      id: 1,
      type: 'Content Generation',
      prompt: 'Create a landing page for a tech startup',
      result: 'Generated 3 page variations with copy and CTAs',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'completed'
    },
    {
      id: 2,
      type: 'Image Creation',
      prompt: 'Modern office building for corporate website',
      result: 'Created 5 high-resolution images',
      timestamp: '2024-01-15T09:15:00Z',
      status: 'completed'
    },
    {
      id: 3,
      type: 'Code Optimization',
      prompt: 'Optimize CSS for mobile responsiveness',
      result: 'Reduced CSS by 30% and improved mobile layout',
      timestamp: '2024-01-14T16:45:00Z',
      status: 'completed'
    }
  ]

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-500" />
            Advanced AI
          </h1>
          <p className="text-muted-foreground">
            Access powerful AI tools to enhance your website creation process
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </div>
      </div>

      {/* AI Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Sessions</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Pages & sections</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images Created</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Custom images</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24h</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
          <TabsTrigger value="features">AI Features</TabsTrigger>
          <TabsTrigger value="sessions">Recent Sessions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="assistant" className="space-y-6">
          {/* AI Chat Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                AI Assistant
              </CardTitle>
              <CardDescription>
                Chat with our advanced AI to get help with your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">What do you need help with?</label>
                  <Textarea 
                    placeholder="Describe what you want to create or improve..."
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">AI Model</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select AI model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4 (Most Advanced)</SelectItem>
                        <SelectItem value="gpt-3.5">GPT-3.5 (Fast)</SelectItem>
                        <SelectItem value="claude">Claude (Creative)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Output Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select output type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="content">Content Only</SelectItem>
                        <SelectItem value="code">Code + Content</SelectItem>
                        <SelectItem value="design">Design + Content</SelectItem>
                        <SelectItem value="full">Full Website</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {aiFeatures.map((feature) => (
              <Card key={feature.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <feature.icon className={`h-5 w-5 ${feature.color}`} />
                      <CardTitle className="text-lg">{feature.name}</CardTitle>
                    </div>
                    <Badge 
                      variant={
                        feature.status === 'active' ? 'default' :
                        feature.status === 'limited' ? 'secondary' : 'outline'
                      }
                    >
                      {feature.status}
                    </Badge>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Usage this month</span>
                      <span className="font-medium">{feature.usage}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: feature.usage }}
                      ></div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Play className="h-4 w-4 mr-2" />
                        Use
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent AI Sessions</h3>
            {recentSessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{session.type}</h4>
                        <Badge variant="outline" className="text-xs">
                          {session.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        <strong>Prompt:</strong> {session.prompt}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        <strong>Result:</strong> {session.result}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(session.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="text-center py-16 text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Settings</h3>
            <p>Configure your AI preferences and model settings coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
