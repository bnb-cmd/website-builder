'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Globe, 
  Palette, 
  CreditCard,
  Settings,
  Rocket,
  AlertCircle
} from 'lucide-react'

interface ChecklistStep {
  id: string
  title: string
  description: string
  completed: boolean
  required: boolean
  estimatedTime: string
}

interface OnboardingChecklist {
  completed: boolean
  steps: ChecklistStep[]
}

interface AIUsageStats {
  quotaUsed: number
  quotaRemaining: number
  quotaTotal: number
  resetDate: string | null
  usagePercentage: number
}

interface UserLimits {
  canCreateWebsite: boolean
  canCreatePage: boolean
  canCreateProduct: boolean
  canUseCustomDomain: boolean
  canUsePaymentIntegration: boolean
  canUseAdvancedAnalytics: boolean
  aiQuotaRemaining: number
  websitesCount: number
  pagesCount: number
  productsCount: number
}

interface DashboardChecklistProps {
  userId: string
  onStepClick?: (stepId: string) => void
  onStartOnboarding?: () => void
}

export function DashboardChecklist({ userId, onStepClick, onStartOnboarding }: DashboardChecklistProps) {
  const [checklist, setChecklist] = useState<OnboardingChecklist | null>(null)
  const [usageStats, setUsageStats] = useState<AIUsageStats | null>(null)
  const [userLimits, setUserLimits] = useState<UserLimits | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    try {
      const [checklistRes, usageRes, limitsRes] = await Promise.all([
        fetch(`/api/v1/ai-onboarding/checklist/${userId}`),
        fetch(`/api/v1/ai-onboarding/usage/${userId}`),
        fetch(`/api/v1/subscriptions/limits/${userId}`)
      ])

      const [checklistData, usageData, limitsData] = await Promise.all([
        checklistRes.json(),
        usageRes.json(),
        limitsRes.json()
      ])

      if (checklistData.success) setChecklist(checklistData.data)
      if (usageData.success) setUsageStats(usageData.data)
      if (limitsData.success) setUserLimits(limitsData.data)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case 'profile-setup':
        return <Sparkles className="w-5 h-5" />
      case 'first-website':
        return <Globe className="w-5 h-5" />
      case 'customize-design':
        return <Palette className="w-5 h-5" />
      case 'add-content':
        return <Settings className="w-5 h-5" />
      case 'setup-domain':
        return <Globe className="w-5 h-5" />
      case 'payment-setup':
        return <CreditCard className="w-5 h-5" />
      case 'publish-website':
        return <Rocket className="w-5 h-5" />
      default:
        return <Circle className="w-5 h-5" />
    }
  }

  const getStepColor = (step: ChecklistStep) => {
    if (step.completed) return 'text-green-600'
    if (step.required) return 'text-red-600'
    return 'text-gray-400'
  }

  const getStepBgColor = (step: ChecklistStep) => {
    if (step.completed) return 'bg-green-50 border-green-200'
    if (step.required && !step.completed) return 'bg-red-50 border-red-200'
    return 'bg-gray-50 border-gray-200'
  }

  const handleStepClick = (stepId: string) => {
    if (onStepClick) {
      onStepClick(stepId)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Loading your personalized checklist...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!checklist) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Complete your AI profile to get personalized recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Please complete the AI onboarding wizard first to get your personalized checklist.</span>
              {onStartOnboarding && (
                <Button 
                  size="sm" 
                  onClick={onStartOnboarding}
                  className="ml-4"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start AI Wizard
                </Button>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const completedSteps = checklist.steps.filter(step => step.completed).length
  const totalSteps = checklist.steps.length
  const requiredSteps = checklist.steps.filter(step => step.required).length
  const completedRequiredSteps = checklist.steps.filter(step => step.required && step.completed).length

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Progress</span>
            <Badge variant={checklist.completed ? 'default' : 'secondary'}>
              {completedSteps}/{totalSteps} Complete
            </Badge>
          </CardTitle>
          <CardDescription>
            {checklist.completed 
              ? 'Congratulations! You\'ve completed all required steps.'
              : `${completedRequiredSteps}/${requiredSteps} required steps completed`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{Math.round((completedSteps / totalSteps) * 100)}%</span>
              </div>
              <Progress value={(completedSteps / totalSteps) * 100} />
            </div>
            
            {usageStats && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>AI Usage</span>
                  <span>{usageStats.quotaUsed}/{usageStats.quotaTotal} tokens</span>
                </div>
                <Progress 
                  value={usageStats.usagePercentage} 
                  className={usageStats.usagePercentage > 80 ? 'text-red-600' : ''}
                />
                {usageStats.usagePercentage > 80 && (
                  <p className="text-sm text-red-600 mt-1">
                    You're running low on AI quota. Consider upgrading your plan.
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Checklist Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>
            Follow these steps to build your perfect website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {checklist.steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${getStepBgColor(step)}`}
                onClick={() => handleStepClick(step.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={getStepColor(step)}>
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      getStepIcon(step.id)
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{step.title}</h4>
                      <div className="flex items-center space-x-2">
                        {step.required && !step.completed && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {step.estimatedTime}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  </div>
                  {!step.completed && (
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Limits Overview */}
      {userLimits && (
        <Card>
          <CardHeader>
            <CardTitle>Your Plan Limits</CardTitle>
            <CardDescription>
              Current usage and available features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{userLimits.websitesCount}</div>
                <div className="text-sm text-gray-600">Websites</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{userLimits.pagesCount}</div>
                <div className="text-sm text-gray-600">Pages</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{userLimits.productsCount}</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{userLimits.aiQuotaRemaining}</div>
                <div className="text-sm text-gray-600">AI Quota</div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Custom Domain</span>
                <Badge variant={userLimits.canUseCustomDomain ? 'default' : 'secondary'}>
                  {userLimits.canUseCustomDomain ? 'Available' : 'Upgrade Required'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Payment Integration</span>
                <Badge variant={userLimits.canUsePaymentIntegration ? 'default' : 'secondary'}>
                  {userLimits.canUsePaymentIntegration ? 'Available' : 'Upgrade Required'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Advanced Analytics</span>
                <Badge variant={userLimits.canUseAdvancedAnalytics ? 'default' : 'secondary'}>
                  {userLimits.canUseAdvancedAnalytics ? 'Available' : 'Upgrade Required'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to get you started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-auto p-4 justify-start"
              onClick={() => handleStepClick('first-website')}
            >
              <Globe className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Create Website</div>
                <div className="text-sm text-gray-600">Start building your first website</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 justify-start"
              onClick={() => handleStepClick('customize-design')}
            >
              <Palette className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Customize Design</div>
                <div className="text-sm text-gray-600">Apply your brand colors</div>
              </div>
            </Button>
            
            {userLimits?.canUseCustomDomain && (
              <Button 
                variant="outline" 
                className="h-auto p-4 justify-start"
                onClick={() => handleStepClick('setup-domain')}
              >
                <Settings className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Setup Domain</div>
                  <div className="text-sm text-gray-600">Connect your custom domain</div>
                </div>
              </Button>
            )}
            
            {userLimits?.canUsePaymentIntegration && (
              <Button 
                variant="outline" 
                className="h-auto p-4 justify-start"
                onClick={() => handleStepClick('payment-setup')}
              >
                <CreditCard className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Setup Payments</div>
                  <div className="text-sm text-gray-600">Configure payment gateways</div>
                </div>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
