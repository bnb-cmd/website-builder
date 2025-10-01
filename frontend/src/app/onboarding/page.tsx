'use client'

import { OnboardingRouter } from '@/components/onboarding/onboarding-router'
import { useAuth } from '@/components/auth/auth-provider'

export default function OnboardingPage() {
  const { user } = useAuth()

  return (
    <OnboardingRouter 
      userId={user?.id}
      onComplete={() => {
        console.log('Onboarding complete!')
      }}
    />
  )
}
