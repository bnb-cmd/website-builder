import React, { useState, useEffect } from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Card } from '../../ui/card'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const StatsCounterConfig: ComponentConfig = {
  id: 'stats-counter',
  name: 'Stats Counter',
  category: 'business',
  icon: 'BarChart',
  description: 'Animated statistics counter',
  defaultProps: {
    title: 'Our Achievements',
    subtitle: 'Numbers that speak for themselves',
    stats: [
      { label: 'Happy Clients', value: 500, suffix: '+', icon: 'Users' },
      { label: 'Projects Completed', value: 1000, suffix: '+', icon: 'CheckCircle' },
      { label: 'Years Experience', value: 10, suffix: '+', icon: 'Calendar' },
      { label: 'Team Members', value: 25, suffix: '+', icon: 'UserGroup' }
    ],
    animationDuration: 2000,
    showIcons: true,
    layout: 'grid',
    columns: 4
  },
  defaultSize: { width: 600, height: 300 },
  editableFields: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'text' },
    { key: 'animationDuration', label: 'Animation Duration (ms)', type: 'number' }
  ]
}

interface StatItem {
  label: string
  value: number
  suffix?: string
  icon?: string
}

interface StatsCounterProps extends WebsiteComponentProps {
  title?: string
  subtitle?: string
  stats?: StatItem[]
  animationDuration?: number
  showIcons?: boolean
  layout?: 'grid' | 'horizontal'
  columns?: number
}

const AnimatedCounter: React.FC<{ target: number; duration: number; suffix?: string }> = ({ 
  target, 
  duration, 
  suffix = '' 
}) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      setCount(Math.floor(progress * target))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [target, duration])

  return <span>{count.toLocaleString()}{suffix}</span>
}

const getIcon = (iconName?: string) => {
  const icons: Record<string, React.ReactNode> = {
    Users: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    CheckCircle: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    Calendar: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    UserGroup: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    Trophy: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    )
  }
  
  return icons[iconName || 'Trophy'] || icons.Trophy
}

export const StatsCounter: React.FC<StatsCounterProps> = ({ 
  deviceMode = 'desktop',
  title = 'Our Achievements',
  subtitle = 'Numbers that speak for themselves',
  stats = [],
  animationDuration = 2000,
  showIcons = true,
  layout = 'grid',
  columns = 4
}) => {
  const textSize = getResponsiveTextSize('text-base', deviceMode)
  const titleSize = getResponsiveTextSize('text-2xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const padding = getResponsivePadding('p-6', deviceMode)
  
  const gridCols = columns === 1 ? 'grid-cols-1' : 
                   columns === 2 ? 'grid-cols-2' : 
                   columns === 3 ? 'grid-cols-3' : 
                   columns === 4 ? 'grid-cols-4' : 'grid-cols-2'
  
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
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              {showIcons && stat.icon && (
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                    {getIcon(stat.icon)}
                  </div>
                </div>
              )}
              <div className={`font-bold text-blue-600 mb-1 ${titleSize}`}>
                <AnimatedCounter 
                  target={stat.value} 
                  duration={animationDuration} 
                  suffix={stat.suffix} 
                />
              </div>
              <div className={`${textSize} text-gray-600`}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
