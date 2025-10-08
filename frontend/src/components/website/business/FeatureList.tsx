import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { CheckCircle, Star, Zap, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const FeatureListConfig: ComponentConfig = {
  id: 'feature-list',
  name: 'Feature List',
  category: 'business',
  icon: 'CheckCircle',
  description: 'Highlight product features',
  defaultProps: { 
    title: 'Why Choose Us',
    subtitle: 'Discover what makes us different',
    features: [
      {
        icon: 'star',
        title: 'Premium Quality',
        description: 'We deliver only the highest quality products and services.'
      },
      {
        icon: 'zap',
        title: 'Fast Delivery',
        description: 'Get your orders delivered quickly with our express shipping.'
      },
      {
        icon: 'shield',
        title: 'Secure Payment',
        description: 'Your payments are protected with bank-level security.'
      }
    ],
    layout: 'grid'
  },
  defaultSize: { width: 600, height: 400 },
  editableFields: ['title', 'subtitle', 'features', 'layout']
}

interface Feature {
  icon: string
  title: string
  description: string
}

interface FeatureListProps extends WebsiteComponentProps {
  title: string
  subtitle: string
  features: Feature[]
  layout: 'grid' | 'list' | 'cards'
}

const iconMap: Record<string, React.ComponentType<any>> = {
  star: Star,
  zap: Zap,
  shield: Shield,
  check: CheckCircle
}

export const WebsiteFeatureList: React.FC<FeatureListProps> = ({ 
  title, 
  subtitle, 
  features, 
  layout,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const getLayoutClass = () => {
    switch (layout) {
      case 'list': return 'space-y-4'
      case 'cards': return 'grid grid-cols-1 md:grid-cols-2 gap-4'
      default: return 'grid grid-cols-1 md:grid-cols-3 gap-6'
    }
  }

  const padding = getResponsivePadding('p-6', deviceMode)
  const titleSize = getResponsiveTextSize('text-2xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-base', deviceMode)
  const featureTitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const featureDescSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <div className={cn("w-full h-full", padding)}>
      <div className="text-center mb-8">
        <h2 
          className={cn("font-bold mb-2", titleSize)}
          onDoubleClick={onTextDoubleClick}
        >
          {title}
        </h2>
        <p 
          className={cn("text-gray-600", subtitleSize)}
          onDoubleClick={onTextDoubleClick}
        >
          {subtitle}
        </p>
      </div>
      
      <div className={getLayoutClass()}>
        {features.map((feature, index) => {
          const IconComponent = iconMap[feature.icon] || CheckCircle
          return (
            <div 
              key={index}
              className={cn(
                "flex items-start space-x-4",
                layout === 'cards' && "bg-white border border-gray-200 rounded-lg p-4"
              )}
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 
                  className={cn("font-semibold mb-1", featureTitleSize)}
                  onDoubleClick={onTextDoubleClick}
                >
                  {feature.title}
                </h3>
                <p 
                  className={cn("text-gray-600", featureDescSize)}
                  onDoubleClick={onTextDoubleClick}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
