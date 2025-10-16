import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const CategoryGridConfig: ComponentConfig = {
  id: 'category-grid',
  name: 'Category Grid',
  category: 'content',
  icon: 'Grid',
  description: 'Display categories in a grid layout',
  defaultProps: {
    title: 'Browse Categories',
    subtitle: 'Explore our content by category',
    categories: [
      {
        id: '1',
        name: 'Technology',
        description: 'Latest tech news, tutorials, and insights',
        image: '/categories/technology.jpg',
        postCount: 45,
        color: 'blue',
        icon: 'Computer'
      },
      {
        id: '2',
        name: 'Design',
        description: 'UI/UX design tips, trends, and inspiration',
        image: '/categories/design.jpg',
        postCount: 32,
        color: 'purple',
        icon: 'Palette'
      },
      {
        id: '3',
        name: 'Business',
        description: 'Entrepreneurship, marketing, and growth strategies',
        image: '/categories/business.jpg',
        postCount: 28,
        color: 'green',
        icon: 'TrendingUp'
      },
      {
        id: '4',
        name: 'Lifestyle',
        description: 'Health, wellness, and personal development',
        image: '/categories/lifestyle.jpg',
        postCount: 21,
        color: 'pink',
        icon: 'Heart'
      },
      {
        id: '5',
        name: 'Education',
        description: 'Learning resources and educational content',
        image: '/categories/education.jpg',
        postCount: 38,
        color: 'orange',
        icon: 'BookOpen'
      },
      {
        id: '6',
        name: 'Travel',
        description: 'Travel guides, tips, and destination reviews',
        image: '/categories/travel.jpg',
        postCount: 19,
        color: 'teal',
        icon: 'MapPin'
      }
    ],
    columns: 3,
    showPostCount: true,
    showDescription: true,
    cardStyle: 'modern',
    layout: 'grid'
  },
  defaultSize: { width: 800, height: 600 },
  editableFields: [
    'title',
    'subtitle',
    'columns'
  ]
}

interface Category {
  id: string
  name: string
  description: string
  image?: string
  postCount: number
  color: string
  icon?: string
}

interface CategoryGridProps extends WebsiteComponentProps {
  title?: string
  subtitle?: string
  categories?: Category[]
  columns?: number
  showPostCount?: boolean
  showDescription?: boolean
  cardStyle?: 'modern' | 'minimal'
  layout?: 'grid' | 'horizontal'
}

const getCategoryIcon = (iconName?: string) => {
  const icons: Record<string, React.ReactNode> = {
    Computer: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    Palette: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
      </svg>
    ),
    TrendingUp: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    Heart: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    BookOpen: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    MapPin: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
  
  return icons[iconName || 'Computer'] || icons.Computer
}

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; text: string; hover: string }> = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', hover: 'hover:bg-blue-200' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', hover: 'hover:bg-purple-200' },
    green: { bg: 'bg-green-100', text: 'text-green-600', hover: 'hover:bg-green-200' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-600', hover: 'hover:bg-pink-200' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', hover: 'hover:bg-orange-200' },
    teal: { bg: 'bg-teal-100', text: 'text-teal-600', hover: 'hover:bg-teal-200' }
  }
  
  return colors[color] || colors.blue
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ 
  deviceMode = 'desktop',
  title = 'Browse Categories',
  subtitle = 'Explore our content by category',
  categories = [],
  columns = 3,
  showPostCount = true,
  showDescription = true,
  cardStyle = 'modern',
  layout = 'grid'
}) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const categoryTitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const padding = getResponsivePadding('p-6', deviceMode)
  
  const gridCols = columns === 1 ? 'grid-cols-1' : 
                   columns === 2 ? 'grid-cols-2' : 
                   columns === 3 ? 'grid-cols-3' : 
                   columns === 4 ? 'grid-cols-4' : 'grid-cols-3'
  
  return (
    <Card className={`w-full h-full flex flex-col ${padding}`}>
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && <h3 className={`font-bold mb-2 ${titleSize}`}>{title}</h3>}
          {subtitle && <p className={`${subtitleSize} text-gray-600`}>{subtitle}</p>}
        </div>
      )}

      <div className={`flex-1 ${layout === 'horizontal' ? 'flex items-center justify-around' : ''}`}>
        <div className={`${layout === 'grid' ? `grid ${gridCols} gap-6` : 'flex justify-around w-full'}`}>
          {categories.map((category) => {
            const colorClasses = getColorClasses(category.color)
            
            return (
              <div 
                key={category.id} 
                className={`${cardStyle === 'modern' ? 'bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer' : 'text-center'} group`}
              >
                <div className="relative">
                  <div className="w-full h-32 bg-gray-200 flex items-center justify-center overflow-hidden">
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className={`w-full h-full ${colorClasses?.bg || 'bg-gray-100'} flex items-center justify-center`}>
                        <div className={`${colorClasses?.text || 'text-gray-600'}`}>
                          {getCategoryIcon(category.icon)}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={`absolute top-2 right-2 px-2 py-1 bg-white rounded-full shadow-sm ${textSize} font-medium`}>
                    {category.postCount} posts
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className={`font-semibold mb-2 ${categoryTitleSize}`}>{category.name}</h4>
                  
                  {showDescription && (
                    <p className={`text-gray-600 mb-4 ${textSize}`}>{category.description}</p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    {showPostCount && (
                      <span className={`${textSize} text-gray-500`}>
                        {category.postCount} articles
                      </span>
                    )}
                    <Button size="sm" variant="outline" className={`${colorClasses?.hover || 'hover:bg-gray-100'}`}>
                      Explore
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
