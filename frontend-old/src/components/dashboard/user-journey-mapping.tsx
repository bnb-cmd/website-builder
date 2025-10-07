'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  Circle,
  ArrowRight,
  Zap,
  Globe,
  Palette,
  CreditCard,
  Bell,
  Sparkles
} from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'
import { apiHelpers } from '@/lib/api'

interface JourneyStep {
  id: string
  title: string
  description: string
  icon: any
  completed: boolean
  current: boolean
  action: () => void
  estimatedTime: string
  reward?: string
}

interface UserJourneyMappingProps {
  userId: string
  compact?: boolean
}

export function UserJourneyMapping({ userId, compact = false }: UserJourneyMappingProps) {
  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>([])
  const [userProgress, setUserProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    loadUserProgress()
  }, [userId])

  const loadUserProgress = async () => {
    try {
      // In a real app, this would fetch from your API
      // For now, we'll simulate based on localStorage or mock data
      const progress = JSON.parse(localStorage.getItem('userJourney') || '{}')

      const steps: JourneyStep[] = [
        {
          id: 'first-website',
          title: 'Create Your First Website',
          description: 'Build your first website using our templates and editor',
          icon: Globe,
          completed: progress.firstWebsite || false,
          current: !progress.firstWebsite,
          action: () => router.push('/dashboard/websites/new'),
          estimatedTime: '15 min',
          reward: '🏆 First Website Badge'
        },
        {
          id: 'customize-design',
          title: 'Customize Your Design',
          description: 'Use our visual editor to customize colors, fonts, and layout',
          icon: Palette,
          completed: progress.customizedDesign || false,
          current: progress.firstWebsite && !progress.customizedDesign,
          action: () => router.push('/dashboard/websites'),
          estimatedTime: '10 min',
          reward: '🎨 Design Master Badge'
        },
        {
          id: 'setup-domain',
          title: 'Connect Custom Domain',
          description: 'Make your website professional with a custom domain',
          icon: Globe,
          completed: progress.domainSetup || false,
          current: progress.customizedDesign && !progress.domainSetup,
          action: () => router.push('/dashboard/domains'),
          estimatedTime: '5 min',
          reward: '🌐 Domain Expert Badge'
        },
        {
          id: 'enable-analytics',
          title: 'Enable Analytics',
          description: 'Track your website performance and visitor insights',
          icon: Zap,
          completed: progress.analyticsEnabled || false,
          current: progress.domainSetup && !progress.analyticsEnabled,
          action: () => router.push('/dashboard/analytics'),
          estimatedTime: '3 min',
          reward: '📊 Analytics Pro Badge'
        },
        {
          id: 'setup-payments',
          title: 'Setup Payment Integration',
          description: 'Accept payments and grow your business online',
          icon: CreditCard,
          completed: progress.paymentsSetup || false,
          current: progress.analyticsEnabled && !progress.paymentsSetup,
          action: () => router.push('/dashboard/payments'),
          estimatedTime: '8 min',
          reward: '💰 Payment Wizard Badge'
        },
        {
          id: 'explore-ai',
          title: 'Explore AI Features',
          description: 'Discover how AI can help you create better content',
          icon: Sparkles,
          completed: progress.aiExplored || false,
          current: progress.paymentsSetup && !progress.aiExplored,
          action: () => router.push('/dashboard/advanced-ai'),
          estimatedTime: '12 min',
          reward: '🤖 AI Pioneer Badge'
        }
      ]

      setJourneySteps(steps)

      // Calculate overall progress
      const completedSteps = steps.filter(step => step.completed).length
      const progressPercentage = (completedSteps / steps.length) * 100

      setUserProgress({
        completedSteps,
        totalSteps: steps.length,
        progressPercentage,
        currentStep: steps.find(step => step.current)
      })

    } catch (error) {
      console.error('Failed to load user journey:', error)
    } finally {
      setLoading(false)
    }
  }

  const completeStep = async (stepId: string) => {
    try {
      // In a real app, this would update via API
      const progress = JSON.parse(localStorage.getItem('userJourney') || '{}')
      progress[stepId] = true
      localStorage.setItem('userJourney', JSON.stringify(progress))

      // Reload progress
      await loadUserProgress()

      // Show success message or confetti
      console.log(`Step ${stepId} completed!`)

    } catch (error) {
      console.error('Failed to complete step:', error)
    }
  }

  const getJourneyStatus = () => {
    if (!userProgress) return 'getting-started'

    if (userProgress.progressPercentage === 100) return 'completed'
    if (userProgress.progressPercentage > 50) return 'advanced'
    if (userProgress.progressPercentage > 25) return 'intermediate'
    return 'beginner'
  }

  const getMotivationalMessage = () => {
    const status = getJourneyStatus()
    switch (status) {
      case 'completed':
        return '🎉 Congratulations! You\'re a Website Builder expert!'
      case 'advanced':
        return '🚀 You\'re making great progress! Keep going!'
      case 'intermediate':
        return '💪 You\'re doing well! Just a few more steps to go!'
      default:
        return '🌟 Welcome! Let\'s get you started on your website journey!'
    }
  }

  if (loading) {
    return (
      <Card className={compact ? 'p-4' : ''}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-6 bg-muted animate-pulse rounded w-1/3" />
            <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
            <div className="h-2 bg-muted animate-pulse rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (compact) {
    return (
      <Card className="border-2 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">Your Journey</span>
            </div>
            <Badge variant="secondary">
              {userProgress?.completedSteps || 0}/{userProgress?.totalSteps || 0}
            </Badge>
          </div>
          <Progress value={userProgress?.progressPercentage || 0} className="mb-2" />
          <p className="text-xs text-muted-foreground mb-3">
            {getMotivationalMessage()}
          </p>
          {userProgress?.currentStep && (
            <Button
              size="sm"
              onClick={userProgress.currentStep.action}
              className="w-full"
            >
              Continue: {userProgress.currentStep.title}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span>Your Website Builder Journey</span>
        </CardTitle>
        <div className="space-y-2">
          <Progress value={userProgress?.progressPercentage || 0} className="w-full" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{userProgress?.completedSteps || 0} of {userProgress?.totalSteps || 0} steps completed</span>
            <span>{Math.round(userProgress?.progressPercentage || 0)}% complete</span>
          </div>
          <p className="text-sm font-medium text-foreground">
            {getMotivationalMessage()}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {journeySteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                step.completed
                  ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                  : step.current
                    ? 'bg-primary/5 border-primary/20'
                    : 'bg-muted/30 border-muted'
              }`}
            >
              {/* Step Icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                step.completed
                  ? 'bg-green-500 text-white'
                  : step.current
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
              }`}>
                {step.completed ? (
                  <CheckCircle className="h-4 w-4" />
                ) : step.current ? (
                  <step.icon className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`font-medium ${step.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {step.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Zap className="h-3 w-3 mr-1" />
                        {step.estimatedTime}
                      </span>
                      {step.reward && (
                        <span>{step.reward}</span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0 ml-4">
                    {step.completed ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        ✓ Completed
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant={step.current ? "default" : "outline"}
                        onClick={step.action}
                      >
                        {step.current ? 'Continue' : 'Start'}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium mb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/websites/new')}>
              <Globe className="h-4 w-4 mr-2" />
              New Website
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/templates')}>
              <Palette className="h-4 w-4 mr-2" />
              Browse Templates
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/advanced-ai')}>
              <Sparkles className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
