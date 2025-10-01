import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { UserPlus, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'

interface RegisterElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function RegisterElement({ element, onUpdate, viewMode, style, children }: RegisterElementProps) {
  const handleTitleChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newTitle = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        title: newTitle
      }
    })
  }

  const getVariantClass = () => {
    switch (element.props.variant) {
      case 'card':
        return 'bg-card border border-border rounded-lg'
      case 'minimal':
        return 'bg-transparent'
      case 'centered':
        return 'bg-card border border-border rounded-lg max-w-md mx-auto'
      default:
        return 'bg-card border border-border rounded-lg'
    }
  }

  return (
    <div
      className={cn(
        'w-full p-8',
        getVariantClass()
      )}
      style={style}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="text-2xl font-bold mb-2"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTitleChange}
        >
          {element.props.title || 'Create Account'}
        </div>
        <p className="text-muted-foreground">
          Join us today and get started
        </p>
      </div>

      {/* Registration Form */}
      <form className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              First Name
            </label>
            <input
              type="text"
              placeholder="Enter your first name"
              className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Enter your last name"
              className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              placeholder="Create a password"
              className="w-full pl-10 pr-12 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full pl-10 pr-12 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-3">
          <label className="flex items-start">
            <input
              type="checkbox"
              className="mt-1 rounded border-border text-primary focus:ring-primary"
            />
            <span className="ml-2 text-sm text-foreground">
              I agree to the{' '}
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                Privacy Policy
              </a>
            </span>
          </label>
          
          <label className="flex items-start">
            <input
              type="checkbox"
              className="mt-1 rounded border-border text-primary focus:ring-primary"
            />
            <span className="ml-2 text-sm text-foreground">
              I would like to receive marketing emails and updates
            </span>
          </label>
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="w-full py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
        >
          Create Account
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">Or register with</span>
          </div>
        </div>

        {/* Social Registration */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors">
            <span className="text-sm font-medium">Google</span>
          </button>
          <button className="flex items-center justify-center px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors">
            <span className="text-sm font-medium">GitHub</span>
          </button>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <span className="text-sm text-muted-foreground">Already have an account? </span>
          <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
            Sign in
          </a>
        </div>
      </form>

      {!children && (
        <div className="absolute inset-0 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground pointer-events-none">
          <div className="text-center">
            <UserPlus className="h-8 w-8 mx-auto mb-2" />
            <p>Registration Form</p>
            <p className="text-xs mt-1">
              Variant: {element.props.variant || 'card'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
