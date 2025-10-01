import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { User, Mail, Phone, MapPin, MessageSquare } from 'lucide-react'

interface ContactElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function ContactElement({ element, onUpdate, viewMode, style, children }: ContactElementProps) {
  const handleTitleChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newTitle = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        title: newTitle
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

  const getLayoutClass = () => {
    switch (element.props.layout) {
      case 'side-by-side':
        return 'grid grid-cols-1 lg:grid-cols-2 gap-8'
      case 'stacked':
        return 'flex flex-col space-y-8'
      case 'centered':
        return 'max-w-2xl mx-auto'
      default:
        return 'grid grid-cols-1 lg:grid-cols-2 gap-8'
    }
  }

  const contactInfo = element.props.contactInfo || {
    email: 'contact@company.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business St, City, State 12345',
    hours: 'Mon-Fri: 9AM-6PM'
  }

  return (
    <div
      className={cn(
        'w-full p-8',
        getLayoutClass()
      )}
      style={style}
    >
      {/* Contact Info Section */}
      <div className="space-y-6">
        <div>
          <div
            className="text-3xl font-bold mb-4"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTitleChange}
          >
            {element.props.title || 'Get in Touch'}
          </div>
          <div
            className="text-muted-foreground"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleDescriptionChange}
          >
            {element.props.description || 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.'}
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-primary" />
            <span>{contactInfo.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-primary" />
            <span>{contactInfo.phone}</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-primary" />
            <span>{contactInfo.address}</span>
          </div>
          {contactInfo.hours && (
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span>{contactInfo.hours}</span>
            </div>
          )}
        </div>

        {/* Social Links */}
        {element.props.showSocial && (
          <div className="flex space-x-4">
            {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social, index) => (
              <a
                key={index}
                href="#"
                className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Contact Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            className="px-4 py-2 border border-border rounded-md bg-background text-foreground"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="px-4 py-2 border border-border rounded-md bg-background text-foreground"
          />
        </div>
        <input
          type="email"
          placeholder="Email Address"
          className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground"
        />
        <input
          type="text"
          placeholder="Subject"
          className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground"
        />
        <textarea
          placeholder="Your Message"
          rows={4}
          className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground"
        />
        <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          Send Message
        </button>
      </div>

      {!children && (
        <div className="absolute inset-0 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground pointer-events-none">
          <div className="text-center">
            <p>Contact Component</p>
            <p className="text-xs mt-1">
              Layout: {element.props.layout || 'side-by-side'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
