'use client'

import { Element } from '@/types/editor'
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react'

interface TeamElementProps {
  element: Element
  isSelected: boolean
  onSelect: () => void
}

export function TeamElement({ element, isSelected, onSelect }: TeamElementProps) {
  const { 
    members = [],
    layout = 'grid',
    showSocial = true
  } = element.props

  const defaultMembers = members.length > 0 ? members : [
    {
      name: 'Ahmed Ali',
      role: 'Founder & CEO',
      image: 'https://via.placeholder.com/200',
      bio: 'Visionary leader with 10+ years in tech.',
      social: {
        twitter: '#',
        linkedin: '#',
        email: 'ahmed@example.com'
      }
    },
    {
      name: 'Fatima Hassan',
      role: 'CTO',
      image: 'https://via.placeholder.com/200',
      bio: 'Tech expert specializing in scalable solutions.',
      social: {
        twitter: '#',
        linkedin: '#',
        email: 'fatima@example.com'
      }
    },
    {
      name: 'Bilal Sheikh',
      role: 'Head of Design',
      image: 'https://via.placeholder.com/200',
      bio: 'Creative mind behind our beautiful interfaces.',
      social: {
        twitter: '#',
        linkedin: '#',
        email: 'bilal@example.com'
      }
    },
    {
      name: 'Sara Khan',
      role: 'Marketing Director',
      image: 'https://via.placeholder.com/200',
      bio: 'Growth strategist with proven track record.',
      social: {
        facebook: '#',
        linkedin: '#',
        email: 'sara@example.com'
      }
    }
  ]

  const socialIcons: Record<string, any> = {
    facebook: Facebook,
    twitter: Twitter,
    linkedin: Linkedin,
    email: Mail
  }

  return (
    <div
      onClick={onSelect}
      className={`
        p-8 cursor-pointer transition-all
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Meet Our Team</h2>
        <p className="text-muted-foreground">The people behind our success</p>
      </div>

      <div className={`
        grid gap-6
        ${layout === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
          : 'grid-cols-1 max-w-4xl mx-auto'
        }
      `}>
        {defaultMembers.map((member: any, index: number) => (
          <div 
            key={index}
            className="text-center group"
          >
            <div className="relative mb-4 overflow-hidden rounded-lg">
              <img
                src={member.image}
                alt={member.name}
                className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {showSocial && (
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  {Object.entries(member.social).map(([platform, url]) => {
                    const Icon = socialIcons[platform]
                    return Icon ? (
                      <a
                        key={platform}
                        href={platform === 'email' ? `mailto:${url}` : url}
                        onClick={(e) => e.stopPropagation()}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    ) : null
                  })}
                </div>
              )}
            </div>
            
            <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
            <p className="text-primary text-sm mb-2">{member.role}</p>
            <p className="text-muted-foreground text-sm">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
