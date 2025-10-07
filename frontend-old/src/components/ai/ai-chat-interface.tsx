'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Code,
  Palette, 
  BarChart3,
  FileText,
  Sparkles,
  Loader2
} from 'lucide-react'
import { apiHelpers } from '@/lib/api'

interface AISession {
  id: string
  sessionId: string
  type: string
  status: string
  messageCount: number
  tokenUsage: number
  cost: number
  createdAt: string
  updatedAt: string
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

interface AIChatInterfaceProps {
  websiteId: string
  userId?: string
}

const sessionTypes = [
  { value: 'CHAT', label: 'General Chat', icon: MessageCircle, color: 'bg-blue-900' },
  { value: 'CODE_GENERATION', label: 'Code Generation', icon: Code, color: 'bg-green-500' },
  { value: 'CONTENT_CREATION', label: 'Content Creation', icon: FileText, color: 'bg-purple-500' },
  { value: 'DESIGN_ASSISTANCE', label: 'Design Help', icon: Palette, color: 'bg-pink-500' },
  { value: 'ANALYSIS', label: 'Data Analysis', icon: BarChart3, color: 'bg-orange-500' }
]

export function AIChatInterface({ websiteId, userId }: AIChatInterfaceProps) {
  const [sessions, setSessions] = useState<AISession[]>([])
  const [activeSession, setActiveSession] = useState<AISession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedType, setSelectedType] = useState('CHAT')

  useEffect(() => {
    loadSessions()
  }, [websiteId])

  const loadSessions = async () => {
    try {
      const response = await apiHelpers.getAISessions(websiteId)
      const data = response.data
      setSessions(data)
      if (data.length > 0 && !activeSession) {
        setActiveSession(data[0])
        loadSessionMessages(data[0].sessionId)
      }
    } catch (error) {
      console.error('Failed to load AI sessions:', error)
    }
  }

  const loadSessionMessages = async (sessionId: string) => {
    try {
      const session = sessions.find(s => s.sessionId === sessionId)
      if (session) {
        // Mock messages - in reality, you'd fetch from the session history
        setMessages([
          {
            role: 'assistant',
            content: `Hello! I'm your AI assistant for ${sessionTypes.find(t => t.value === session.type)?.label.toLowerCase()}. How can I help you today?`,
            timestamp: new Date(session.createdAt)
          }
        ])
      }
    } catch (error) {
      console.error('Failed to load session messages:', error)
    }
  }

  const createNewSession = async () => {
    try {
      setIsLoading(true)
      const response = await apiHelpers.createAISession({
        websiteId,
        userId,
        type: selectedType as any
      })
      const session = response.data
      setSessions(prev => [session, ...prev])
      setActiveSession(session)
      setMessages([
        {
          role: 'assistant',
          content: `Hello! I'm your AI assistant for ${sessionTypes.find(t => t.value === selectedType)?.label.toLowerCase()}. How can I help you today?`,
          timestamp: new Date()
        }
      ])
    } catch (error) {
      console.error('Failed to create AI session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeSession) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: newMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsLoading(true)

    try {
      const response = await apiHelpers.sendAIMessage(activeSession.sessionId, newMessage)
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.response || response.data.message || 'No response received',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Update session stats
      setSessions(prev => prev.map(s => 
        s.sessionId === activeSession.sessionId 
          ? { ...s, messageCount: s.messageCount + 1, tokenUsage: s.tokenUsage + (response.data.tokensUsed || 0), cost: s.cost + (response.data.cost || 0) }
          : s
      ))
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="h-full flex">
      {/* Sessions Sidebar */}
      <div className="w-80 border-r bg-gray-50/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">AI Sessions</h3>
          <Button
            size="sm"
            onClick={createNewSession}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            New Session
          </Button>
        </div>

        {/* Session Type Selector */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Session Type</label>
          <div className="grid grid-cols-2 gap-2">
            {sessionTypes.map((type) => {
              const Icon = type.icon
              return (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.value)}
                  className={`h-auto p-2 flex flex-col items-center ${
                    selectedType === type.value ? type.color : ''
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span className="text-xs">{type.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Sessions List */}
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {sessions.map((session) => {
              const sessionType = sessionTypes.find(t => t.value === session.type)
              const Icon = sessionType?.icon || MessageCircle
              return (
                <Card
                  key={session.id}
                  className={`cursor-pointer transition-colors ${
                    activeSession?.id === session.id ? 'ring-2 ring-blue-900' : ''
                  }`}
                  onClick={() => {
                    setActiveSession(session)
                    loadSessionMessages(session.sessionId)
                  }}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">{sessionType?.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {session.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Messages: {session.messageCount}</div>
                      <div>Tokens: {session.tokenUsage}</div>
                      <div>Cost: ${session.cost.toFixed(4)}</div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        {activeSession ? (
          <>
            {/* Chat Header */}
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {sessionTypes.find(t => t.value === activeSession.type)?.label}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Session ID: {activeSession.sessionId}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  <div>Messages: {activeSession.messageCount}</div>
                  <div>Cost: ${activeSession.cost.toFixed(4)}</div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3xl flex space-x-2 ${
                        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === 'user' 
                            ? 'bg-blue-900 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      <div
                      className={`rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-blue-900 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No Active Session
              </h3>
              <p className="text-gray-500 mb-4">
                Create a new AI session to start chatting
              </p>
              <Button
                onClick={createNewSession}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start New Session
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
