import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const FeaturesConfig: ComponentConfig = {
  id: 'features',
  name: 'Features Showcase',
  category: 'content',
  icon: 'Star',
  description: 'Display product features and benefits',
  defaultProps: {
    title: 'Why Choose Our Platform',
    subtitle: 'Discover the features that make us different',
    features: [
      {
        id: '1',
        title: 'Lightning Fast',
        description: 'Experience blazing fast performance with our optimized infrastructure and cutting-edge technology.',
        icon: 'Zap',
        color: 'yellow',
        benefits: ['99.9% uptime', 'Sub-second load times', 'Global CDN']
      },
      {
        id: '2',
        title: 'Secure & Reliable',
        description: 'Your data is protected with enterprise-grade security and 24/7 monitoring.',
        icon: 'Shield',
        color: 'green',
        benefits: ['End-to-end encryption', 'SOC 2 compliant', 'Regular backups']
      },
      {
        id: '3',
        title: 'Easy to Use',
        description: 'Intuitive interface designed for both beginners and professionals.',
        icon: 'User',
        color: 'blue',
        benefits: ['Drag & drop builder', 'No coding required', 'Extensive templates']
      },
      {
        id: '4',
        title: '24/7 Support',
        description: 'Get help whenever you need it with our dedicated support team.',
        icon: 'Headphones',
        color: 'purple',
        benefits: ['Live chat support', 'Video tutorials', 'Community forum']
      },
      {
        id: '5',
        title: 'Scalable',
        description: 'Grow your business without limits with our scalable solutions.',
        icon: 'TrendingUp',
        color: 'orange',
        benefits: ['Unlimited bandwidth', 'Auto-scaling', 'Custom integrations']
      },
      {
        id: '6',
        title: 'Analytics',
        description: 'Make data-driven decisions with comprehensive analytics and insights.',
        icon: 'BarChart',
        color: 'teal',
        benefits: ['Real-time metrics', 'Custom reports', 'Performance tracking']
      }
    ],
    columns: 3,
    layout: 'grid',
    showBenefits: true,
    showIcons: true,
    cardStyle: 'modern'
  },
  defaultSize: { width: 1000, height: 800 },
  editableFields: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'text' },
    { key: 'columns', label: 'Columns', type: 'number' }
  ]
}

interface Feature {
  id: string
  title: string
  description: string
  icon?: string
  color: string
  benefits?: string[]
}

interface FeaturesProps extends WebsiteComponentProps {
  title?: string
  subtitle?: string
  features?: Feature[]
  columns?: number
  layout?: 'grid' | 'horizontal'
  showBenefits?: boolean
  showIcons?: boolean
  cardStyle?: 'modern' | 'minimal'
}

const getFeatureIcon = (iconName?: string) => {
  const icons: Record<string, React.ReactNode> = {
    Zap: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    Shield: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    User: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    Headphones: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    ),
    TrendingUp: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    BarChart: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  }
  
  return icons[iconName || 'Star'] || icons.Zap
}

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
    green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
    teal: { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-200' }
  }
  
  return colors[color] || colors.blue
}

export const Features: React.FC<FeaturesProps> = ({ 
  deviceMode = 'desktop',
  title = 'Why Choose Our Platform',
  subtitle = 'Discover the features that make us different',
  features = [],
  columns = 3,
  layout = 'grid',
  showBenefits = true,
  showIcons = true,
  cardStyle = 'modern'
}) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const featureTitleSize = getResponsiveTextSize('text-lg', deviceMode)
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
          {features.map((feature) => {
            const colorClasses = getColorClasses(feature.color)
            
            return (
              <div 
                key={feature.id} 
                className={`${cardStyle === 'modern' ? 'bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow' : 'text-center'} group`}
              >
                {showIcons && feature.icon && (
                  <div className={`w-12 h-12 ${colorClasses.bg} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                    <div className={`${colorClasses.text}`}>
                      {getFeatureIcon(feature.icon)}
                    </div>
                  </div>
                )}
                
                <h4 className={`font-semibold mb-3 ${featureTitleSize}`}>{feature.title}</h4>
                <p className={`text-gray-600 mb-4 ${textSize}`}>{feature.description}</p>
                
                {showBenefits && feature.benefits && feature.benefits.length > 0 && (
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={`${textSize}`}>{benefit}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-4">
                  <Button size="sm" variant="outline" className={`${colorClasses.border} ${colorClasses.text}`}>
                    Learn More
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
