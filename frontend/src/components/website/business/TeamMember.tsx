import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Mail, Linkedin, Twitter } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const TeamMemberConfig: ComponentConfig = {
  id: 'team-member',
  name: 'Team Member',
  category: 'business',
  icon: 'User',
  description: 'Display team member profiles',
  defaultProps: { 
    name: 'John Doe',
    role: 'CEO & Founder',
    bio: 'Passionate leader with 10+ years of experience in the industry.',
    image: '',
    email: 'john@company.com',
    linkedin: 'https://linkedin.com/in/johndoe',
    twitter: 'https://twitter.com/johndoe',
    showSocial: true
  },
  defaultSize: { width: 300, height: 350 },
  editableFields: ['name', 'role', 'bio', 'image', 'email', 'linkedin', 'twitter', 'showSocial']
}

interface TeamMemberProps extends WebsiteComponentProps {
  name: string
  role: string
  bio: string
  image: string
  email: string
  linkedin: string
  twitter: string
  showSocial: boolean
}

export const WebsiteTeamMember: React.FC<TeamMemberProps> = ({ 
  name, 
  role, 
  bio, 
  image, 
  email, 
  linkedin, 
  twitter, 
  showSocial,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const padding = getResponsivePadding('p-6', deviceMode)
  const nameSize = getResponsiveTextSize('text-xl', deviceMode)
  const roleSize = getResponsiveTextSize('text-sm', deviceMode)
  const bioSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <div className={cn("w-full h-full bg-white border border-gray-200 rounded-lg text-center", padding)}>
      <div className="space-y-4">
        <Avatar className="w-20 h-20 mx-auto">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="text-lg">
            {name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h3 
            className={cn("font-bold", nameSize)}
            onDoubleClick={onTextDoubleClick}
          >
            {name}
          </h3>
          <p 
            className={cn("text-primary font-medium", roleSize)}
            onDoubleClick={onTextDoubleClick}
          >
            {role}
          </p>
        </div>
        
        <p 
          className={cn("text-gray-600", bioSize)}
          onDoubleClick={onTextDoubleClick}
        >
          {bio}
        </p>
        
        {showSocial && (
          <div className="flex justify-center space-x-3">
            <a 
              href={`mailto:${email}`}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Mail className="w-4 h-4 text-gray-600" />
            </a>
            <a 
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Linkedin className="w-4 h-4 text-gray-600" />
            </a>
            <a 
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Twitter className="w-4 h-4 text-gray-600" />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
