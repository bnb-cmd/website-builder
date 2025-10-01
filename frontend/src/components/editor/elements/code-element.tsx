import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Code, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface CodeElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function CodeElement({ element, onUpdate, viewMode, style, children }: CodeElementProps) {
  const [copied, setCopied] = useState(false)

  const handleCodeChange = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    onUpdate(element.id, {
      props: {
        ...element.props,
        code: newCode
      }
    })
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(element.props.code || '')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const getLanguageClass = () => {
    const language = element.props.language || 'javascript'
    return `language-${language}`
  }

  const getThemeClass = () => {
    switch (element.props.theme) {
      case 'dark':
        return 'bg-gray-900 text-gray-100'
      case 'light':
        return 'bg-gray-50 text-gray-900'
      case 'monokai':
        return 'bg-gray-900 text-gray-100'
      default:
        return 'bg-gray-900 text-gray-100'
    }
  }

  const getFontSizeClass = () => {
    switch (element.props.fontSize) {
      case 'sm':
        return 'text-sm'
      case 'lg':
        return 'text-lg'
      case 'xl':
        return 'text-xl'
      case 'md':
      default:
        return 'text-base'
    }
  }

  const code = element.props.code || `// Your code here
function hello() {
  console.log("Hello, World!");
}

hello();`

  return (
    <div
      className={cn(
        'w-full rounded-lg overflow-hidden border border-border',
        getThemeClass()
      )}
      style={style}
    >
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
        <div className="flex items-center space-x-2">
          <Code className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {element.props.language || 'javascript'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {element.props.showLineNumbers && (
            <span className="text-xs text-muted-foreground">
              Lines: {code.split('\n').length}
            </span>
          )}
          
          {element.props.showCopy && (
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-2 py-1 text-xs bg-background text-foreground rounded hover:bg-muted transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Code Content */}
      <div className="relative">
        {element.props.showLineNumbers && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-muted/50 border-r border-border flex flex-col text-xs text-muted-foreground">
            {code.split('\n').map((_, index) => (
              <div key={index} className="px-2 py-1 text-right">
                {index + 1}
              </div>
            ))}
          </div>
        )}
        
        <textarea
          value={code}
          onChange={handleCodeChange}
          className={cn(
            'w-full p-4 font-mono resize-none border-0 outline-none',
            getFontSizeClass(),
            getThemeClass(),
            element.props.showLineNumbers ? 'pl-16' : ''
          )}
          style={{
            minHeight: '200px',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
          }}
          placeholder="Enter your code here..."
        />
      </div>

      {/* Code Footer */}
      {element.props.showFooter && (
        <div className="px-4 py-2 bg-muted border-t border-border text-xs text-muted-foreground">
          <div className="flex justify-between items-center">
            <span>
              {element.props.language || 'javascript'} • {code.split('\n').length} lines
            </span>
            <span>
              {code.length} characters
            </span>
          </div>
        </div>
      )}

      {!code && (
        <div className="absolute inset-0 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground pointer-events-none">
          <div className="text-center">
            <Code className="h-8 w-8 mx-auto mb-2" />
            <p>Code Block</p>
            <p className="text-xs mt-1">
              Language: {element.props.language || 'javascript'} | 
              Theme: {element.props.theme || 'dark'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
