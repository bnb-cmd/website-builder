import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Users, Award, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const AboutSectionConfig: ComponentConfig = {
  id: 'about-section',
  name: 'About Section',
  category: 'business',
  icon: 'Users',
  description: 'Tell your company story',
  defaultProps: { 
    title: 'About Our Company',
    subtitle: 'Building the future, one project at a time',
    description: 'We are a passionate team of innovators dedicated to creating exceptional digital experiences. With over 10 years of experience in the industry, we have helped hundreds of businesses transform their ideas into reality.',
    stats: [
      { icon: 'users', number: '500+', label: 'Happy Clients' },
      { icon: 'award', number: '50+', label: 'Awards Won' },
      { icon: 'globe', number: '25+', label: 'Countries Served' }
    ],
    showStats: true
  },
  defaultSize: { width: 600, height: 400 },
  editableFields: ['title', 'subtitle', 'description', 'stats', 'showStats']
}

interface Stat {
  icon: string
  number: string
  label: string
}

interface AboutSectionProps extends WebsiteComponentProps {
  title: string
  subtitle: string
  description: string
  stats: Stat[]
  showStats: boolean
}

const iconMap: Record<string, React.ComponentType<any>> = {
  users: Users,
  award: Award,
  globe: Globe
}

export const WebsiteAboutSection: React.FC<AboutSectionProps> = ({ 
  title, 
  subtitle, 
  description, 
  stats, 
  showStats,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const padding = getResponsivePadding('p-8', deviceMode)
  const titleSize = getResponsiveTextSize('text-3xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const descriptionSize = getResponsiveTextSize('text-base', deviceMode)
  const statNumberSize = getResponsiveTextSize('text-2xl', deviceMode)
  const statLabelSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <div className={cn("w-full h-full bg-gray-50", padding)}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 
            className={cn("font-bold mb-2", titleSize)}
            onDoubleClick={onTextDoubleClick}
          >
            {title}
          </h2>
          <p 
            className={cn("text-primary font-medium mb-4", subtitleSize)}
            onDoubleClick={onTextDoubleClick}
          >
            {subtitle}
          </p>
          <p 
            className={cn("text-gray-600 max-w-2xl mx-auto", descriptionSize)}
            onDoubleClick={onTextDoubleClick}
          >
            {description}
          </p>
        </div>
        
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {stats.map((stat, index) => {
              const IconComponent = iconMap[stat.icon] || Users
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <div 
                    className={cn("font-bold text-primary mb-1", statNumberSize)}
                    onDoubleClick={onTextDoubleClick}
                  >
                    {stat.number}
                  </div>
                  <div 
                    className={cn("text-gray-600", statLabelSize)}
                    onDoubleClick={onTextDoubleClick}
                  >
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
