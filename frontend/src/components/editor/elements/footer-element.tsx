import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

interface FooterElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function FooterElement({ element, onUpdate, viewMode, style, children }: FooterElementProps) {
  const handleCompanyChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newCompany = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        company: newCompany
      }
    })
  }

  const handleDescriptionChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newDescription = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        description: newDescription
      }
    })
  }

  const getVariantClass = () => {
    switch (element.props.variant) {
      case 'dark':
        return 'bg-gray-900 text-white'
      case 'light':
        return 'bg-gray-100 text-gray-900'
      case 'primary':
        return 'bg-primary text-primary-foreground'
      default:
        return 'bg-gray-900 text-white'
    }
  }

  const getLayoutClass = () => {
    const columns = element.props.columns || 4
    return `grid grid-cols-1 md:grid-cols-${columns} gap-8`
  }

  const socialLinks = element.props.socialLinks || [
    { name: 'Facebook', icon: Facebook, url: '#' },
    { name: 'Twitter', icon: Twitter, url: '#' },
    { name: 'Instagram', icon: Instagram, url: '#' },
    { name: 'LinkedIn', icon: Linkedin, url: '#' }
  ]

  const contactInfo = element.props.contactInfo || {
    email: 'contact@company.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business St, City, State 12345'
  }

  return (
    <footer
      className={cn(
        'w-full',
        getVariantClass()
      )}
      style={style}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className={getLayoutClass()}>
          {/* Company Info */}
          <div className="space-y-4">
            <div
              className="text-2xl font-bold"
              contentEditable
              suppressContentEditableWarning
              onBlur={handleCompanyChange}
            >
              {element.props.company || 'Company Name'}
            </div>
            <div
              className="text-sm opacity-80"
              contentEditable
              suppressContentEditableWarning
              onBlur={handleDescriptionChange}
            >
              {element.props.description || 'Company description and mission statement.'}
            </div>
            
            {/* Social Links */}
            {element.props.showSocial && (
              <div className="flex space-x-4">
                {socialLinks.map((social: any, index: number) => (
                  <a
                    key={index}
                    href={social.url}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              {['Home', 'About', 'Services', 'Contact'].map((link, index) => (
                <a key={index} href="#" className="block text-sm opacity-80 hover:opacity-100 transition-opacity">
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <div className="space-y-2">
              {['Web Design', 'Development', 'Marketing', 'Support'].map((service, index) => (
                <a key={index} href="#" className="block text-sm opacity-80 hover:opacity-100 transition-opacity">
                  {service}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm opacity-80">
                <Mail className="h-4 w-4" />
                <span>{contactInfo.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm opacity-80">
                <Phone className="h-4 w-4" />
                <span>{contactInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm opacity-80">
                <MapPin className="h-4 w-4" />
                <span>{contactInfo.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm opacity-80">
            © {new Date().getFullYear()} {element.props.company || 'Company Name'}. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</a>
            <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Terms of Service</a>
          </div>
        </div>
      </div>

      {!children && (
        <div className="absolute inset-0 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground pointer-events-none">
          <div className="text-center">
            <p>Footer Component</p>
            <p className="text-xs mt-1">
              Variant: {element.props.variant || 'dark'} | 
              Columns: {element.props.columns || 4}
            </p>
          </div>
        </div>
      )}
    </footer>
  )
}
