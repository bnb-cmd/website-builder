import { ComponentConfig } from './component-config'

export interface PropertyPreset {
  name: string
  description: string
  properties: Record<string, any>
}

export const componentPresets: Record<string, PropertyPreset[]> = {
  'button': [
    {
      name: 'Primary',
      description: 'Primary action button',
      properties: { variant: 'default', text: 'Click Me' }
    },
    {
      name: 'Secondary',
      description: 'Secondary action button',
      properties: { variant: 'secondary', text: 'Learn More' }
    },
    {
      name: 'Outline',
      description: 'Outlined button',
      properties: { variant: 'outline', text: 'Get Started' }
    },
    {
      name: 'Ghost',
      description: 'Ghost button',
      properties: { variant: 'ghost', text: 'Cancel' }
    }
  ],
  
  'navbar': [
    {
      name: 'Minimalist',
      description: 'Clean and simple navigation',
      properties: { style: 'minimalist', isSticky: false, showMobileMenu: true }
    },
    {
      name: 'Modern',
      description: 'Modern navigation with shadow',
      properties: { style: 'modern', isSticky: true, showMobileMenu: true }
    },
    {
      name: 'Classic',
      description: 'Classic dark navigation',
      properties: { style: 'classic', isSticky: false, showMobileMenu: true }
    }
  ],
  
  'hero-section': [
    {
      name: 'Call to Action',
      description: 'Compelling CTA hero',
      properties: { 
        title: 'Transform Your Business Today',
        subtitle: 'Join thousands of satisfied customers who have revolutionized their workflow with our innovative solutions.',
        buttonText: 'Get Started Now'
      }
    },
    {
      name: 'Product Launch',
      description: 'Product announcement hero',
      properties: { 
        title: 'Introducing Our Latest Innovation',
        subtitle: 'Experience the future of technology with our groundbreaking new product.',
        buttonText: 'Learn More'
      }
    },
    {
      name: 'Brand Story',
      description: 'Brand narrative hero',
      properties: { 
        title: 'Your Story Starts Here',
        subtitle: 'We believe in empowering businesses to tell their unique stories through beautiful, functional design.',
        buttonText: 'Discover More'
      }
    }
  ],
  
  'product-card': [
    {
      name: 'Grid Layout',
      description: 'Standard grid product card',
      properties: { 
        layout: 'grid',
        size: 'medium',
        showRating: true,
        showWishlist: true,
        showQuickView: true
      }
    },
    {
      name: 'Compact',
      description: 'Compact product card',
      properties: { 
        layout: 'grid',
        size: 'small',
        showRating: false,
        showWishlist: true,
        showQuickView: false
      }
    },
    {
      name: 'Detailed',
      description: 'Detailed product card',
      properties: { 
        layout: 'grid',
        size: 'large',
        showRating: true,
        showWishlist: true,
        showQuickView: true,
        showShare: true,
        showStock: true,
        showBadge: true
      }
    }
  ],
  
  'contact-form': [
    {
      name: 'Basic',
      description: 'Essential contact fields',
      properties: { 
        showName: true,
        showEmail: true,
        showMessage: true,
        showSubject: true,
        showPhone: false,
        showCompany: false,
        layout: 'single'
      }
    },
    {
      name: 'Complete',
      description: 'Full contact form',
      properties: { 
        showName: true,
        showEmail: true,
        showPhone: true,
        showCompany: true,
        showMessage: true,
        showSubject: true,
        showAddress: true,
        showWebsite: true,
        layout: 'single'
      }
    },
    {
      name: 'Minimal',
      description: 'Minimal contact form',
      properties: { 
        showName: true,
        showEmail: true,
        showMessage: true,
        showSubject: false,
        showPhone: false,
        showCompany: false,
        layout: 'single'
      }
    }
  ],
  
  'card': [
    {
      name: 'Elevated',
      description: 'Card with shadow',
      properties: { 
        variant: 'elevated',
        padding: 'large'
      }
    },
    {
      name: 'Flat',
      description: 'Flat card design',
      properties: { 
        variant: 'flat',
        padding: 'medium'
      }
    },
    {
      name: 'Outlined',
      description: 'Card with border',
      properties: { 
        variant: 'outlined',
        padding: 'medium'
      }
    }
  ],
  
  'accordion': [
    {
      name: 'Single',
      description: 'One section open at a time',
      properties: { 
        allowMultiple: false
      }
    },
    {
      name: 'Multiple',
      description: 'Multiple sections can be open',
      properties: { 
        allowMultiple: true
      }
    }
  ],
  
  'carousel': [
    {
      name: 'Auto-play',
      description: 'Automatically advancing carousel',
      properties: { 
        autoplay: true,
        interval: 5000,
        showArrows: true,
        showDots: true,
        transition: 'slide'
      }
    },
    {
      name: 'Manual',
      description: 'User-controlled carousel',
      properties: { 
        autoplay: false,
        showArrows: true,
        showDots: true,
        transition: 'slide'
      }
    },
    {
      name: 'Fade',
      description: 'Fade transition carousel',
      properties: { 
        autoplay: true,
        interval: 4000,
        showArrows: true,
        showDots: true,
        transition: 'fade'
      }
    }
  ]
}

export const getPresetsForComponent = (componentType: string): PropertyPreset[] => {
  return componentPresets[componentType] || []
}

export const applyPreset = (componentProps: Record<string, any>, preset: PropertyPreset): Record<string, any> => {
  return {
    ...componentProps,
    ...preset.properties
  }
}
