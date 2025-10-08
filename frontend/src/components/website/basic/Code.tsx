import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { getResponsiveTextSize } from '../renderer'

export const CodeConfig: ComponentConfig = {
  id: 'code',
  name: 'Code',
  category: 'basic',
  icon: 'Code',
  description: 'Display code snippets with syntax highlighting',
  defaultProps: { 
    code: 'console.log("Hello World");',
    language: 'javascript',
    showLineNumbers: true
  },
  defaultSize: { width: 300, height: 100 },
  editableFields: ['code', 'language', 'showLineNumbers']
}

interface CodeProps extends WebsiteComponentProps {
  code: string
  language: string
  showLineNumbers: boolean
}

export const WebsiteCode: React.FC<CodeProps> = ({ 
  code, 
  language, 
  showLineNumbers,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <div className="w-full h-full bg-gray-900 text-green-400 rounded-lg p-4 overflow-auto">
      <div className="flex items-start gap-2">
        {showLineNumbers && (
          <div className="text-gray-500 text-xs select-none">
            {code.split('\n').map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}
        <pre 
          className={`${textSize} font-mono flex-1`}
          onDoubleClick={onTextDoubleClick}
        >
          <code>{code}</code>
        </pre>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        {language.toUpperCase()}
      </div>
    </div>
  )
}
