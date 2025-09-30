'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Box, 
  Upload, 
  Play, 
  Pause, 
  RotateCcw, 
  Move3d, 
  Zap,
  Eye,
  EyeOff,
  Download,
  Trash2,
  Plus,
  Loader2,
  Sparkles,
  Video,
  Image,
  Music
} from 'lucide-react'
import { CubeIcon } from '@/components/icons/custom-icons'
import { apiHelpers } from '@/lib/api'

interface ARVRContent {
  id: string
  websiteId: string
  userId?: string
  name: string
  type: string
  description?: string
  modelUrl?: string
  textureUrl?: string
  animationUrl?: string
  scale?: any
  position?: any
  rotation?: any
  interactions?: any
  status: string
  polygonCount?: number
  textureSize?: number
  fileSize?: number
  createdAt: string
  updatedAt: string
}

interface ARVRContentManagerProps {
  websiteId: string
  userId?: string
}

const contentTypes = [
  { value: 'AR_OVERLAY', label: 'AR Overlay', icon: Eye, color: 'bg-blue-900' },
  { value: 'VR_EXPERIENCE', label: 'VR Experience', icon: Box, color: 'bg-purple-500' },
  { value: '3D_MODEL', label: '3D Model', icon: CubeIcon, color: 'bg-green-500' },
  { value: 'ANIMATION', label: 'Animation', icon: Video, color: 'bg-orange-500' },
  { value: 'INTERACTIVE_SCENE', label: 'Interactive Scene', icon: Zap, color: 'bg-pink-500' }
]

