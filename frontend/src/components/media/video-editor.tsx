'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { 
  Play, 
  Pause, 
  Square, 
  Upload, 
  Download, 
  Scissors, 
  Volume2, 
  VolumeX,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Settings,
  Plus,
  Trash2,
  Wand2,
  Video,
  Image,
  Music,
  Film
} from 'lucide-react'
import { apiHelpers } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface MediaAsset {
  id: string
  name: string
  type: string
  url: string
  thumbnailUrl?: string
  duration?: number
  width?: number
  height?: number
  aiGenerated: boolean
}

interface VideoProject {
  id: string
  name: string
  description?: string
  resolution: string
  frameRate: number
  duration: number
  status: string
  timeline: any
  clips: VideoClip[]
}

interface VideoClip {
  id: string
  name: string
  assetId?: string
  startTime: number
  endTime: number
  position: number
  effects?: any
  filters?: any
  transform?: any
  asset?: MediaAsset
}

interface VideoEditorProps {
  websiteId: string
}

export function VideoEditor({ websiteId }: VideoEditorProps) {
  const [projects, setProjects] = useState<VideoProject[]>([])
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [selectedProject, setSelectedProject] = useState<VideoProject | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState([50])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    resolution: '1920x1080',
    frameRate: 30
  })

  const [aiPrompt, setAiPrompt] = useState({
    prompt: '',
    type: 'IMAGE' as 'IMAGE' | 'VIDEO' | 'AUDIO'
  })

  useEffect(() => {
    fetchProjects()
    fetchAssets()
  }, [websiteId])

  const fetchProjects = async () => {
    try {
      const response = await apiHelpers.getVideoProjects(websiteId)
      setProjects(response.data.data || [])
    } catch (error) {
      toast.error('Failed to fetch video projects')
    } finally {
      setLoading(false)
    }
  }

  const fetchAssets = async () => {
    try {
      const response = await apiHelpers.getMediaAssets(websiteId)
      setAssets(response.data.data || [])
    } catch (error) {
      toast.error('Failed to fetch media assets')
    }
  }

  const createProject = async () => {
    try {
      await apiHelpers.createVideoProject(websiteId, newProject)
      toast.success('Video project created!')
      setIsCreateDialogOpen(false)
      setNewProject({ name: '', description: '', resolution: '1920x1080', frameRate: 30 })
      fetchProjects()
    } catch (error) {
      toast.error('Failed to create project')
    }
  }

  const generateAIMedia = async () => {
    try {
      await apiHelpers.generateAIMedia(websiteId, aiPrompt)
      toast.success('AI media generated!')
      setIsAIDialogOpen(false)
      setAiPrompt({ prompt: '', type: 'IMAGE' })
      fetchAssets()
    } catch (error) {
      toast.error('Failed to generate AI media')
    }
  }

  const addClipToTimeline = async (asset: MediaAsset) => {
    if (!selectedProject) return

    try {
      const clipData = {
        name: asset.name,
        assetId: asset.id,
        startTime: 0,
        endTime: asset.duration || 10,
        position: selectedProject.duration,
        effects: {},
        filters: {},
        transform: { x: 0, y: 0, scale: 1, rotation: 0 }
      }

      await apiHelpers.addVideoClip(selectedProject.id, clipData)
      toast.success('Clip added to timeline!')
      fetchProjects()
    } catch (error) {
      toast.error('Failed to add clip')
    }
  }

  const exportVideo = async () => {
    if (!selectedProject) return

    try {
      const settings = {
        resolution: selectedProject.resolution,
        frameRate: selectedProject.frameRate,
        format: 'mp4',
        quality: 'high'
      }

      await apiHelpers.exportVideo(selectedProject.id, { settings })
      toast.success('Video export started!')
    } catch (error) {
      toast.error('Failed to export video')
    }
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Video className="h-4 w-4" />
      case 'IMAGE': return <Image className="h-4 w-4" />
      case 'AUDIO': return <Music className="h-4 w-4" />
      default: return <Film className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <div>
          <h1 className="text-2xl font-bold">Video Editor</h1>
          <p className="text-gray-400">Professional video editing studio</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Video Project</DialogTitle>
                <DialogDescription>
                  Start a new video editing project with custom settings.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Project Name</label>
                  <Input
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Project description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Resolution</label>
                    <Select value={newProject.resolution} onValueChange={(value) => setNewProject({ ...newProject, resolution: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                        <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                        <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Frame Rate</label>
                    <Select value={newProject.frameRate.toString()} onValueChange={(value) => setNewProject({ ...newProject, frameRate: parseInt(value) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24">24 fps</SelectItem>
                        <SelectItem value="30">30 fps</SelectItem>
                        <SelectItem value="60">60 fps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createProject}>
                    Create Project
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Wand2 className="h-4 w-4 mr-2" />
                AI Generate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate AI Media</DialogTitle>
                <DialogDescription>
                  Create images, videos, or audio using AI.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Prompt</label>
                  <Textarea
                    value={aiPrompt.prompt}
                    onChange={(e) => setAiPrompt({ ...aiPrompt, prompt: e.target.value })}
                    placeholder="Describe what you want to generate..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select value={aiPrompt.type} onValueChange={(value: any) => setAiPrompt({ ...aiPrompt, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IMAGE">Image</SelectItem>
                      <SelectItem value="VIDEO">Video</SelectItem>
                      <SelectItem value="AUDIO">Audio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAIDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={generateAIMedia}>
                    Generate
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Sidebar - Projects & Assets */}
        <div className="w-80 border-r border-gray-700 flex flex-col">
          <Tabs defaultValue="projects" className="flex-1">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="flex-1 p-4">
              <div className="space-y-2">
                {projects.map((project) => (
                  <Card 
                    key={project.id} 
                    className={`cursor-pointer ${selectedProject?.id === project.id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">{project.resolution} @ {project.frameRate}fps</p>
                        </div>
                        <Badge variant={project.status === 'COMPLETED' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="assets" className="flex-1 p-4">
              <div className="space-y-2">
                {assets.map((asset) => (
                  <Card key={asset.id} className="cursor-pointer" onClick={() => addClipToTimeline(asset)}>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        {asset.thumbnailUrl ? (
                          <img src={asset.thumbnailUrl} alt={asset.name} className="w-12 h-8 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center">
                            {getAssetIcon(asset.type)}
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{asset.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{asset.type}</span>
                            {asset.duration && <span>{asset.duration}s</span>}
                            {asset.aiGenerated && <Badge variant="outline" className="text-xs">AI</Badge>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Preview */}
          <div className="flex-1 bg-black flex items-center justify-center">
            {selectedProject ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                >
                  <source src="/sample-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Video Controls Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <Button size="sm" onClick={togglePlayPause}>
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" onClick={() => videoRef.current?.pause()}>
                      <Square className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <Slider
                        value={[currentTime]}
                        onValueChange={(value) => {
                          setCurrentTime(value[0])
                          if (videoRef.current) videoRef.current.currentTime = value[0]
                        }}
                        max={selectedProject.duration}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      <Slider
                        value={volume}
                        onValueChange={setVolume}
                        max={100}
                        step={1}
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <Video className="h-16 w-16 mx-auto mb-4" />
                <p>Select a project to start editing</p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="h-48 bg-gray-800 border-t border-gray-700 p-4">
            <h3 className="text-sm font-medium mb-2">Timeline</h3>
            <div ref={timelineRef} className="h-32 bg-gray-900 rounded border overflow-x-auto">
              {selectedProject?.clips.map((clip) => (
                <div
                  key={clip.id}
                  className="inline-block bg-blue-600 rounded m-1 p-2 text-xs cursor-pointer hover:bg-blue-700"
                  style={{ width: `${(clip.endTime - clip.startTime) * 20}px` }}
                >
                  {clip.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Tools */}
        <div className="w-64 border-l border-gray-700 p-4">
          <h3 className="font-medium mb-4">Tools</h3>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Scissors className="h-4 w-4 mr-2" />
              Cut
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <RotateCcw className="h-4 w-4 mr-2" />
              Rotate Left
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <RotateCw className="h-4 w-4 mr-2" />
              Rotate Right
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <ZoomIn className="h-4 w-4 mr-2" />
              Zoom In
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <ZoomOut className="h-4 w-4 mr-2" />
              Zoom Out
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Effects
            </Button>
          </div>
          
          <div className="mt-6">
            <Button onClick={exportVideo} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Video
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
