import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const BlogGridConfig: ComponentConfig = {
  id: 'blog-grid',
  name: 'Blog Grid',
  category: 'content',
  icon: 'Grid',
  description: 'Display blog posts in a grid layout',
  defaultProps: {
    title: 'Latest Blog Posts',
    subtitle: 'Stay updated with our latest articles',
    posts: [
      {
        id: '1',
        title: 'Getting Started with React Hooks',
        excerpt: 'Learn the fundamentals of React Hooks and how to use them effectively in your applications.',
        author: { name: 'John Doe', avatar: '/authors/john-doe.jpg' },
        publishedAt: '2024-01-15',
        readTime: '5 min read',
        category: 'React',
        tags: ['React', 'Hooks', 'JavaScript'],
        image: '/blog/react-hooks.jpg'
      },
      {
        id: '2',
        title: 'CSS Grid vs Flexbox: When to Use Which',
        excerpt: 'A comprehensive comparison of CSS Grid and Flexbox to help you choose the right layout method.',
        author: { name: 'Jane Smith', avatar: '/authors/jane-smith.jpg' },
        publishedAt: '2024-01-12',
        readTime: '7 min read',
        category: 'CSS',
        tags: ['CSS', 'Grid', 'Flexbox'],
        image: '/blog/css-grid.jpg'
      },
      {
        id: '3',
        title: 'Building Scalable Node.js Applications',
        excerpt: 'Best practices for building Node.js applications that can handle high traffic and scale effectively.',
        author: { name: 'Mike Johnson', avatar: '/authors/mike-johnson.jpg' },
        publishedAt: '2024-01-10',
        readTime: '10 min read',
        category: 'Node.js',
        tags: ['Node.js', 'Scalability', 'Backend'],
        image: '/blog/nodejs-scalability.jpg'
      },
      {
        id: '4',
        title: 'The Future of Web Development',
        excerpt: 'Exploring emerging technologies and trends that will shape the future of web development.',
        author: { name: 'Sarah Wilson', avatar: '/authors/sarah-wilson.jpg' },
        publishedAt: '2024-01-08',
        readTime: '8 min read',
        category: 'Technology',
        tags: ['Web Development', 'Future', 'Trends'],
        image: '/blog/future-web.jpg'
      },
      {
        id: '5',
        title: 'TypeScript Best Practices',
        excerpt: 'Essential TypeScript patterns and practices to write better, more maintainable code.',
        author: { name: 'David Brown', avatar: '/authors/david-brown.jpg' },
        publishedAt: '2024-01-05',
        readTime: '6 min read',
        category: 'TypeScript',
        tags: ['TypeScript', 'Best Practices', 'JavaScript'],
        image: '/blog/typescript-best-practices.jpg'
      },
      {
        id: '6',
        title: 'Database Design Principles',
        excerpt: 'Fundamental principles for designing efficient and scalable database schemas.',
        author: { name: 'Lisa Davis', avatar: '/authors/lisa-davis.jpg' },
        publishedAt: '2024-01-03',
        readTime: '9 min read',
        category: 'Database',
        tags: ['Database', 'Design', 'SQL'],
        image: '/blog/database-design.jpg'
      }
    ],
    columns: 3,
    showAuthor: true,
    showCategory: true,
    showTags: true,
    showReadTime: true,
    showPagination: true,
    postsPerPage: 6
  },
  defaultSize: { width: 1000, height: 800 },
  editableFields: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'text' },
    { key: 'columns', label: 'Columns', type: 'number' }
  ]
}

interface BlogPost {
  id: string
  title: string
  excerpt: string
  author: {
    name: string
    avatar?: string
  }
  publishedAt: string
  readTime: string
  category: string
  tags: string[]
  image?: string
}

interface BlogGridProps extends WebsiteComponentProps {
  title?: string
  subtitle?: string
  posts?: BlogPost[]
  columns?: number
  showAuthor?: boolean
  showCategory?: boolean
  showTags?: boolean
  showReadTime?: boolean
  showPagination?: boolean
  postsPerPage?: number
}

export const BlogGrid: React.FC<BlogGridProps> = ({ 
  deviceMode = 'desktop',
  title = 'Latest Blog Posts',
  subtitle = 'Stay updated with our latest articles',
  posts = [],
  columns = 3,
  showAuthor = true,
  showCategory = true,
  showTags = true,
  showReadTime = true,
  showPagination = true,
  postsPerPage = 6
}) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const postTitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const padding = getResponsivePadding('p-6', deviceMode)
  
  const gridCols = columns === 1 ? 'grid-cols-1' : 
                   columns === 2 ? 'grid-cols-2' : 
                   columns === 3 ? 'grid-cols-3' : 
                   columns === 4 ? 'grid-cols-4' : 'grid-cols-3'
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  return (
    <Card className={`w-full h-full flex flex-col ${padding}`}>
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && <h3 className={`font-bold mb-2 ${titleSize}`}>{title}</h3>}
          {subtitle && <p className={`${subtitleSize} text-gray-600`}>{subtitle}</p>}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className={`grid ${gridCols} gap-6`}>
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                {post.image ? (
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold">Blog</span>
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
                
                <h4 className={`font-semibold mb-3 ${postTitleSize}`}>{post.title}</h4>
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
                  <Button size="sm" variant="outline">Read More</Button>
                </div>
                
                {showTags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {showPagination && posts.length > postsPerPage && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">1</Button>
              <Button size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
