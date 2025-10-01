'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, Send, ArrowRight } from 'lucide-react'
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

  const handleQuickAction = (value: string) => {
    sendMessage(value)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">AI Website Builder</h1>
              <p className="text-sm text-gray-600">Let's create something amazing</p>
            </div>
          </div>
          {isGenerating && (
            <Badge variant="secondary" className="animate-pulse">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Generating...
            </Badge>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {message.type === 'ai' && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <Card className="p-4 bg-white shadow-sm">
                        <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
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
                              className="text-sm"
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
                          <p className="text-xs text-gray-500">Suggestions:</p>
                          {message.metadata.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => sendMessage(suggestion)}
                              className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
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
                  <Card className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-sm">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </Card>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <Card className="p-4 bg-white shadow-sm">
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

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading || isGenerating}
              className="flex-1 bg-white"
            />
            <Button
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading || isGenerating}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