export function ARVRContentManager({ websiteId, userId }: ARVRContentManagerProps) {
  const [content, setContent] = useState<ARVRContent[]>([])
  const [selectedContent, setSelectedContent] = useState<ARVRContent | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [generationPrompt, setGenerationPrompt] = useState('')
  const [selectedType, setSelectedType] = useState('3D_MODEL')

  useEffect(() => {
    loadContent()
  }, [websiteId])

  const loadContent = async () => {
    try {
      const response = await apiHelpers.getARVRContent(websiteId)
      const data = response.data
      setContent(data)
    } catch (error) {
      console.error('Failed to load AR/VR content:', error)
    }
  }

  const generateContent = async () => {
    if (!generationPrompt.trim()) return

    try {
      setIsLoading(true)
      const response = await apiHelpers.generateARVRContent({
        prompt: generationPrompt,
        type: selectedType as any,
        websiteId,
        userId
      })
      const newContent = response.data
      setContent(prev => [newContent, ...prev])
      setSelectedContent(newContent)
      setGenerationPrompt('')
    } catch (error) {
      console.error('Failed to generate AR/VR content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const processContent = async (contentId: string) => {
    try {
      setIsLoading(true)
      await apiHelpers.processARVRContent(contentId)
      // Reload content to get updated status
      await loadContent()
    } catch (error) {
      console.error('Failed to process AR/VR content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY': return 'bg-green-500'
      case 'PROCESSING': return 'bg-yellow-500'
      case 'ERROR': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="h-full flex">
      {/* Content List Sidebar */}
      <div className="w-80 border-r bg-gray-50/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">AR/VR Content</h3>
          <Button
            className="text-xs h-8"
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>

        {/* Content Generation */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Generate Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Type</label>
              <div className="grid grid-cols-2 gap-1">
                {contentTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <Button
                      key={type.value}
                      variant={selectedType === type.value ? "default" : "outline"}
                      onClick={() => setSelectedType(type.value)}
                      className={`h-auto p-2 flex flex-col items-center text-xs ${
                        selectedType === type.value ? type.color : ''
                      }`}
                    >
                      <Icon className="w-3 h-3 mb-1" />
                      <span className="text-xs">{type.label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>
            <div>
              <Input
                value={generationPrompt}
                onChange={(e) => setGenerationPrompt(e.target.value)}
                placeholder="Describe what you want to create..."
                className="text-sm"
              />
            </div>
            <Button
              onClick={generateContent}
              disabled={!generationPrompt.trim() || isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-xs h-8"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Generate
            </Button>
          </CardContent>
        </Card>

        {/* Content List */}
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {content.map((item) => {
              const contentType = contentTypes.find(t => t.value === item.type)
              const Icon = contentType?.icon || CubeIcon
              return (
                <Card
                  key={item.id}
                  className={`cursor-pointer transition-colors ${
                    selectedContent?.id === item.id ? 'ring-2 ring-blue-900' : ''
                  }`}
                  onClick={() => setSelectedContent(item)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium truncate">{item.name}</span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getStatusColor(item.status)} text-white`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Type: {contentType?.label}</div>
                      {item.polygonCount && <div>Polygons: {item.polygonCount.toLocaleString()}</div>}
                      {item.fileSize && <div>Size: {formatFileSize(item.fileSize)}</div>}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Content Details */}
      <div className="flex-1 flex flex-col">
        {selectedContent ? (
          <>
            {/* Content Header */}
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{selectedContent.name}</h2>
                  <p className="text-sm text-gray-500">
                    {contentTypes.find(t => t.value === selectedContent.type)?.label}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    className="text-xs h-8"
                    variant="outline"
                    onClick={() => processContent(selectedContent.id)}
                    disabled={isLoading || selectedContent.status === 'PROCESSING'}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    Process
                  </Button>
                  <Button className="text-xs h-8" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button className="text-xs h-8" variant="outline">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Content Preview */}
            <div className="flex-1 p-4">
              {showPreview ? (
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-sm">3D Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <CubeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">3D Preview Coming Soon</p>
                      <p className="text-sm text-gray-400">
                        WebGL-based 3D viewer will be implemented here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {/* Content Properties */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Properties</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-700">Status</label>
                          <Badge 
                            className={`${getStatusColor(selectedContent.status)} text-white`}
                          >
                            {selectedContent.status}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700">Type</label>
                          <p className="text-sm">{contentTypes.find(t => t.value === selectedContent.type)?.label}</p>
                        </div>
                        {selectedContent.polygonCount && (
                          <div>
                            <label className="text-xs font-medium text-gray-700">Polygons</label>
                            <p className="text-sm">{selectedContent.polygonCount.toLocaleString()}</p>
                          </div>
                        )}
                        {selectedContent.textureSize && (
                          <div>
                            <label className="text-xs font-medium text-gray-700">Texture Size</label>
                            <p className="text-sm">{selectedContent.textureSize}px</p>
                          </div>
                        )}
                        {selectedContent.fileSize && (
                          <div>
                            <label className="text-xs font-medium text-gray-700">File Size</label>
                            <p className="text-sm">{formatFileSize(selectedContent.fileSize)}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Transform Controls */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Transform</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-700">Position</label>
                          <div className="space-y-1">
                            <Input 
                              placeholder="X" 
                              className="text-xs h-8"
                              value={selectedContent.position?.x || 0}
                            />
                            <Input 
                              placeholder="Y" 
                              className="text-xs h-8"
                              value={selectedContent.position?.y || 0}
                            />
                            <Input 
                              placeholder="Z" 
                              className="text-xs h-8"
                              value={selectedContent.position?.z || 0}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700">Rotation</label>
                          <div className="space-y-1">
                            <Input 
                              placeholder="X" 
                              className="text-xs h-8" 
                              value={selectedContent.rotation?.x || 0}
                            />
                            <Input 
                              placeholder="Y" 
                              className="text-xs h-8" 
                              value={selectedContent.rotation?.y || 0}
                            />
                            <Input 
                              placeholder="Z" 
                              className="text-xs h-8" 
                              value={selectedContent.rotation?.z || 0}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700">Scale</label>
                          <div className="space-y-1">
                            <Input 
                              placeholder="X" 
                              className="text-xs h-8" 
                              value={selectedContent.scale?.x || 1}
                            />
                            <Input 
                              placeholder="Y" 
                              className="text-xs h-8" 
                              value={selectedContent.scale?.y || 1}
                            />
                            <Input 
                              placeholder="Z" 
                              className="text-xs h-8" 
                              value={selectedContent.scale?.z || 1}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Interactions */}
                  {selectedContent.interactions && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Interactions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(selectedContent.interactions).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="font-medium capitalize">{key}:</span>
                              <span className="text-gray-600">{value as string}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <CubeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No Content Selected
              </h3>
              <p className="text-gray-500 mb-4">
                Select content from the sidebar or generate new AR/VR content
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
