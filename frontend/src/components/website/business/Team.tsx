import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const TeamConfig: ComponentConfig = {
  id: 'team',
  name: 'Team Overview',
  category: 'business',
  icon: 'UserGroup',
  description: 'Display team members overview',
  defaultProps: {
    title: 'Meet Our Team',
    subtitle: 'The talented people behind our success',
    members: [
      {
        id: '1',
        name: 'John Smith',
        role: 'CEO & Founder',
        image: '/team/john-smith.jpg',
        bio: 'Visionary leader with 15+ years of experience',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/johnsmith',
          twitter: 'https://twitter.com/johnsmith'
        }
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        role: 'CTO',
        image: '/team/sarah-johnson.jpg',
        bio: 'Technology expert passionate about innovation',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/sarahjohnson',
          github: 'https://github.com/sarahjohnson'
        }
      },
      {
        id: '3',
        name: 'Mike Davis',
        role: 'Lead Designer',
        image: '/team/mike-davis.jpg',
        bio: 'Creative designer with an eye for detail',
        socialLinks: {
          behance: 'https://behance.net/mikedavis',
          dribbble: 'https://dribbble.com/mikedavis'
        }
      },
      {
        id: '4',
        name: 'Emily Wilson',
        role: 'Marketing Director',
        image: '/team/emily-wilson.jpg',
        bio: 'Marketing strategist driving growth',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/emilywilson',
          twitter: 'https://twitter.com/emilywilson'
        }
      }
    ],
    layout: 'grid',
    columns: 4,
    showBio: true,
    showSocialLinks: true,
    cardStyle: 'modern'
  },
  defaultSize: { width: 800, height: 600 },
  editableFields: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'text' },
    { key: 'layout', label: 'Layout', type: 'select', options: ['grid', 'horizontal'] },
    { key: 'columns', label: 'Columns', type: 'number' }
  ]
}

interface TeamMember {
  id: string
  name: string
  role: string
  image?: string
  bio?: string
  socialLinks?: {
    linkedin?: string
    twitter?: string
    github?: string
    behance?: string
    dribbble?: string
  }
}

interface TeamProps extends WebsiteComponentProps {
  title?: string
  subtitle?: string
  members?: TeamMember[]
  layout?: 'grid' | 'horizontal'
  columns?: number
  showBio?: boolean
  showSocialLinks?: boolean
  cardStyle?: 'modern' | 'minimal'
}

const getSocialIcon = (platform: string) => {
  const icons: Record<string, React.ReactNode> = {
    linkedin: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    twitter: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    ),
    github: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    behance: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.41 2.561-5.675 5.47-5.675 1.357 0 2.872.4 3.842 1.085l-1.458 2.327c-.442-.615-1.357-1.085-2.384-1.085-1.357 0-2.561.615-2.884 1.729h7.458c.442-1.729.442-2.884.442-3.41 0-1.357-.615-2.327-1.729-2.884-1.085-.557-2.561-.557-4.327-.557h-7.458v14.884h7.458c2.884 0 4.327-1.085 4.327-3.41 0-.557-.115-1.085-.442-1.614zm-7.458-5.675c0 1.729.615 2.884 1.729 2.884 1.085 0 1.729-.615 1.729-2.884 0-1.729-.615-2.884-1.729-2.884-1.085 0-1.729.615-1.729 2.884z"/>
      </svg>
    ),
    dribbble: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm6.568 4.5c1.5 1.5 2.5 3.5 2.5 5.5 0 1.5-.5 3-1.5 4.5-.5.5-1 1-1.5 1.5-.5-1.5-1-3-1.5-4.5-.5-1.5-1-3-1.5-4.5 1-.5 2-1 3-1.5zm-13.136 0c1 .5 2 1 3 1.5-.5 1.5-1 3-1.5 4.5-.5 1.5-1 3-1.5 4.5-.5-.5-1-1-1.5-1.5-1-1.5-1.5-3-1.5-4.5 0-2 1-4 2.5-5.5zm6.568 1.5c1.5 0 3 1 4.5 2.5-.5 1.5-1 3-1.5 4.5-.5 1.5-1 3-1.5 4.5-1.5 0-3-1-4.5-2.5.5-1.5 1-3 1.5-4.5.5-1.5 1-3 1.5-4.5zm0 9c1.5 0 3 1 4.5 2.5-.5 1.5-1 3-1.5 4.5-1.5 0-3-1-4.5-2.5.5-1.5 1-3 1.5-4.5zm-3 0c1.5 0 3 1 4.5 2.5-.5 1.5-1 3-1.5 4.5-1.5 0-3-1-4.5-2.5.5-1.5 1-3 1.5-4.5z"/>
      </svg>
    )
  }
  
  return icons[platform] || null
}

export const Team: React.FC<TeamProps> = ({ 
  deviceMode = 'desktop',
  title = 'Meet Our Team',
  subtitle = 'The talented people behind our success',
  members = [],
  layout = 'grid',
  columns = 4,
  showBio = true,
  showSocialLinks = true,
  cardStyle = 'modern'
}) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const nameSize = getResponsiveTextSize('text-lg', deviceMode)
  const roleSize = getResponsiveTextSize('text-base', deviceMode)
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
          {members.map((member) => (
            <div key={member.id} className={`text-center ${cardStyle === 'modern' ? 'p-4 bg-white rounded-lg shadow-sm' : ''}`}>
              <div className="mb-4">
                <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <h4 className={`font-semibold mb-1 ${nameSize}`}>{member.name}</h4>
              <p className={`text-blue-600 mb-3 ${roleSize}`}>{member.role}</p>
              
              {showBio && member.bio && (
                <p className={`text-gray-600 mb-4 ${textSize}`}>{member.bio}</p>
              )}
              
              {showSocialLinks && member.socialLinks && (
                <div className="flex justify-center space-x-3">
                  {Object.entries(member.socialLinks).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {getSocialIcon(platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
