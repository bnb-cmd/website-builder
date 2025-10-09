import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const CauseGridConfig: ComponentConfig = {
  id: 'cause-grid',
  name: 'Cause Grid',
  category: 'business',
  icon: 'Heart',
  description: 'Display charity causes and campaigns',
  defaultProps: {
    title: 'Support Our Causes',
    subtitle: 'Make a difference in the world',
    causes: [
      {
        id: '1',
        title: 'Education for All',
        description: 'Providing quality education to underprivileged children worldwide',
        image: null,
        goal: 50000,
        raised: 32000,
        donors: 1250,
        category: 'Education',
        urgency: 'high',
        deadline: '2024-12-31'
      },
      {
        id: '2',
        title: 'Clean Water Initiative',
        description: 'Building wells and water systems in rural communities',
        image: null,
        goal: 75000,
        raised: 45000,
        donors: 890,
        category: 'Health',
        urgency: 'medium',
        deadline: '2024-11-30'
      },
      {
        id: '3',
        title: 'Environmental Protection',
        description: 'Protecting endangered species and their habitats',
        image: null,
        goal: 100000,
        raised: 78000,
        donors: 2100,
        category: 'Environment',
        urgency: 'high',
        deadline: '2024-10-15'
      },
      {
        id: '4',
        title: 'Disaster Relief Fund',
        description: 'Emergency assistance for communities affected by natural disasters',
        image: null,
        goal: 200000,
        raised: 150000,
        donors: 3200,
        category: 'Emergency',
        urgency: 'critical',
        deadline: '2024-09-30'
      }
    ],
    columns: 4,
    showProgress: true,
    showDonors: true,
    showCategories: true,
    cardStyle: 'modern'
  },
  defaultSize: { width: 1000, height: 800 },
  editableFields: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'text' },
    { key: 'columns', label: 'Columns', type: 'number' }
  ]
}

interface Cause {
  id: string
  title: string
  description: string
  image?: string
  goal: number
  raised: number
  donors: number
  category: string
  urgency: 'low' | 'medium' | 'high' | 'critical'
  deadline: string
}

interface CauseGridProps extends WebsiteComponentProps {
  title?: string
  subtitle?: string
  causes?: Cause[]
  columns?: number
  showProgress?: boolean
  showDonors?: boolean
  showCategories?: boolean
  cardStyle?: 'modern' | 'minimal'
}

export const CauseGrid: React.FC<CauseGridProps> = ({ 
  deviceMode = 'desktop',
  title = 'Support Our Causes',
  subtitle = 'Make a difference in the world',
  causes = [],
  columns = 4,
  showProgress = true,
  showDonors = true,
  showCategories = true,
  cardStyle = 'modern'
}) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const causeTitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const padding = getResponsivePadding('p-6', deviceMode)
  
  const gridCols = columns === 1 ? 'grid-cols-1' : 
                   columns === 2 ? 'grid-cols-2' : 
                   columns === 3 ? 'grid-cols-3' : 
                   columns === 4 ? 'grid-cols-4' : 'grid-cols-2'
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getCategoryColor = (category: string) => {
    if (!category) return 'bg-gray-100 text-gray-800'
    switch (category.toLowerCase()) {
      case 'education': return 'bg-blue-100 text-blue-800'
      case 'health': return 'bg-green-100 text-green-800'
      case 'environment': return 'bg-emerald-100 text-emerald-800'
      case 'emergency': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100)
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
          {causes.map((cause) => (
            <div key={cause.id} className={`${cardStyle === 'modern' ? 'bg-white rounded-lg shadow-sm overflow-hidden' : ''}`}>
              <div className="relative">
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {cause.image ? (
                    <img 
                      src={cause.image} 
                      alt={cause.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Cause</span>
                    </div>
                  )}
                </div>
                <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(cause.urgency || 'low')}`}>
                  {(cause.urgency || 'low').toUpperCase()}
                </div>
                {showCategories && cause.category && (
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${getCategoryColor(cause.category)}`}>
                    {cause.category}
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h4 className={`font-semibold mb-2 ${causeTitleSize}`}>{cause.title}</h4>
                <p className={`text-gray-600 mb-4 ${textSize}`}>{cause.description}</p>
                
                {showProgress && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-medium ${textSize}`}>
                        {formatCurrency(cause.raised || 0)} raised
                      </span>
                      <span className={`text-gray-600 ${textSize}`}>
                        of {formatCurrency(cause.goal || 0)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(cause.raised || 0, cause.goal || 1)}%` }}
                      ></div>
                    </div>
                    <div className="text-right mt-1">
                      <span className={`text-gray-600 ${textSize}`}>
                        {getProgressPercentage(cause.raised || 0, cause.goal || 1).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}
                
                {showDonors && (
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className={`${textSize}`}>{cause.donors || 0} donors</span>
                    </div>
                    {cause.deadline && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className={`${textSize}`}>
                          {new Date(cause.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button className="flex-1" size="sm">
                    Donate Now
                  </Button>
                  <Button variant="outline" size="sm">
                    Share
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
