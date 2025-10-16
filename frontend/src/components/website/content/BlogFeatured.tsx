import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const BlogFeaturedConfig: ComponentConfig = {
  id: 'blog-featured',
  name: 'Featured Blog Post',
  category: 'content',
  icon: 'BookOpen',
  description: 'Display featured blog post',
  defaultProps: {
    title: 'Featured Article',
    subtitle: 'Our latest insights and updates',
    post: {
      id: '1',
      title: 'The Future of Web Development: Trends to Watch in 2024',
      excerpt: 'Explore the latest trends and technologies shaping the future of web development, from AI integration to progressive web apps.',
      content: 'Web development is evolving at an unprecedented pace...',
      author: {
        name: 'Sarah Johnson',
        avatar: '/authors/sarah-johnson.jpg',
        bio: 'Senior Developer & Tech Writer'
      },
      publishedAt: '2024-01-15',
      readTime: '8 min read',
      category: 'Technology',
      tags: ['Web Development', 'Technology', 'Trends', '2024'],
      image: '/blog/future-web-dev.jpg',
      featured: true
    },
    showAuthor: true,
    showCategory: true,
    showTags: true,
    showReadTime: true,
    layout: 'hero'
  },
  defaultSize: { width: 800, height: 500 },
  editableFields: [
    'title',
    'subtitle'
  ]
}

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar?: string
    bio?: string
  }
  publishedAt: string
  readTime: string
  category: string
  tags: string[]
  image?: string
  featured: boolean
}

interface BlogFeaturedProps extends WebsiteComponentProps {
  title?: string
  subtitle?: string
  post?: BlogPost
  showAuthor?: boolean
  showCategory?: boolean
  showTags?: boolean
  showReadTime?: boolean
  layout?: 'hero' | 'card'
}

export const BlogFeatured: React.FC<BlogFeaturedProps> = ({ 
  deviceMode = 'desktop',
  title = 'Featured Article',
  subtitle = 'Our latest insights and updates',
  post,
  showAuthor = true,
  showCategory = true,
  showTags = true,
  showReadTime = true,
  layout = 'hero'
}) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const postTitleSize = getResponsiveTextSize('text-2xl', deviceMode)
  const padding = getResponsivePadding('p-6', deviceMode)
  
  if (!post) {
    return (
      <Card className={`w-full h-full flex flex-col justify-center items-center ${padding}`}>
        <div className="text-center">
          <h3 className={`font-bold mb-2 ${titleSize}`}>{title}</h3>
          <p className={`${subtitleSize} text-gray-600`}>{subtitle}</p>
          <p className={`${textSize} text-gray-500 mt-4`}>No featured post available</p>
        </div>
      </Card>
    )
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  if (layout === 'card') {
    return (
      <Card className={`w-full h-full flex flex-col ${padding}`}>
        {(title || subtitle) && (
          <div className="mb-6">
            {title && <h3 className={`font-bold mb-2 ${titleSize}`}>{title}</h3>}
            {subtitle && <p className={`${subtitleSize} text-gray-600`}>{subtitle}</p>}
          </div>
        )}

        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
            {post.image ? (
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Featured</span>
              </div>
            )}
          </div>
          
          <div className="p-6">
            {showCategory && (
              <div className="mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  {post.category}
                </span>
              </div>
            )}
            
            <h4 className={`font-bold mb-3 ${postTitleSize}`}>{post.title}</h4>
            <p className={`text-gray-600 mb-4 ${textSize}`}>{post.excerpt}</p>
            
            {showAuthor && (
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mr-3">
                  {post.author.avatar ? (
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 font-bold text-sm">
                      {post.author.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                <div>
                  <div className={`font-medium ${textSize}`}>{post.author.name}</div>
                  <div className={`text-gray-500 text-xs`}>{formatDate(post.publishedAt)}</div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-4">
              {showReadTime && (
                <span className={`text-gray-500 ${textSize}`}>{post.readTime}</span>
              )}
              <Button size="sm">Read More</Button>
            </div>
            
            {showTags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    )
  }
  
  // Hero layout
  return (
    <Card className={`w-full h-full flex flex-col ${padding}`}>
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && <h3 className={`font-bold mb-2 ${titleSize}`}>{title}</h3>}
          {subtitle && <p className={`${subtitleSize} text-gray-600`}>{subtitle}</p>}
        </div>
      )}

      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="relative">
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
            {post.image ? (
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">Featured Post</span>
              </div>
            )}
          </div>
          {showCategory && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white text-gray-800 rounded-full text-sm font-medium shadow-sm">
                {post.category}
              </span>
            </div>
          )}
        </div>
        
        <div className="p-8">
          <h4 className={`font-bold mb-4 ${postTitleSize}`}>{post.title}</h4>
          <p className={`text-gray-600 mb-6 ${textSize}`}>{post.excerpt}</p>
          
          {showAuthor && (
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mr-4">
                {post.author.avatar ? (
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-bold">
                    {post.author.name.split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>
              <div>
                <div className={`font-medium ${textSize}`}>{post.author.name}</div>
                <div className={`text-gray-500 text-sm`}>
                  {formatDate(post.publishedAt)} • {post.readTime}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            {showTags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            <Button>Read Full Article</Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
