import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Calendar, User, Share2 } from '@/lib/icons'
import { Button } from '../../ui/button'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const ArticleConfig: ComponentConfig = {
  id: 'article',
  name: 'Article',
  category: 'content',
  icon: 'FileText',
  description: 'Long-form article content',
  defaultProps: { 
    title: 'Article Title',
    subtitle: 'A compelling subtitle that draws readers in',
    author: 'Jane Smith',
    publishDate: '2024-01-15',
    content: 'This is the main content of the article. It can be quite long and contain multiple paragraphs. The content should be engaging and informative for readers.',
    showShare: true
  },
  defaultSize: { width: 600, height: 400 },
  editableFields: ['title', 'subtitle', 'author', 'publishDate', 'content', 'showShare']
}

interface ArticleProps extends WebsiteComponentProps {
  title: string
  subtitle: string
  author: string
  publishDate: string
  content: string
  showShare: boolean
}

export const WebsiteArticle: React.FC<ArticleProps> = ({ 
  title, 
  subtitle, 
  author, 
  publishDate, 
  content, 
  showShare,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const padding = getResponsivePadding('p-6', deviceMode)
  const titleSize = getResponsiveTextSize('text-2xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const contentSize = getResponsiveTextSize('text-base', deviceMode)
  const metaSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <article className={cn("w-full h-full bg-white", padding)}>
      <header className="mb-6">
        <h1 
          className={cn("font-bold mb-2", titleSize)}
          onDoubleClick={onTextDoubleClick}
        >
          {title}
        </h1>
        
        <p 
          className={cn("text-gray-600 mb-4", subtitleSize)}
          onDoubleClick={onTextDoubleClick}
        >
          {subtitle}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-gray-500">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span className={metaSize}>{author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span className={metaSize}>{publishDate}</span>
            </div>
          </div>
          
          {showShare && (
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          )}
        </div>
      </header>
      
      <div className="prose max-w-none">
        <p 
          className={cn("text-gray-700 leading-relaxed", contentSize)}
          onDoubleClick={onTextDoubleClick}
        >
          {content}
        </p>
      </div>
    </article>
  )
}
