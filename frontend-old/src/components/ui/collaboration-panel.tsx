import React, { useState } from 'react'
import { Collaborator, CollaborationEvent } from '@/hooks/use-collaboration'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  Wifi,
  WifiOff,
  Clock,
  MessageSquare,
  Settings,
  Copy,
  Share2,
  Eye,
  EyeOff
} from 'lucide-react'
import { CollaborationPresence } from './collaboration-cursors'

interface CollaborationPanelProps {
  collaborators: Collaborator[]
  currentUser: Collaborator
  isConnected: boolean
  connectionStatus: string
  events: CollaborationEvent[]
  onToggleVisibility?: () => void
  onShareLink?: () => void
  onCopyLink?: () => void
  className?: string
}

export function CollaborationPanel({
  collaborators,
  currentUser,
  isConnected,
  connectionStatus,
  events,
  onToggleVisibility,
  onShareLink,
  onCopyLink,
  className
}: CollaborationPanelProps) {
  const [activeTab, setActiveTab] = useState('presence')
  const activeCollaborators = collaborators.filter(c => c.isOnline)

  const formatEventTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return timestamp.toLocaleDateString()
  }

  const getEventDescription = (event: CollaborationEvent) => {
    const collaborator = collaborators.find(c => c.id === event.userId)
    const name = collaborator?.name || 'Unknown user'

    switch (event.type) {
      case 'cursor':
        return `${name} moved cursor`
      case 'selection':
        return `${name} selected ${event.data.elementIds?.length || 0} elements`
      case 'action':
        return `${name} ${event.data.action || 'performed an action'}`
      case 'join':
        return `${name} joined the session`
      case 'leave':
        return `${name} left the session`
      case 'update':
        return `${name} updated content`
      default:
        return `${name} performed an action`
    }
  }

  return (
    <Card className={cn("w-80 h-full flex flex-col", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Collaboration</span>
          </CardTitle>
          <div className="flex items-center space-x-1">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
              {connectionStatus}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 p-4 pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="presence" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              Team
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              <Settings className="h-3 w-3 mr-1" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="presence" className="flex-1 mt-4">
            <div className="space-y-4">
              {/* Current User */}
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback
                      style={{ backgroundColor: currentUser.color, color: 'white' }}
                    >
                      {currentUser.avatar || currentUser.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background"
                    style={{ backgroundColor: currentUser.color }}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{currentUser.name} (You)</div>
                  <div className="text-xs text-muted-foreground">
                    {currentUser.currentAction || 'Online'}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Active Collaborators */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Active Collaborators</h4>
                  <Badge variant="secondary">{activeCollaborators.length}</Badge>
                </div>

                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {activeCollaborators.map(collaborator => (
                      <div key={collaborator.id} className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={collaborator.avatar} />
                            <AvatarFallback
                              style={{ backgroundColor: collaborator.color, color: 'white' }}
                            >
                              {collaborator.avatar || collaborator.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background"
                            style={{ backgroundColor: collaborator.color }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{collaborator.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {collaborator.currentAction || 'Online'}
                          </div>
                        </div>
                        {collaborator.cursor && (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    ))}

                    {activeCollaborators.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No other collaborators online</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Invite Actions */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Invite Others</h4>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={onShareLink} className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={onCopyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="flex-1 mt-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Recent Activity</h4>

              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {events.slice(-10).reverse().map((event, index) => (
                    <div key={`${event.timestamp.getTime()}-${index}`} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div
                          className="h-2 w-2 rounded-full mt-2"
                          style={{
                            backgroundColor: collaborators.find(c => c.id === event.userId)?.color || '#666'
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{getEventDescription(event)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatEventTime(event.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {events.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No recent activity</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 mt-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Collaboration Settings</h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Show Cursors</div>
                    <div className="text-xs text-muted-foreground">
                      Display other users' cursors in real-time
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleVisibility}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="text-sm font-medium">Connection Status</div>
                  <div className="flex items-center space-x-2">
                    {isConnected ? (
                      <Wifi className="h-4 w-4 text-green-500" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm capitalize">{connectionStatus}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="text-sm font-medium">Session Info</div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Active users: {activeCollaborators.length + 1}</div>
                    <div>Total events: {events.length}</div>
                    <div>Session started: {new Date().toLocaleTimeString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
