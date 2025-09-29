import { useState, useEffect, useCallback, useRef } from 'react'

export interface GuidedStep {
  id: string
  title: string
  description: string
  target?: string // CSS selector for highlighting
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
  content: React.ReactNode
  actionRequired?: boolean
  actionLabel?: string
  onAction?: () => void
  canSkip?: boolean
  prerequisites?: string[] // IDs of steps that must be completed first
}

export interface GuidedWorkflow {
  id: string
  name: string
  description: string
  icon: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number // in minutes
  steps: GuidedStep[]
  category: 'getting-started' | 'design' | 'content' | 'functionality' | 'publishing'
  prerequisites?: string[]
}

export interface GuidedProgress {
  completedSteps: string[]
  currentWorkflow: string | null
  currentStep: number
  skippedSteps: string[]
  timeSpent: number // in seconds
  startedAt: Date | null
  completedAt: Date | null
}

export interface UseGuidedEditorOptions {
  userId: string
  autoStart?: boolean
  showHints?: boolean
  enableTutorials?: boolean
}

export function useGuidedEditor(options: UseGuidedEditorOptions) {
  const { userId, autoStart = true, showHints = true, enableTutorials = true } = options

  const [workflows] = useState<GuidedWorkflow[]>([
    {
      id: 'welcome',
      name: 'Welcome to the Editor',
      description: 'Learn the basics of our visual editor',
      icon: '🎨',
      difficulty: 'beginner',
      estimatedTime: 5,
      category: 'getting-started',
      steps: [
        {
          id: 'welcome-intro',
          title: 'Welcome!',
          description: 'Let\'s get you started with the editor',
          position: 'center',
          content: (
            <div className="text-center space-y-4">
              <div className="text-2xl">🎉</div>
              <h3 className="text-lg font-semibold">Welcome to Pakistan Website Builder!</h3>
              <p>This guided tour will help you create your first website in minutes.</p>
            </div>
          ),
          canSkip: false
        },
        {
          id: 'toolbar-intro',
          title: 'The Toolbar',
          description: 'Your main controls are here',
          target: '[data-toolbar]',
          position: 'bottom',
          content: (
            <div className="space-y-2">
              <h4 className="font-semibold">Toolbar Overview</h4>
              <p>The toolbar contains all your editing tools:</p>
              <ul className="text-sm space-y-1">
                <li>• Undo/Redo buttons</li>
                <li>• View mode toggles</li>
                <li>• Component library access</li>
                <li>• Save and preview options</li>
              </ul>
            </div>
          )
        },
        {
          id: 'component-library',
          title: 'Component Library',
          description: 'Add elements to your page',
          target: '[data-component-library]',
          position: 'right',
          content: (
            <div className="space-y-2">
              <h4 className="font-semibold">Component Library</h4>
              <p>Drag and drop components from here to build your website:</p>
              <ul className="text-sm space-y-1">
                <li>• Text, images, and buttons</li>
                <li>• Forms and navigation</li>
                <li>• Advanced components</li>
                <li>• Custom elements</li>
              </ul>
            </div>
          ),
          actionRequired: true,
          actionLabel: 'Try dragging a component',
          onAction: () => console.log('Component dragged')
        }
      ]
    },
    {
      id: 'hero-section',
      name: 'Create a Hero Section',
      description: 'Build an impressive landing page header',
      icon: '🚀',
      difficulty: 'beginner',
      estimatedTime: 8,
      category: 'design',
      prerequisites: ['welcome'],
      steps: [
        {
          id: 'hero-concept',
          title: 'Hero Section Concept',
          description: 'A hero section is your first impression',
          position: 'center',
          content: (
            <div className="space-y-4">
              <h4 className="font-semibold">What is a Hero Section?</h4>
              <p>A hero section is the large banner area at the top of your website that introduces visitors to your brand, product, or service.</p>
              <div className="bg-muted p-4 rounded">
                <p className="text-sm">💡 <strong>Best practices:</strong></p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Use a compelling headline</li>
                  <li>• Include a clear call-to-action</li>
                  <li>• Add relevant imagery</li>
                  <li>• Keep it mobile-friendly</li>
                </ul>
              </div>
            </div>
          )
        },
        {
          id: 'add-background',
          title: 'Add Background',
          description: 'Start with a background image or color',
          target: '[data-canvas]',
          position: 'top',
          content: (
            <div className="space-y-2">
              <h4 className="font-semibold">Background Setup</h4>
              <p>Let's start by adding a background to your hero section:</p>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Click on the canvas background</li>
                <li>Open the properties panel</li>
                <li>Upload or select a background image</li>
                <li>Adjust overlay and positioning</li>
              </ol>
            </div>
          ),
          actionRequired: true,
          actionLabel: 'Set a background',
          onAction: () => console.log('Background set')
        },
        {
          id: 'add-headline',
          title: 'Add Headline',
          description: 'Create a compelling headline',
          target: '[data-component-library] [data-component="heading"]',
          position: 'right',
          content: (
            <div className="space-y-2">
              <h4 className="font-semibold">Headline Creation</h4>
              <p>Your headline should:</p>
              <ul className="text-sm space-y-1">
                <li>• Be attention-grabbing</li>
                <li>• Communicate your value proposition</li>
                <li>• Be scannable and readable</li>
                <li>• Include keywords for SEO</li>
              </ul>
              <p className="text-sm mt-2">Drag a Heading component onto your canvas and customize it.</p>
            </div>
          ),
          actionRequired: true,
          actionLabel: 'Add a headline',
          onAction: () => console.log('Headline added')
        },
        {
          id: 'add-cta',
          title: 'Add Call-to-Action',
          description: 'Include a clear call-to-action button',
          target: '[data-component-library] [data-component="button"]',
          position: 'right',
          content: (
            <div className="space-y-2">
              <h4 className="font-semibold">Call-to-Action Button</h4>
              <p>A strong CTA button:</p>
              <ul className="text-sm space-y-1">
                <li>• Uses action-oriented language</li>
                <li>• Stands out visually</li>
                <li>• Links to your desired action</li>
                <li>• Creates urgency when appropriate</li>
              </ul>
            </div>
          ),
          actionRequired: true,
          actionLabel: 'Add CTA button',
          onAction: () => console.log('CTA added')
        }
      ]
    },
    {
      id: 'responsive-design',
      name: 'Responsive Design',
      description: 'Make your website work on all devices',
      icon: '📱',
      difficulty: 'intermediate',
      estimatedTime: 10,
      category: 'design',
      steps: [
        {
          id: 'responsive-intro',
          title: 'Responsive Design Basics',
          description: 'Design for all screen sizes',
          position: 'center',
          content: (
            <div className="space-y-4">
              <h4 className="font-semibold">Why Responsive Design Matters</h4>
              <p>Responsive design ensures your website looks great and works well on:</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl">💻</div>
                  <div className="text-sm">Desktop</div>
                </div>
                <div>
                  <div className="text-2xl">📱</div>
                  <div className="text-sm">Mobile</div>
                </div>
                <div>
                  <div className="text-2xl">📟</div>
                  <div className="text-sm">Tablet</div>
                </div>
              </div>
            </div>
          )
        },
        {
          id: 'view-modes',
          title: 'View Mode Switching',
          description: 'Test your design on different devices',
          target: '[data-view-modes]',
          position: 'bottom',
          content: (
            <div className="space-y-2">
              <h4 className="font-semibold">Device Preview</h4>
              <p>Use these buttons to see how your website looks on different devices:</p>
              <ul className="text-sm space-y-1">
                <li>• Desktop: Full-width layout</li>
                <li>• Tablet: Medium screen adaptations</li>
                <li>• Mobile: Stacked, touch-friendly design</li>
              </ul>
            </div>
          ),
          actionRequired: true,
          actionLabel: 'Try different view modes',
          onAction: () => console.log('View mode changed')
        }
      ]
    }
  ])

  const [progress, setProgress] = useState<GuidedProgress>(() => {
    const saved = localStorage.getItem(`guided-progress-${userId}`)
    return saved ? JSON.parse(saved) : {
      completedSteps: [],
      currentWorkflow: null,
      currentStep: 0,
      skippedSteps: [],
      timeSpent: 0,
      startedAt: null,
      completedAt: null
    }
  })

  const [currentWorkflow, setCurrentWorkflow] = useState<GuidedWorkflow | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [hints, setHints] = useState<string[]>([])
  const startTimeRef = useRef<Date | null>(null)

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(`guided-progress-${userId}`, JSON.stringify(progress))
  }, [progress, userId])

  // Start a workflow
  const startWorkflow = useCallback((workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId)
    if (!workflow) return

    setCurrentWorkflow(workflow)
    setProgress(prev => ({
      ...prev,
      currentWorkflow: workflowId,
      currentStep: 0,
      startedAt: new Date(),
      completedAt: null
    }))
    setIsActive(true)
    startTimeRef.current = new Date()
  }, [workflows])

  // Complete current step
  const completeStep = useCallback(() => {
    if (!currentWorkflow) return

    const currentStepId = currentWorkflow.steps[progress.currentStep]?.id
    if (!currentStepId) return

    setProgress(prev => ({
      ...prev,
      completedSteps: [...prev.completedSteps, currentStepId],
      currentStep: prev.currentStep + 1
    }))

    // Check if workflow is complete
    if (progress.currentStep + 1 >= currentWorkflow.steps.length) {
      completeWorkflow()
    }
  }, [currentWorkflow, progress.currentStep])

  // Skip current step
  const skipStep = useCallback(() => {
    if (!currentWorkflow) return

    const currentStepId = currentWorkflow.steps[progress.currentStep]?.id
    if (!currentStepId) return

    setProgress(prev => ({
      ...prev,
      skippedSteps: [...prev.skippedSteps, currentStepId],
      currentStep: prev.currentStep + 1
    }))

    // Check if workflow is complete
    if (progress.currentStep + 1 >= currentWorkflow.steps.length) {
      completeWorkflow()
    }
  }, [currentWorkflow, progress.currentStep])

  // Complete workflow
  const completeWorkflow = useCallback(() => {
    if (!currentWorkflow) return

    const endTime = new Date()
    const timeSpent = startTimeRef.current
      ? Math.round((endTime.getTime() - startTimeRef.current.getTime()) / 1000)
      : 0

    setProgress(prev => ({
      ...prev,
      currentWorkflow: null,
      currentStep: 0,
      timeSpent: prev.timeSpent + timeSpent,
      completedAt: endTime
    }))

    setCurrentWorkflow(null)
    setIsActive(false)
    startTimeRef.current = null
  }, [currentWorkflow])

  // Get available workflows for user
  const getAvailableWorkflows = useCallback(() => {
    return workflows.filter(workflow => {
      // Check prerequisites
      if (workflow.prerequisites) {
        const completedWorkflowIds = new Set(
          workflows
            .filter(w => progress.completedSteps.some(step =>
              w.steps.some(s => s.id === step)
            ))
            .map(w => w.id)
        )

        return workflow.prerequisites.every(prereq => completedWorkflowIds.has(prereq))
      }
      return true
    })
  }, [workflows, progress.completedSteps])

  // Get workflow progress
  const getWorkflowProgress = useCallback((workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId)
    if (!workflow) return 0

    const completedSteps = workflow.steps.filter(step =>
      progress.completedSteps.includes(step.id)
    ).length

    return Math.round((completedSteps / workflow.steps.length) * 100)
  }, [workflows, progress.completedSteps])

  // Get contextual hints
  const getContextualHints = useCallback((context: string) => {
    const contextHints: Record<string, string[]> = {
      'empty-canvas': [
        'Start by adding a hero section to introduce your brand',
        'Consider your target audience when choosing colors and fonts',
        'Use the component library to drag and drop elements'
      ],
      'component-selected': [
        'Use the properties panel to customize this element',
        'Try different styling options in the design tools',
        'Check how it looks on mobile using the view modes'
      ],
      'before-publish': [
        'Test your website on different devices',
        'Check that all links work correctly',
        'Optimize images for faster loading'
      ]
    }

    return contextHints[context] || []
  }, [])

  // Auto-start welcome workflow for new users
  useEffect(() => {
    if (autoStart && progress.completedSteps.length === 0 && !progress.currentWorkflow) {
      // Check if user has completed any workflows
      const hasCompletedAny = workflows.some(workflow =>
        workflow.steps.some(step => progress.completedSteps.includes(step.id))
      )

      if (!hasCompletedAny) {
        setTimeout(() => startWorkflow('welcome'), 2000)
      }
    }
  }, [autoStart, progress.completedSteps, progress.currentWorkflow, startWorkflow, workflows])

  return {
    workflows,
    currentWorkflow,
    progress,
    isActive,
    hints,
    startWorkflow,
    completeStep,
    skipStep,
    completeWorkflow,
    getAvailableWorkflows,
    getWorkflowProgress,
    getContextualHints
  }
}
