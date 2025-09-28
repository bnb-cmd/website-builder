'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  MessageSquare, 
  Video, 
  Share2, 
  Lock,
  Unlock,
  Edit,
  Eye,
  UserPlus,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Paperclip,
  Mic,
  Phone,
  MoreVertical,
  Circle,
  ArrowLeft,
  ArrowRight,
  MousePointer,
  Hash,
  AtSign,
  GitBranch,
  History
} from 'lucide-react'

interface CollaborationPanelProps {
  websiteId: string
  currentUser: {
    id: string
    name: string
    email: string
    avatar?: string
    role: 'owner' | 'admin' | 'editor' | 'viewer'
  }
}

interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  status: 'online' | 'offline' | 'away'
  lastActive?: Date
  currentPage?: string
}

interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  timestamp: Date
  elementId?: string
  resolved: boolean
  replies: Comment[]
}

interface Activity {
  id: string
  userId: string
  userName: string
  action: string
  target?: string
  timestamp: Date
  type: 'edit' | 'comment' | 'share' | 'publish'
}

export function CollaborationPanel({ websiteId, currentUser }: CollaborationPanelProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      avatar: currentUser.avatar,
      role: currentUser.role,
      status: 'online',
      currentPage: 'Homepage'
    },
    {
      id: '2',
      name: 'Sarah Ahmed',
      email: 'sarah@example.com',
      role: 'editor',
      status: 'online',
      currentPage: 'About Page'
    },
    {
      id: '3',
      name: 'Ali Hassan',
      email: 'ali@example.com',
      role: 'viewer',
      status: 'away',
      lastActive: new Date(Date.now() - 900000) // 15 mins ago
    }
  ])

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      userId: '2',
      userName: 'Sarah Ahmed',
      content: 'The hero section looks great! Can we make the CTA button more prominent?',
      timestamp: new Date(Date.now() - 3600000),
      elementId: 'hero-1',
      resolved: false,
      replies: [
        {
          id: '2',
          userId: currentUser.id,
          userName: currentUser.name,
          content: 'Sure, I\'ll increase the size and add a shadow effect.',
          timestamp: new Date(Date.now() - 1800000),
          resolved: false,
          replies: []
        }
      ]
    }
  ])

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'updated the hero section',
      timestamp: new Date(Date.now() - 300000),
      type: 'edit'
    },
    {
      id: '2',
      userId: '2',
      userName: 'Sarah Ahmed',
      action: 'added a comment',
      target: 'hero section',
      timestamp: new Date(Date.now() - 3600000),
      type: 'comment'
    }
  ])

  const [newComment, setNewComment] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('viewer')
  const [activeTab, setActiveTab] = useState('team')

  // Simulated real-time cursor positions
  const [cursors, setCursors] = useState<Record<string, { x: number; y: number; color: string }>>({})

  const rolePermissions = {
    owner: 'Full access - Can manage team, billing, and all content',
    admin: 'Can edit content, manage team members, and publish',
    editor: 'Can edit content and leave comments',
    viewer: 'Can view content and leave comments only'
  }

  const roleColors = {
    owner: 'bg-purple-500',
    admin: 'bg-blue-500',
    editor: 'bg-green-500',
    viewer: 'bg-gray-500'
  }

  const addComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: newComment,
      timestamp: new Date(),
      resolved: false,
      replies: []
    }

    setComments([comment, ...comments])
    setNewComment('')

    // Add to activity log
    const activity: Activity = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'added a comment',
      timestamp: new Date(),
      type: 'comment'
    }
    setActivities([activity, ...activities])
  }

  const inviteTeamMember = () => {
    if (!inviteEmail || !inviteEmail.includes('@')) return

    // In a real app, this would send an invitation
    console.log(`Inviting ${inviteEmail} as ${inviteRole}`)
    setInviteEmail('')
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-lg">Collaboration</h3>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="team" className="flex-1">
            <Users className="h-4 w-4 mr-1" />
            Team
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex-1">
            <MessageSquare className="h-4 w-4 mr-1" />
            Comments
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex-1">
            <Clock className="h-4 w-4 mr-1" />
            Activity
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="team" className="p-4 mt-0">
            <div className="space-y-4">
              {/* Active Team Members */}
              <div>
                <h4 className="text-sm font-medium mb-3">Active Now ({teamMembers.filter(m => m.status === 'online').length})</h4>
                <div className="space-y-3">
                  {teamMembers.filter(m => m.status === 'online').map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.currentPage && `Editing ${member.currentPage}`}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`${roleColors[member.role]} bg-opacity-10`}>
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Team Members */}
              <div>
                <h4 className="text-sm font-medium mb-3">Team Members</h4>
                <div className="space-y-3">
                  {teamMembers.filter(m => m.status !== 'online').map((member) => (
                    <div key={member.id} className="flex items-center justify-between opacity-60">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.lastActive && `Last seen ${formatTimestamp(member.lastActive)}`}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{member.role}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invite Team Member */}
              {(currentUser.role === 'owner' || currentUser.role === 'admin') && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Invite Team Member</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="invite-email" className="text-xs">Email Address</Label>
                      <Input
                        id="invite-email"
                        type="email"
                        placeholder="colleague@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="invite-role" className="text-xs">Role</Label>
                      <Select value={inviteRole} onValueChange={(v: TeamMember['role']) => setInviteRole(v)}>
                        <SelectTrigger id="invite-role" className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        {rolePermissions[inviteRole]}
                      </p>
                    </div>
                    <Button size="sm" className="w-full" onClick={inviteTeamMember}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Send Invite
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Collaboration Tools */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4 mr-2" />
                  Start Call
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Link
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="p-4 mt-0">
            <div className="space-y-4">
              {/* Add Comment */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Leave a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={addComment} disabled={!newComment.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Comment
                  </Button>
                  <Button size="sm" variant="outline">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id} className={comment.resolved ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.userAvatar} />
                          <AvatarFallback>{getInitials(comment.userName)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium">{comment.userName}</p>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(comment.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                          
                          {comment.elementId && (
                            <Button variant="link" size="sm" className="px-0 h-auto mt-1">
                              <MousePointer className="h-3 w-3 mr-1" />
                              View on page
                            </Button>
                          )}

                          {/* Replies */}
                          {comment.replies.length > 0 && (
                            <div className="mt-3 space-y-2 pl-4 border-l-2">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex items-start gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={reply.userAvatar} />
                                    <AvatarFallback className="text-xs">
                                      {getInitials(reply.userName)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <p className="text-xs">
                                      <span className="font-medium">{reply.userName}</span>
                                      <span className="text-muted-foreground ml-2">
                                        {formatTimestamp(reply.timestamp)}
                                      </span>
                                    </p>
                                    <p className="text-sm mt-1">{reply.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-2">
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              Reply
                            </Button>
                            {!comment.resolved && (
                              <Button variant="ghost" size="sm" className="h-7 px-2">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Resolve
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="p-4 mt-0">
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${activity.type === 'edit' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'comment' ? 'bg-green-100 text-green-600' :
                      activity.type === 'share' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }
                  `}>
                    {activity.type === 'edit' ? <Edit className="h-4 w-4" /> :
                     activity.type === 'comment' ? <MessageSquare className="h-4 w-4" /> :
                     activity.type === 'share' ? <Share2 className="h-4 w-4" /> :
                     <Globe className="h-4 w-4" />
                    }
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.userName}</span>
                      {' '}{activity.action}
                      {activity.target && (
                        <span className="text-muted-foreground"> on {activity.target}</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" className="w-full mt-4">
              <History className="h-4 w-4 mr-2" />
              View Full History
            </Button>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
