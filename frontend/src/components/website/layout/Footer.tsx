import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const FooterConfig: ComponentConfig = {
  id: 'footer',
  name: 'Footer',
  category: 'layout',
  icon: 'Layout',
  description: 'Create page footers with links and info',
  defaultProps: { 
    company: 'Your Company',
    copyright: '© 2024 Your Company. All rights reserved.',
    links: ['Privacy Policy', 'Terms of Service', 'Contact'],
    social: ['Facebook', 'Twitter', 'LinkedIn']
  },
  defaultSize: { width: 800, height: 120 },
  editableFields: ['company', 'copyright', 'links', 'social']
}

interface FooterProps extends WebsiteComponentProps {
  company: string
  copyright: string
  links: string[]
  social: string[]
}

export const WebsiteFooter: React.FC<FooterProps> = ({ 
  company, 
  copyright, 
  links, 
  social,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const padding = getResponsivePadding('px-6 py-8', deviceMode)
  const companySize = getResponsiveTextSize('text-lg', deviceMode)
  const copyrightSize = getResponsiveTextSize('text-sm', deviceMode)
  const linkSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <footer className="w-full h-full bg-gray-900 text-white">
      <div className={cn("max-w-6xl mx-auto", padding)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 
              className={cn("font-bold mb-4", companySize)}
              onDoubleClick={onTextDoubleClick}
            >
              {company}
            </h3>
            <p 
              className={cn("text-gray-400", copyrightSize)}
              onDoubleClick={onTextDoubleClick}
            >
              {copyright}
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h4 className={cn("font-semibold mb-4", linkSize)}>Quick Links</h4>
            <ul className="space-y-2">
              {(links || []).map((link, index) => (
                <li key={index}>
                  <a 
                    href="#"
                    className={cn("text-gray-400 hover:text-white transition-colors", linkSize)}
                    onDoubleClick={onTextDoubleClick}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Social */}
          <div>
            <h4 className={cn("font-semibold mb-4", linkSize)}>Follow Us</h4>
            <div className="flex space-x-4">
              {(social || []).map((platform, index) => (
                <a 
                  key={index}
                  href="#"
                  className={cn("text-gray-400 hover:text-white transition-colors", linkSize)}
                  onDoubleClick={onTextDoubleClick}
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
