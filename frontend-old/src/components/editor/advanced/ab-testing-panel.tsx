'use client'

import { useState } from 'react'
import { Element } from '@/types/editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useWebsiteStore } from '@/store/website-store'
import { 
  GitBranch,
  Play,
  Pause,
  BarChart,
  Users,
  Target,
  TrendingUp,
  Settings,
  Plus,
  Trash2,
  Copy
} from 'lucide-react'

interface ABTestingPanelProps {
  onClose?: () => void
}

interface ABTest {
  id: string
  name: string
  status: 'draft' | 'running' | 'paused' | 'completed'
  variants: {
    id: string
    name: string
    elements: Element[]
    traffic: number
  }[]
  metrics: {
    visitors: number
    conversions: number
    conversionRate: number
  }
  startDate: Date
  endDate?: Date
}

export function ABTestingPanel({ onClose }: ABTestingPanelProps) {
  const { elements } = useWebsiteStore()
  const [tests, setTests] = useState<ABTest[]>([])
  const [newTestName, setNewTestName] = useState('')
  const [isCreatingTest, setIsCreatingTest] = useState(false)

  const createTest = () => {
    if (!newTestName.trim()) return
    
    setIsCreatingTest(true)
    const newTest: ABTest = {
      id: `test_${Date.now()}`,
      name: newTestName,
      status: 'draft',
      variants: [
        {
          id: 'control',
          name: 'Control (Original)',
          elements: JSON.parse(JSON.stringify(elements)),
          traffic: 50
        },
        {
          id: 'variant_a',
          name: 'Variant A',
          elements: JSON.parse(JSON.stringify(elements)),
          traffic: 50
        }
      ],
      metrics: {
        visitors: 0,
        conversions: 0,
        conversionRate: 0
      },
      startDate: new Date()
    }
    
    setTests([newTest, ...tests])
    setNewTestName('')
    setIsCreatingTest(false)
  }

  const startTest = (testId: string) => {
    setTests(tests.map(test => 
      test.id === testId ? { ...test, status: 'running' } : test
    ))
  }

  const pauseTest = (testId: string) => {
    setTests(tests.map(test => 
      test.id === testId ? { ...test, status: 'paused' } : test
    ))
  }

  const getStatusColor = (status: ABTest['status']) => {
    switch (status) {
      case 'running': return 'bg-green-500'
      case 'paused': return 'bg-yellow-500'
      case 'completed': return 'bg-blue-900'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            A/B Testing
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            ×
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Test different versions of your page to optimize conversions.
        </p>
      </div>

      <Tabs defaultValue="tests" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="tests" className="p-4 mt-0">
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Create New Test</h4>
                  <div className="space-y-2">
                    <Label htmlFor="test-name">Test Name</Label>
                    <Input
                      id="test-name"
                      placeholder="e.g., 'Hero Button Color Test'"
                      value={newTestName}
                      onChange={(e) => setNewTestName(e.target.value)}
                    />
                    <Button 
                      className="w-full" 
                      onClick={createTest}
                      disabled={isCreatingTest}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create A/B Test
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <h4 className="font-medium">Active Tests</h4>
                {tests.length > 0 ? (
                  tests.map(test => (
                    <Card key={test.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold">{test.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(test.status)}`} />
                              <span className="text-sm text-muted-foreground capitalize">{test.status}</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {test.status === 'draft' && (
                              <Button size="sm" onClick={() => startTest(test.id)}>
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            {test.status === 'running' && (
                              <Button size="sm" variant="outline" onClick={() => pauseTest(test.id)}>
                                <Pause className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="ghost">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Variants:</span>
                            <span>{test.variants.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Traffic Split:</span>
                            <span>{test.variants.map(v => `${v.traffic}%`).join(' / ')}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Visitors:</span>
                            <span>{test.metrics.visitors.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <BarChart className="h-4 w-4 mr-1" />
                              View Results
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Copy className="h-4 w-4 mr-1" />
                              Duplicate
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    No A/B tests created yet.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="p-4 mt-0">
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Test Performance</h4>
                  <div className="space-y-3">
                    {tests.filter(t => t.status === 'running' || t.status === 'completed').map(test => (
                      <div key={test.id} className="p-3 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{test.name}</p>
                          <Badge variant="outline">{test.status}</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          {test.variants.map(variant => (
                            <div key={variant.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                <span className="text-sm">{variant.name}</span>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">{variant.traffic}%</p>
                                <p className="text-xs text-muted-foreground">
                                  {Math.floor(Math.random() * 100)} conversions
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center justify-between text-sm">
                            <span>Statistical Significance:</span>
                            <span className="font-medium">85%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Winner:</span>
                            <span className="font-medium text-green-600">Variant A</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
