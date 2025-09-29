import React from 'react'
import { GuidedWorkflow } from '@/hooks/use-guided-editor'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Play,
  Clock,
  CheckCircle,
  Lock,
  BookOpen,
  Palette,
  FileText,
  Zap,
  Upload,
  GraduationCap
} from 'lucide-react'

interface GuidedWorkflowsPanelProps {
  workflows: GuidedWorkflow[]
  availableWorkflows: GuidedWorkflow[]
  getWorkflowProgress: (workflowId: string) => number
  onStartWorkflow: (workflowId: string) => void
  currentWorkflow: string | null
  className?: string
}

const categoryIcons = {
  'getting-started': GraduationCap,
  'design': Palette,
  'content': FileText,
  'functionality': Zap,
  'publishing': Upload
}

const categoryColors = {
  'getting-started': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'design': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  'content': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'functionality': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'publishing': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
}

const difficultyColors = {
  'beginner': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'intermediate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'advanced': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

export function GuidedWorkflowsPanel({
  workflows,
  availableWorkflows,
  getWorkflowProgress,
  onStartWorkflow,
  currentWorkflow,
  className
}: GuidedWorkflowsPanelProps) {
  const categories = Array.from(new Set(workflows.map(w => w.category)))

  const getWorkflowStatus = (workflow: GuidedWorkflow) => {
    if (currentWorkflow === workflow.id) return 'active'
    if (!availableWorkflows.find(w => w.id === workflow.id)) return 'locked'
    const progress = getWorkflowProgress(workflow.id)
    if (progress === 100) return 'completed'
    if (progress > 0) return 'in-progress'
    return 'available'
  }

  const renderWorkflowCard = (workflow: GuidedWorkflow) => {
    const status = getWorkflowStatus(workflow)
    const progress = getWorkflowProgress(workflow.id)
    const isAvailable = availableWorkflows.find(w => w.id === workflow.id)
    const CategoryIcon = categoryIcons[workflow.category]

    return (
      <Card key={workflow.id} className={cn(
        "transition-all duration-200 hover:shadow-md",
        status === 'active' && "ring-2 ring-primary",
        status === 'locked' && "opacity-60"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{workflow.icon}</div>
              <div>
                <CardTitle className="text-sm">{workflow.name}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge
                    variant="secondary"
                    className={cn("text-xs", categoryColors[workflow.category])}
                  >
                    <CategoryIcon className="h-3 w-3 mr-1" />
                    {workflow.category.replace('-', ' ')}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", difficultyColors[workflow.difficulty])}
                  >
                    {workflow.difficulty}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="text-right">
              {status === 'completed' && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {status === 'active' && (
                <div className="flex items-center space-x-1 text-primary">
                  <Play className="h-4 w-4" />
                  <span className="text-xs">Active</span>
                </div>
              )}
              {status === 'locked' && (
                <Lock className="h-4 w-4 text-muted-foreground" />
              )}
              {status === 'in-progress' && (
                <div className="text-xs text-muted-foreground">
                  {progress}%
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {workflow.description}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{workflow.estimatedTime} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="h-3 w-3" />
              <span>{workflow.steps.length} steps</span>
            </div>
          </div>

          {status === 'in-progress' && progress > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          )}

          <Button
            onClick={() => onStartWorkflow(workflow.id)}
            disabled={!isAvailable || status === 'active'}
            className="w-full"
            size="sm"
            variant={status === 'active' ? 'secondary' : 'default'}
          >
            {status === 'active' && (
              <>
                <Play className="h-4 w-4 mr-2" />
                Continue Learning
              </>
            )}
            {status === 'completed' && (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Review
              </>
            )}
            {status === 'in-progress' && (
              <>
                <Play className="h-4 w-4 mr-2" />
                Continue
              </>
            )}
            {status === 'available' && (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Tutorial
              </>
            )}
            {status === 'locked' && (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Complete Prerequisites
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Guided Learning</h2>
        <p className="text-muted-foreground">
          Learn at your own pace with our interactive tutorials and guided workflows.
          Master the editor and create stunning websites with confidence.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="functionality">Features</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workflows.map(renderWorkflowCard)}
            </div>
          </TabsContent>

          {categories.map(category => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workflows
                  .filter(workflow => workflow.category === category)
                  .map(renderWorkflowCard)}
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>

      {/* Learning Stats */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Your Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {workflows.filter(w => getWorkflowProgress(w.id) === 100).length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {workflows.filter(w => getWorkflowProgress(w.id) > 0 && getWorkflowProgress(w.id) < 100).length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(workflows.reduce((acc, w) => acc + getWorkflowProgress(w.id), 0) / workflows.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Overall Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {workflows.reduce((acc, w) => acc + w.steps.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Steps</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
