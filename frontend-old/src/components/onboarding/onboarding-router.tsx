'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AIConversationOnboarding } from './ai-conversation-onboarding'
import { ContextualRegistrationModal } from '../auth/contextual-registration-modal'
import { anonymousSessionManager } from '@/lib/anonymousSession'

interface OnboardingRouterProps {
  userId?: string
  onComplete?: () => void
}

export function OnboardingRouter({ userId, onComplete }: OnboardingRouterProps) {
  const router = useRouter()
  const [showRegistration, setShowRegistration] = useState(false)
  const [websiteId, setWebsiteId] = useState<string | null>(null)

  const handleConversationComplete = (generatedWebsiteId: string) => {
    setWebsiteId(generatedWebsiteId)
    // Website generation complete, but we need user to register
  }

  const handleRegisterRequired = () => {
    setShowRegistration(true)
  }

  const handleRegistrationSuccess = async (user: any) => {
    try {
      // Get anonymous session
      const session = anonymousSessionManager.getSession()
      
      if (session) {
        // Convert anonymous session to user session
        const response = await fetch('/api/v1/conversation/generate-website', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: session.id,
            userId: user.id
          })
        })

        const result = await response.json()
        
        if (result.success) {
          // Clear anonymous session
          anonymousSessionManager.clearSession()
          
          // Redirect to editor or dashboard
          if (result.data.websiteId) {
            router.push(`/editor?websiteId=${result.data.websiteId}`)
          } else {
            router.push('/dashboard')
          }
          
          if (onComplete) {
            onComplete()
          }
        }
      }
    } catch (error) {
      console.error('Failed to convert session:', error)
    }
    
    setShowRegistration(false)
  }

  const handleRegistrationClose = () => {
    setShowRegistration(false)
  }

  // If user is already authenticated, redirect to dashboard
  if (userId) {
    router.push('/dashboard')
    return null
  }

  return (
    <>
      <AIConversationOnboarding
        onComplete={handleConversationComplete}
        onRegisterRequired={handleRegisterRequired}
      />

      <ContextualRegistrationModal
        isOpen={showRegistration}
        onClose={handleRegistrationClose}
        onSuccess={handleRegistrationSuccess}
        trigger="save_website"
        context={{
          websiteName: anonymousSessionManager.getSession()?.conversationData.businessName || 'Your Website',
          timeSpent: '5 minutes'
        }}
      />
    </>
  )
}
