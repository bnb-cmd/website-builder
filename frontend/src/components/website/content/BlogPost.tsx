import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Calendar, User, Clock } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const BlogPostConfig: ComponentConfig = {
  id: 'blog-post',
  name: 'Blog Post',
  category: 'content',
  icon: 'FileText',
  description: 'Display blog post content',
  defaultProps: { 
    title: 'Blog Post Title',
    excerpt: 'This is a brief excerpt of the blog post content that gives readers a preview of what they can expect to read.',
    author: 'John Doe',
    date: '2024-01-15',
    readTime: '5 min read',
    image: '',
    tags: ['Technology', 'Web Development']
  },
  defaultSize: { width: 400, height: 300 },
  editableFields: ['title', 'excerpt', 'author', 'date', 'readTime', 'image', 'tags']
}

interface BlogPostProps extends WebsiteComponentProps {
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  image: string
  tags: string[]
}

export const WebsiteBlogPost: React.FC<BlogPostProps> = ({ 
  title, 
  excerpt, 
  author, 
  date, 
  readTime, 
  image, 
  tags,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const padding = getResponsivePadding('p-4', deviceMode)
  const titleSize = getResponsiveTextSize('text-lg', deviceMode)
  const excerptSize = getResponsiveTextSize('text-sm', deviceMode)
  const metaSize = getResponsiveTextSize('text-xs', deviceMode)
  const tagSize = getResponsiveTextSize('text-xs', deviceMode)

  return (
    <article className={cn("w-full h-full bg-white border border-gray-200 rounded-lg overflow-hidden", padding)}>
      {image && (
        <div className="w-full h-32 bg-gray-200 mb-4 rounded-md overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="space-y-3">
        <h3 
          className={cn("font-bold line-clamp-2", titleSize)}
          onDoubleClick={onTextDoubleClick}
        >
          {title}
        </h3>
        
        <p 
          className={cn("text-gray-600 line-clamp-3", excerptSize)}
          onDoubleClick={onTextDoubleClick}
        >
          {excerpt}
        </p>
        
        <div className="flex items-center space-x-4 text-gray-500">
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span className={metaSize}>{author}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span className={metaSize}>{date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span className={metaSize}>{readTime}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className={cn("bg-gray-100 text-gray-600 px-2 py-1 rounded", tagSize)}
              onDoubleClick={onTextDoubleClick}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
