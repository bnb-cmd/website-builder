'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, Send, ArrowRight, Mic, MicOff, Palette, Globe, Zap, Users, BarChart3, Search, Image, FileText, PersonStanding } from 'lucide-react'
import { anonymousSessionManager } from '@/lib/anonymousSession'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: number
  metadata?: {
    suggestions?: string[]
    quickActions?: Array<{ label: string; value: string }>
  }
}

interface AIConversationOnboardingProps {
  onComplete: (websiteId: string) => void
  onRegisterRequired: () => void
}

export function AIConversationOnboarding({ onComplete, onRegisterRequired }: AIConversationOnboardingProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initializeConversation()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initializeConversation = async () => {
    try {
      // Get or create anonymous session
      const session = anonymousSessionManager.getOrCreateSession()
      setSessionId(session.id)

      // Start conversation with backend
      const response = await fetch('/api/v1/conversation/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id })
      })

      const result = await response.json()
      if (result.success && result.data.messages) {
        setMessages(result.data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp).getTime()
        })))
      }
    } catch (error) {
      console.error('Failed to initialize conversation:', error)
    }
  }

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return

    setIsLoading(true)
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: message,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Update anonymous session
    anonymousSessionManager.addMessage('user', message)

    try {
      const response = await fetch('/api/v1/conversation/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message
        })
      })

      const result = await response.json()
      if (result.success) {
        const aiMessage: Message = {
          ...result.data.aiResponse,
          timestamp: new Date(result.data.aiResponse.timestamp).getTime()
        }
        
        setMessages(prev => [...prev, aiMessage])
        anonymousSessionManager.addMessage('ai', aiMessage.content)

        // Check if we should generate website
        if (result.data.session.currentStep === 'generating') {
          setTimeout(() => {
            handleGenerateWebsite()
          }, 1500)
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateWebsite = async () => {
    setIsGenerating(true)
    
    // Show generating message
    const generatingMessage: Message = {
      id: `ai-${Date.now()}`,
      type: 'ai',
      content: '✨ Creating your website... This will take just a moment!',
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, generatingMessage])

    // Trigger registration modal after a delay
    setTimeout(() => {
      onRegisterRequired()
    }, 3000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputValue)
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // TODO: Implement actual voice recording
  }

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      'create': 'I want to create a new website for my business',
      'template': 'Show me some website templates',
      'ai-help': 'Help me design my website with AI',
      'analytics': 'I need help with website analytics',
      'customize': 'I want to customize my existing website'
    }
    sendMessage(actionMessages[action as keyof typeof actionMessages] || action)
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header with Announcement */}
      <div className="bg-black border-b border-gray-700/50 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AI Website Builder</h1>
                <p className="text-gray-300">Let's create something amazing</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {isGenerating && (
                <Badge variant="secondary" className="animate-pulse">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Generating...
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Headline */}
          <div className="space-y-4">
            <h2 className="text-6xl font-bold text-white leading-tight">
              Build better<br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                websites, faster
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              AI-powered website builder for Pakistan. Design freely, publish fast, and scale with AI, CMS, SEO, and more.
            </p>
          </div>

          {/* Main Input Area */}
          <div className="max-w-2xl mx-auto w-full">
            <div className="relative">
              <div className="flex items-center bg-gray-800 rounded-2xl p-2 border border-gray-600 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <div className="flex items-center px-4">
                  <Mic className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your website idea..."
                  disabled={isLoading || isGenerating}
                  className="flex-1 border-0 bg-transparent text-lg placeholder:text-gray-400 focus:ring-0 focus:outline-none text-white"
                />
                <div className="flex items-center space-x-2 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleRecording}
                    className={`p-2 ${isRecording ? 'text-red-500' : 'text-gray-400'}`}
                  >
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </Button>
                  <Button
                    onClick={() => sendMessage(inputValue)}
                    disabled={!inputValue.trim() || isLoading || isGenerating}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl px-6"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-3">
              Press Enter to send • Shift + Enter for new line
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            <Button
              variant="outline"
              onClick={() => handleQuickAction('create')}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl border-gray-500 hover:border-blue-400 hover:bg-gray-800 text-white bg-gray-800/50"
            >
              <Palette className="w-4 h-4" />
              <span>Create Website</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickAction('template')}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl border-gray-500 hover:border-blue-400 hover:bg-gray-800 text-white bg-gray-800/50"
            >
              <Globe className="w-4 h-4" />
              <span>Choose Template</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickAction('ai-help')}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl border-gray-500 hover:border-blue-400 hover:bg-gray-800 text-white bg-gray-800/50"
            >
              <Zap className="w-4 h-4" />
              <span>AI Assistant</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickAction('analytics')}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl border-gray-500 hover:border-blue-400 hover:bg-gray-800 text-white bg-gray-800/50"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickAction('customize')}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl border-gray-500 hover:border-blue-400 hover:bg-gray-800 text-white bg-gray-800/50"
            >
              <Users className="w-4 h-4" />
              <span>Customize</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Container - Only show when there are messages */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto px-6 py-8 bg-gray-900/50">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.type === 'ai' && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-blue-500/20">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <Card className="p-4 bg-gray-800/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl">
                          <p className="text-gray-100 whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        </Card>
                        
                        {/* Quick Actions */}
                        {message.metadata?.quickActions && message.metadata.quickActions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {message.metadata.quickActions.map((action, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickAction(action.value)}
                                className="text-sm bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white border border-blue-500/30 rounded-xl px-4 py-2 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                              >
                                {action.label}
                                <ArrowRight className="w-3 h-3 ml-1" />
                              </Button>
                            ))}
                          </div>
                        )}

                        {/* Suggestions */}
                        {message.metadata?.suggestions && message.metadata.suggestions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs text-gray-400">Suggestions:</p>
                            {message.metadata.suggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => sendMessage(suggestion)}
                                className="block w-full text-left px-4 py-3 text-sm bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-all duration-200 text-gray-100 hover:text-white backdrop-blur-sm border border-gray-700/50 hover:border-gray-600"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {message.type === 'user' && (
                    <Card className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg border-0 rounded-2xl backdrop-blur-sm">
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </Card>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-blue-500/20">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <Card className="p-4 bg-gray-800/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </Card>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="bg-black border-t border-gray-700/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span>Enhanced</span>
            </Button>
            <span className="text-xs text-gray-400">Display a menu</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <span>Accessi</span>
            </Button>
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 via-yellow-400 to-blue-500 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-br from-green-300 to-blue-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
