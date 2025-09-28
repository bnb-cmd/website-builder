'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  MessageCircle, 
  Code, 
  Palette, 
  BarChart3,
  FileText,
  Cube,
  Zap,
  Sparkles,
  TrendingUp,
  Clock,
  DollarSign,
  Activity
} from 'lucide-react'
import { AIChatInterface } from '@/components/ai/ai-chat-interface'
import { ARVRContentManager } from '@/components/arvr/arvr-content-manager'

interface AdvancedAIDashboardProps {
  websiteId: string
  userId?: string
}

export function AdvancedAIDashboard({ websiteId, userId }: AdvancedAIDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data for demonstration
  const aiStats = {
    totalSessions: 24,
    totalMessages: 156,
    totalTokens: 12500,
    totalCost: 0.25,
    avgResponseTime: 1.2,
    satisfactionScore: 4.8
  }

  const recentSessions = [
    {
      id: '1',
      type: 'CODE_GENERATION',
      message: 'Generate a responsive navbar component',
      timestamp: '2 minutes ago',
      tokens: 150,
      cost: 0.003
    },
    {
      id: '2',
      type: 'DESIGN_ASSISTANCE',
      message: 'Suggest color scheme for e-commerce site',
      timestamp: '15 minutes ago',
      tokens: 200,
      cost: 0.004
    },
    {
      id: '3',
      type: 'CONTENT_CREATION',
      message: 'Write product descriptions for electronics',
      timestamp: '1 hour ago',
      tokens: 300,
      cost: 0.006
    }
  ]

  const arvrStats = {
    totalContent: 8,
    readyContent: 5,
    processingContent: 2,
    errorContent: 1,
    totalPolygons: 45000,
    avgFileSize: 12.5
  }

  const recentContent = [
    {
      id: '1',
      name: 'Product 3D Model',
      type: '3D_MODEL',
      status: 'READY',
      polygonCount: 8500,
      fileSize: 8.2,
      createdAt: '1 hour ago'
    },
    {
      id: '2',
      name: 'AR Product Overlay',
      type: 'AR_OVERLAY',
      status: 'PROCESSING',
      polygonCount: 0,
      fileSize: 0,
      createdAt: '2 hours ago'
    },
    {
      id: '3',
      name: 'VR Showroom',
      type: 'VR_EXPERIENCE',
      status: 'READY',
      polygonCount: 25000,
      fileSize: 18.7,
      createdAt: '1 day ago'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Advanced AI Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Next-generation AI features and immersive web experiences
          </p>
        </div>
        <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Sparkles className="w-4 h-4 mr-1" />
          AI Powered
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-chat">AI Chat</TabsTrigger>
          <TabsTrigger value="arvr">AR/VR Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* AI Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Sessions</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{aiStats.totalSessions}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{aiStats.totalMessages}</div>
                <p className="text-xs text-muted-foreground">
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${aiStats.totalCost}</div>
                <p className="text-xs text-muted-foreground">
                  {aiStats.totalTokens.toLocaleString()} tokens used
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{aiStats.avgResponseTime}s</div>
                <p className="text-xs text-muted-foreground">
                  Satisfaction: {aiStats.satisfactionScore}/5
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AR/VR Content</CardTitle>
                <Cube className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{arvrStats.totalContent}</div>
                <p className="text-xs text-muted-foreground">
                  {arvrStats.readyContent} ready, {arvrStats.processingContent} processing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Polygons</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{arvrStats.totalPolygons.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Avg file size: {arvrStats.avgFileSize}MB
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Recent AI Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          {session.type === 'CODE_GENERATION' && <Code className="w-4 h-4 text-white" />}
                          {session.type === 'DESIGN_ASSISTANCE' && <Palette className="w-4 h-4 text-white" />}
                          {session.type === 'CONTENT_CREATION' && <FileText className="w-4 h-4 text-white" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{session.message}</p>
                          <p className="text-xs text-gray-500">{session.timestamp}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{session.tokens} tokens</p>
                        <p className="text-xs text-gray-500">${session.cost}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cube className="w-5 h-5 mr-2" />
                  Recent AR/VR Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentContent.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <Cube className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.createdAt}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="secondary" 
                          className={
                            item.status === 'READY' ? 'bg-green-500 text-white' :
                            item.status === 'PROCESSING' ? 'bg-yellow-500 text-white' :
                            'bg-red-500 text-white'
                          }
                        >
                          {item.status}
                        </Badge>
                        {item.polygonCount > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            {item.polygonCount.toLocaleString()} polygons
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Chat Tab */}
        <TabsContent value="ai-chat">
          <Card className="h-[600px]">
            <CardContent className="p-0 h-full">
              <AIChatInterface websiteId={websiteId} userId={userId} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* AR/VR Content Tab */}
        <TabsContent value="arvr">
          <Card className="h-[600px]">
            <CardContent className="p-0 h-full">
              <ARVRContentManager websiteId={websiteId} userId={userId} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Usage Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Usage charts coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AR/VR Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Performance metrics coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Model Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="font-medium">GPT-4 Turbo</p>
                      <p className="text-sm text-gray-500">Code Generation & Analysis</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">98.5% accuracy</p>
                    <p className="text-xs text-gray-500">1.2s avg response</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Palette className="w-8 h-8 text-pink-500" />
                    <div>
                      <p className="font-medium">DALL-E 3</p>
                      <p className="text-sm text-gray-500">Image Generation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">95.2% satisfaction</p>
                    <p className="text-xs text-gray-500">3.5s avg generation</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Cube className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="font-medium">Custom 3D Model AI</p>
                      <p className="text-sm text-gray-500">AR/VR Content Generation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">92.8% success rate</p>
                    <p className="text-xs text-gray-500">15s avg processing</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
