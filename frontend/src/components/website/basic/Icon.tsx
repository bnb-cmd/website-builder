import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { 
  Heart, 
  Star, 
  Check, 
  X, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft,
  Home,
  User,
  Settings,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Download,
  Upload
} from 'lucide-react'

export const IconConfig: ComponentConfig = {
  id: 'icon',
  name: 'Icon',
  category: 'basic',
  icon: 'Star',
  description: 'Display icons from Lucide React',
  defaultProps: { 
    name: 'heart',
    size: 'medium',
    color: 'text-gray-600'
  },
  defaultSize: { width: 40, height: 40 },
  editableFields: ['name', 'size', 'color']
}

interface IconProps extends WebsiteComponentProps {
  name: string
  size: 'small' | 'medium' | 'large'
  color: string
}

const iconMap: Record<string, React.ComponentType<any>> = {
  heart: Heart,
  star: Star,
  check: Check,
  x: X,
  plus: Plus,
  minus: Minus,
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  home: Home,
  user: User,
  settings: Settings,
  search: Search,
  mail: Mail,
  phone: Phone,
  'map-pin': MapPin,
  calendar: Calendar,
  clock: Clock,
  download: Download,
  upload: Upload
}

export const WebsiteIcon: React.FC<IconProps> = ({ 
  name, 
  size, 
  color,
  deviceMode = 'desktop'
}) => {
  const IconComponent = iconMap[name] || Heart
  
  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'w-4 h-4'
      case 'medium': return 'w-6 h-6'
      case 'large': return 'w-8 h-8'
      default: return 'w-6 h-6'
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <IconComponent className={`${getSizeClass()} ${color}`} />
    </div>
  )
}
