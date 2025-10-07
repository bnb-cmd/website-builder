'use client'

import { useState } from 'react'
import { Element } from '@/types/editor'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Editor from '@monaco-editor/react'
import { 
  Code,
  Save,
  Play,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Plus,
  Trash2,
  Copy
} from 'lucide-react'

interface CustomJavaScriptPanelProps {
  element: Element
  onUpdateElement: (elementId: string, updates: Partial<Element>) => void
  onClose?: () => void
}

interface JavaScriptSnippet {
  id: string
  name: string
  code: string
  isActive: boolean
  type: 'onLoad' | 'onClick' | 'onHover' | 'custom'
}

export function CustomJavaScriptPanel({ element, onUpdateElement, onClose }: CustomJavaScriptPanelProps) {
  const [snippets, setSnippets] = useState<JavaScriptSnippet[]>(
    (element as any).customJavaScript || []
  )
  const [newSnippetName, setNewSnippetName] = useState('')
  const [newSnippetCode, setNewSnippetCode] = useState('')
  const [newSnippetType, setNewSnippetType] = useState<JavaScriptSnippet['type']>('custom')
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errors: string[] } | null>(null)

  const updateSnippets = (updatedSnippets: JavaScriptSnippet[]) => {
    setSnippets(updatedSnippets)
    onUpdateElement(element.id, { customJavaScript: updatedSnippets } as any)
  }

  const addSnippet = () => {
    if (!newSnippetName.trim() || !newSnippetCode.trim()) return

    const newSnippet: JavaScriptSnippet = {
      id: `js_${Date.now()}`,
      name: newSnippetName,
      code: newSnippetCode,
      isActive: true,
      type: newSnippetType
    }

    updateSnippets([...snippets, newSnippet])
    setNewSnippetName('')
    setNewSnippetCode('')
  }

  const toggleSnippet = (id: string) => {
    updateSnippets(snippets.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ))
  }

  const deleteSnippet = (id: string) => {
    updateSnippets(snippets.filter(s => s.id !== id))
  }

  const validateCode = () => {
    setIsValidating(true)
    // Simulate code validation
    setTimeout(() => {
      const errors: string[] = []
      
      // Basic syntax check (in a real app, use a proper JS parser)
      if (newSnippetCode.includes('console.log(') && !newSnippetCode.includes(')')) {
        errors.push('Missing closing parenthesis')
      }
      
      if (newSnippetCode.includes('function') && !newSnippetCode.includes('{')) {
        errors.push('Missing opening brace for function')
      }

      setValidationResult({
        isValid: errors.length === 0,
        errors
      })
      setIsValidating(false)
    }, 1000)
  }

  const getSnippetIcon = (type: JavaScriptSnippet['type']) => {
    switch (type) {
      case 'onLoad': return '🔄'
      case 'onClick': return '👆'
      case 'onHover': return '🖱️'
      default: return '⚡'
    }
  }

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Code className="h-5 w-5" />
            Custom JavaScript
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
          Add custom JavaScript to <Badge variant="secondary">#{element.id.substring(0, 8)}</Badge>
        </p>
      </div>

      <Tabs defaultValue="snippets" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="snippets">Snippets</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="snippets" className="p-4 mt-0">
            <div className="space-y-4">
              {/* Add New Snippet */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Add JavaScript Snippet</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Snippet Name</label>
                    <input
                      type="text"
                      placeholder="e.g., 'Smooth Scroll Effect'"
                      value={newSnippetName}
                      onChange={(e) => setNewSnippetName(e.target.value)}
                      className="w-full p-2 border border-border rounded-md text-sm bg-background mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Trigger Type</label>
                    <select
                      value={newSnippetType}
                      onChange={(e) => setNewSnippetType(e.target.value as JavaScriptSnippet['type'])}
                      className="w-full p-2 border border-border rounded-md text-sm bg-background mt-1"
                    >
                      <option value="custom">Custom</option>
                      <option value="onLoad">On Page Load</option>
                      <option value="onClick">On Click</option>
                      <option value="onHover">On Hover</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">JavaScript Code</label>
                    <textarea
                      placeholder="// Your JavaScript code here"
                      value={newSnippetCode}
                      onChange={(e) => setNewSnippetCode(e.target.value)}
                      className="w-full p-2 border border-border rounded-md text-sm bg-background mt-1 font-mono"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={validateCode} disabled={isValidating}>
                      {isValidating ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Validate
                    </Button>
                    <Button size="sm" onClick={addSnippet} className="flex-1">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Snippet
                    </Button>
                  </div>

                  {validationResult && (
                    <div className={`p-2 rounded-md text-sm ${
                      validationResult.isValid 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {validationResult.isValid ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Code is valid!
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="h-4 w-4" />
                            Validation errors:
                          </div>
                          <ul className="list-disc list-inside">
                            {validationResult.errors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Existing Snippets */}
              <div className="space-y-3">
                <h4 className="font-medium">Active Snippets</h4>
                {snippets.length > 0 ? (
                  snippets.map(snippet => (
                    <div key={snippet.id} className="p-3 border rounded-md">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{getSnippetIcon(snippet.type)}</span>
                            <p className="font-medium">{snippet.name}</p>
                            <span className={`px-2 py-1 text-xs rounded ${
                              snippet.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {snippet.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            Type: {snippet.type} • {snippet.code.length} characters
                          </p>
                          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                            <code>{snippet.code.substring(0, 100)}{snippet.code.length > 100 ? '...' : ''}</code>
                          </pre>
                        </div>
                        <div className="flex flex-col gap-1 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleSnippet(snippet.id)}
                            className="h-7 w-7 p-0"
                          >
                            {snippet.isActive ? '⏸️' : '▶️'}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteSnippet(snippet.id)}
                            className="h-7 w-7 p-0 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    No JavaScript snippets added yet.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="editor" className="flex-1 flex flex-col mt-0">
            <div className="flex-1">
              <Editor
                height="100%"
                language="javascript"
                value="// Write your JavaScript code here\nconsole.log('Hello, World!');"
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
              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save & Apply JavaScript
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                JavaScript will be executed on the client side. Be careful with security-sensitive operations.
              </p>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
