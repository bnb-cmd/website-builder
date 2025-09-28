'use client'

import { useState } from 'react'
import { Element } from '@/types/editor'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Editor from '@monaco-editor/react'
import { 
  Code,
  Sparkles,
  Save,
  Undo,
  Settings,
  Bot,
  RefreshCw,
  Eye
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

interface CustomCSSEditorProps {
  element: Element
  onUpdateElement: (elementId: string, updates: Partial<Element>) => void
  onClose?: () => void
}

export function CustomCSSEditor({ element, onUpdateElement, onClose }: CustomCSSEditorProps) {
  const [css, setCss] = useState(element.customCss || `/* Custom CSS for element #${element.id} */\nselector {\n  \n}`)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleEditorChange = (value?: string) => {
    setCss(value || '')
  }

  const applyCss = () => {
    onUpdateElement(element.id, { customCss: css })
  }

  const generateAISuggestions = () => {
    setIsGenerating(true)
    // Simulate AI call
    setTimeout(() => {
      const suggestions = [
        `selector {\n  transition: all 0.3s ease;\n}\nselector:hover {\n  transform: scale(1.05);\n  box-shadow: 0 10px 20px rgba(0,0,0,0.1);\n}`,
        `@keyframes pulse {\n  0% { transform: scale(1); }\n  50% { transform: scale(1.03); }\n  100% { transform: scale(1); }\n}\nselector {\n  animation: pulse 2s infinite;\n}`,
        `selector {\n  background: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);\n  color: white;\n  border: none;\n  padding: 1rem 2rem;\n}`
      ]
      setAiSuggestions(suggestions)
      setIsGenerating(false)
    }, 1500)
  }

  const applySuggestion = (suggestion: string) => {
    setCss(prev => prev.replace('selector', `/* Suggestion Applied */\n${suggestion.replace(/selector/g, `[data-element-id="${element.id}"]`)}`))
  }

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Code className="h-5 w-5" />
            Custom CSS Editor
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
          Apply custom styles to <Badge variant="secondary">#{element.id.substring(0, 8)}</Badge>
        </p>
      </div>

      <Tabs defaultValue="editor" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="flex-1 flex flex-col mt-0">
          <div className="flex-1">
            <Editor
              height="100%"
              language="css"
              value={css.replace(/selector/g, `[data-element-id="${element.id}"]`)}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                wordWrap: 'on',
                lineNumbers: 'on',
                scrollBeyondLastLine: false
              }}
            />
          </div>
          <div className="p-4 border-t border-border">
            <Button className="w-full" onClick={applyCss}>
              <Save className="h-4 w-4 mr-2" />
              Apply & Save CSS
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Use `selector` to target the current element. It will be replaced with the correct ID.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="ai-assistant" className="mt-0">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-4 space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="h-5 w-5" />
                  <h4 className="font-semibold">AI Assistant</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Describe the style you want, and our AI will generate the CSS for you.
                </p>
                
                <textarea
                  placeholder="e.g., 'Make this button glow on hover' or 'Add a subtle box shadow'"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full p-2 border border-border rounded-md text-sm bg-background"
                  rows={3}
                />
                <Button 
                  className="w-full mt-2" 
                  onClick={generateAISuggestions}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Generate Suggestions
                </Button>
              </div>

              {aiSuggestions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Suggestions</h4>
                  <div className="space-y-3">
                    {aiSuggestions.map((suggestion, index) => (
                      <Card key={index}>
                        <div className="p-3">
                          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                            <code>{suggestion}</code>
                          </pre>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline" onClick={() => applySuggestion(suggestion)}>
                              Apply
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
