import React, { useEffect, useState, useRef } from 'react'
import { GuidedStep, GuidedWorkflow } from '@/hooks/use-guided-editor'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  SkipForward,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react'

interface GuidedTourProps {
  workflow: GuidedWorkflow | null
  currentStep: number
  isActive: boolean
  onComplete: () => void
  onSkip: () => void
  onClose: () => void
  className?: string
}

export function GuidedTour({
  workflow,
  currentStep,
  isActive,
  onComplete,
  onSkip,
  onClose,
  className
}: GuidedTourProps) {
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const currentStepData = workflow?.steps[currentStep]

  // Highlight target element
  useEffect(() => {
    if (!currentStepData?.target || !isActive) {
      setHighlightedElement(null)
      return
    }

    const element = document.querySelector(currentStepData.target)
    setHighlightedElement(element)

    if (element && tooltipRef.current) {
      updateTooltipPosition(element, currentStepData.position)
    }
  }, [currentStepData, isActive])

  const updateTooltipPosition = (element: Element, position: GuidedStep['position']) => {
    if (!tooltipRef.current) return

    const rect = element.getBoundingClientRect()
    const tooltip = tooltipRef.current
    const tooltipRect = tooltip.getBoundingClientRect()

    let top = 0
    let left = 0

    switch (position) {
      case 'top':
        top = rect.top - tooltipRect.height - 10
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2)
        break
      case 'bottom':
        top = rect.bottom + 10
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2)
        break
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipRect.height / 2)
        left = rect.left - tooltipRect.width - 10
        break
      case 'right':
        top = rect.top + (rect.height / 2) - (tooltipRect.height / 2)
        left = rect.right + 10
        break
      case 'center':
        top = window.innerHeight / 2 - tooltipRect.height / 2
        left = window.innerWidth / 2 - tooltipRect.width / 2
        break
    }

    // Keep tooltip within viewport
    top = Math.max(10, Math.min(top, window.innerHeight - tooltipRect.height - 10))
    left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10))

    setTooltipPosition({ top, left })
  }

  const handleNext = () => {
    if (currentStepData?.actionRequired) {
      // Wait for user action
      return
    }
    onComplete()
  }

  const handlePrevious = () => {
    // This would need to be implemented in the parent hook
    console.log('Previous step')
  }

  if (!isActive || !workflow || !currentStepData) {
    return null
  }

  const progress = ((currentStep + 1) / workflow.steps.length) * 100
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === workflow.steps.length - 1

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-40 pointer-events-none"
        style={{
          background: highlightedElement
            ? 'radial-gradient(circle, transparent 0%, rgba(0,0,0,0.5) 70%)'
            : 'rgba(0,0,0,0.5)'
        }}
      />

      {/* Highlight */}
      {highlightedElement && (
        <div
          className="fixed z-50 pointer-events-none border-2 border-primary rounded-lg shadow-lg"
          style={{
            top: highlightedElement.getBoundingClientRect().top - 4,
            left: highlightedElement.getBoundingClientRect().left - 4,
            width: highlightedElement.getBoundingClientRect().width + 8,
            height: highlightedElement.getBoundingClientRect().height + 8,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
            borderRadius: '8px'
          }}
        />
      )}

      {/* Tooltip */}
      <Card
        ref={tooltipRef}
        className={cn(
          "fixed z-50 w-80 shadow-2xl border-2 border-primary",
          className
        )}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {currentStep + 1} of {workflow.steps.length}
              </Badge>
              <CardTitle className="text-sm">{currentStepData.title}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {currentStepData.description}
          </div>

          <div className="text-sm">
            {currentStepData.content}
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Action Required Indicator */}
          {currentStepData.actionRequired && (
            <div className="flex items-center space-x-2 p-2 bg-amber-50 dark:bg-amber-950 rounded border border-amber-200 dark:border-amber-800">
              <Target className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-800 dark:text-amber-200">
                {currentStepData.actionLabel || 'Complete this action to continue'}
              </span>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              {!isFirstStep && (
                <Button variant="outline" size="sm" onClick={handlePrevious}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
              )}

              {currentStepData.canSkip !== false && (
                <Button variant="ghost" size="sm" onClick={onSkip}>
                  <SkipForward className="h-4 w-4 mr-1" />
                  Skip
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{workflow.estimatedTime} min</span>
              </div>

              <Button
                onClick={handleNext}
                disabled={currentStepData.actionRequired}
                size="sm"
              >
                {isLastStep ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Complete
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Info */}
      <Card className="fixed bottom-4 left-4 w-80 z-50 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{workflow.icon}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{workflow.name}</h4>
              <p className="text-xs text-muted-foreground">{workflow.description}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {workflow.difficulty}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
