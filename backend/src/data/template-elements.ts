import { ComponentConfig } from '@/lib/component-config'

// Reusable element configurations for templates
export interface TemplateElement {
  id: string
  type: string
  props: Record<string, any>
  style: Record<string, any>
  children: TemplateElement[]
}

// Element builder functions for common patterns
export class TemplateElementBuilder {
  // Navbar Elements
  static createNavbar(id: string, logo: string, menuItems: Array<{label: string, link: string}>, style = 'modern'): TemplateElement {
    return {
      id,
      type: 'navbar',
      props: {
        logo,
        menuItems,
        style,
        isSticky: true,
        showMobileMenu: true
      },
      style: {
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 0'
      },
      children: []
    }
  }

  // Hero Elements
  static createHero(
    id: string, 
    title: string, 
    subtitle: string, 
    ctaButtons: Array<{text: string, link: string, variant: string}>,
    backgroundImage?: string,
    style = 'centered'
  ): TemplateElement {
    return {
      id,
      type: 'hero',
      props: {
        title,
        subtitle,
        ctaButtons,
        backgroundImage,
        style,
        overlayOpacity: 0.4
      },
      style: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff'
      },
      children: []
    }
  }

  // Feature Grid Elements
  static createFeatureGrid(
    id: string,
    title: string,
    subtitle: string,
    features: Array<{icon: string, title: string, description: string}>,
    columns = 3
  ): TemplateElement {
    return {
      id,
      type: 'feature-grid',
      props: {
        title,
        subtitle,
        features,
        columns,
        showIcons: true
      },
      style: {
        padding: '4rem 0',
        backgroundColor: '#f9fafb'
      },
      children: []
    }
  }

  // About Section Elements
  static createAboutSection(
    id: string,
    title: string,
    content: string,
    imageUrl?: string,
    layout = 'text-image'
  ): TemplateElement {
    return {
      id,
      type: 'about-section',
      props: {
        title,
        content,
        imageUrl,
        layout,
        showStats: true
      },
      style: {
        padding: '4rem 0',
        backgroundColor: '#ffffff'
      },
      children: []
    }
  }

  // Contact Form Elements
  static createContactForm(
    id: string,
    title: string,
    subtitle: string,
    fields: Array<{name: string, type: string, required: boolean, placeholder: string}>,
    submitText = 'Send Message'
  ): TemplateElement {
    return {
      id,
      type: 'contact-form',
      props: {
        title,
        subtitle,
        fields,
        submitText,
        showMap: true,
        mapLocation: 'Karachi, Pakistan'
      },
      style: {
        padding: '4rem 0',
        backgroundColor: '#f9fafb'
      },
      children: []
    }
  }

  // Footer Elements
  static createFooter(
    id: string,
    logo: string,
    description: string,
    links: Array<{title: string, items: Array<{label: string, link: string}>}>,
    socialLinks: Array<{platform: string, url: string}>,
    copyright = '© 2025 All rights reserved.'
  ): TemplateElement {
    return {
      id,
      type: 'footer',
      props: {
        logo,
        description,
        links,
        socialLinks,
        copyright,
        showNewsletter: true
      },
      style: {
        backgroundColor: '#1f2937',
        color: '#ffffff',
        padding: '3rem 0 1rem'
      },
      children: []
    }
  }

  // Pricing Table Elements
  static createPricingTable(
    id: string,
    title: string,
    subtitle: string,
    plans: Array<{
      name: string,
      price: string,
      period: string,
      features: string[],
      isPopular?: boolean,
      ctaText: string
    }>
  ): TemplateElement {
    return {
      id,
      type: 'pricing-table',
      props: {
        title,
        subtitle,
        plans,
        showToggle: true,
        currency: 'PKR'
      },
      style: {
        padding: '4rem 0',
        backgroundColor: '#ffffff'
      },
      children: []
    }
  }

  // Testimonial Elements
  static createTestimonials(
    id: string,
    title: string,
    subtitle: string,
    testimonials: Array<{
      name: string,
      role: string,
      company: string,
      content: string,
      avatar?: string,
      rating: number
    }>,
    layout = 'carousel'
  ): TemplateElement {
    return {
      id,
      type: 'testimonials',
      props: {
        title,
        subtitle,
        testimonials,
        layout,
        showRating: true,
        autoPlay: true
      },
      style: {
        padding: '4rem 0',
        backgroundColor: '#f9fafb'
      },
      children: []
    }
  }

  // Team Section Elements
  static createTeamSection(
    id: string,
    title: string,
    subtitle: string,
    members: Array<{
      name: string,
      role: string,
      bio: string,
      avatar: string,
      socialLinks?: Array<{platform: string, url: string}>
    }>
  ): TemplateElement {
    return {
      id,
      type: 'team-section',
      props: {
        title,
        subtitle,
        members,
        layout: 'grid',
        showSocialLinks: true
      },
      style: {
        padding: '4rem 0',
        backgroundColor: '#ffffff'
      },
      children: []
    }
  }

  // Stats Counter Elements
  static createStatsCounter(
    id: string,
    stats: Array<{
      number: string,
      label: string,
      suffix?: string,
      icon?: string
    }>
  ): TemplateElement {
    return {
      id,
      type: 'stats-counter',
      props: {
        stats,
        animation: true,
        duration: 2000
      },
      style: {
        padding: '3rem 0',
        backgroundColor: '#3b82f6',
        color: '#ffffff'
      },
      children: []
    }
  }

  // Gallery Elements
  static createGallery(
    id: string,
    title: string,
    images: Array<{
      src: string,
      alt: string,
      caption?: string
    }>,
    layout = 'grid'
  ): TemplateElement {
    return {
      id,
      type: 'gallery',
      props: {
        title,
        images,
        layout,
        showLightbox: true,
        columns: 3
      },
      style: {
        padding: '4rem 0',
        backgroundColor: '#ffffff'
      },
      children: []
    }
  }

  // CTA Section Elements
  static createCTASection(
    id: string,
    title: string,
    subtitle: string,
    ctaButtons: Array<{text: string, link: string, variant: string}>,
    backgroundImage?: string,
    style = 'centered'
  ): TemplateElement {
    return {
      id,
      type: 'cta-section',
      props: {
        title,
        subtitle,
        ctaButtons,
        backgroundImage,
        style,
        overlayOpacity: 0.6
      },
      style: {
        padding: '4rem 0',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        textAlign: 'center'
      },
      children: []
    }
  }
}

// Pre-built element templates by category
export const elementTemplates = {
  // Navigation Elements
  navbar: {
    modern: (id: string) => TemplateElementBuilder.createNavbar(
      id,
      'Your Business',
      [
        { label: 'Home', link: '/' },
        { label: 'About', link: '/about' },
        { label: 'Services', link: '/services' },
        { label: 'Contact', link: '/contact' }
      ],
      'modern'
    ),
    minimal: (id: string) => TemplateElementBuilder.createNavbar(
      id,
      'Brand',
      [
        { label: 'Work', link: '/work' },
        { label: 'About', link: '/about' },
        { label: 'Contact', link: '/contact' }
      ],
      'minimal'
    )
  },

  // Hero Elements
  hero: {
    business: (id: string) => TemplateElementBuilder.createHero(
      id,
      'Transform Your Business',
      'We help businesses grow with innovative solutions and cutting-edge technology.',
      [
        { text: 'Get Started', link: '/contact', variant: 'primary' },
        { text: 'Learn More', link: '/about', variant: 'secondary' }
      ],
      undefined,
      'centered'
    ),
    startup: (id: string) => TemplateElementBuilder.createHero(
      id,
      'Launch Your Startup',
      'Build, scale, and succeed with our comprehensive startup solutions.',
      [
        { text: 'Start Building', link: '/signup', variant: 'primary' }
      ],
      undefined,
      'split'
    ),
    portfolio: (id: string) => TemplateElementBuilder.createHero(
      id,
      'Creative Portfolio',
      'Showcasing innovative designs and creative solutions.',
      [
        { text: 'View Work', link: '/portfolio', variant: 'primary' }
      ],
      undefined,
      'minimal'
    )
  },

  // Feature Elements
  features: {
    business: (id: string) => TemplateElementBuilder.createFeatureGrid(
      id,
      'Why Choose Us',
      'We provide comprehensive solutions for your business needs',
      [
        {
          icon: 'rocket',
          title: 'Fast Delivery',
          description: 'Get your projects completed quickly and efficiently.'
        },
        {
          icon: 'shield',
          title: 'Secure & Reliable',
          description: 'Your data is safe with our enterprise-grade security.'
        },
        {
          icon: 'support',
          title: '24/7 Support',
          description: 'Round-the-clock support whenever you need help.'
        }
      ],
      3
    ),
    tech: (id: string) => TemplateElementBuilder.createFeatureGrid(
      id,
      'Advanced Technology',
      'Cutting-edge solutions powered by the latest technology',
      [
        {
          icon: 'ai',
          title: 'AI-Powered',
          description: 'Leverage artificial intelligence for better results.'
        },
        {
          icon: 'cloud',
          title: 'Cloud Native',
          description: 'Built for the cloud with scalability in mind.'
        },
        {
          icon: 'mobile',
          title: 'Mobile First',
          description: 'Optimized for mobile devices and responsive design.'
        }
      ],
      3
    )
  },

  // About Elements
  about: {
    standard: (id: string) => TemplateElementBuilder.createAboutSection(
      id,
      'About Our Company',
      'We are a team of passionate professionals dedicated to delivering exceptional results. With years of experience in the industry, we understand what it takes to build successful businesses and create meaningful impact.',
      undefined,
      'text-image'
    ),
    mission: (id: string) => TemplateElementBuilder.createAboutSection(
      id,
      'Our Mission',
      'To empower businesses with innovative technology solutions that drive growth and success. We believe in the power of digital transformation and are committed to helping our clients achieve their goals.',
      undefined,
      'image-text'
    )
  },

  // Contact Elements
  contact: {
    standard: (id: string) => TemplateElementBuilder.createContactForm(
      id,
      'Get In Touch',
      'Ready to start your project? Contact us today for a free consultation.',
      [
        { name: 'name', type: 'text', required: true, placeholder: 'Your Name' },
        { name: 'email', type: 'email', required: true, placeholder: 'Your Email' },
        { name: 'phone', type: 'tel', required: false, placeholder: 'Your Phone' },
        { name: 'message', type: 'textarea', required: true, placeholder: 'Your Message' }
      ],
      'Send Message'
    ),
    business: (id: string) => TemplateElementBuilder.createContactForm(
      id,
      'Let\'s Work Together',
      'Have a project in mind? We\'d love to hear about it.',
      [
        { name: 'company', type: 'text', required: true, placeholder: 'Company Name' },
        { name: 'name', type: 'text', required: true, placeholder: 'Contact Person' },
        { name: 'email', type: 'email', required: true, placeholder: 'Business Email' },
        { name: 'phone', type: 'tel', required: true, placeholder: 'Phone Number' },
        { name: 'project', type: 'select', required: true, placeholder: 'Project Type' },
        { name: 'budget', type: 'select', required: false, placeholder: 'Budget Range' },
        { name: 'timeline', type: 'select', required: false, placeholder: 'Timeline' },
        { name: 'message', type: 'textarea', required: true, placeholder: 'Project Details' }
      ],
      'Request Quote'
    )
  },

  // Footer Elements
  footer: {
    business: (id: string) => TemplateElementBuilder.createFooter(
      id,
      'Your Business',
      'Building the future of business with innovative solutions and exceptional service.',
      [
        {
          title: 'Company',
          items: [
            { label: 'About Us', link: '/about' },
            { label: 'Our Team', link: '/team' },
            { label: 'Careers', link: '/careers' },
            { label: 'Contact', link: '/contact' }
          ]
        },
        {
          title: 'Services',
          items: [
            { label: 'Web Development', link: '/services/web' },
            { label: 'Mobile Apps', link: '/services/mobile' },
            { label: 'Consulting', link: '/services/consulting' },
            { label: 'Support', link: '/support' }
          ]
        },
        {
          title: 'Resources',
          items: [
            { label: 'Blog', link: '/blog' },
            { label: 'Documentation', link: '/docs' },
            { label: 'Help Center', link: '/help' },
            { label: 'Community', link: '/community' }
          ]
        }
      ],
      [
        { platform: 'facebook', url: 'https://facebook.com/yourbusiness' },
        { platform: 'twitter', url: 'https://twitter.com/yourbusiness' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/yourbusiness' },
        { platform: 'instagram', url: 'https://instagram.com/yourbusiness' }
      ],
      '© 2025 Your Business. All rights reserved.'
    ),
    minimal: (id: string) => TemplateElementBuilder.createFooter(
      id,
      'Brand',
      'Creating beautiful digital experiences.',
      [
        {
          title: 'Work',
          items: [
            { label: 'Portfolio', link: '/portfolio' },
            { label: 'Case Studies', link: '/case-studies' }
          ]
        },
        {
          title: 'Company',
          items: [
            { label: 'About', link: '/about' },
            { label: 'Contact', link: '/contact' }
          ]
        }
      ],
      [
        { platform: 'twitter', url: 'https://twitter.com/brand' },
        { platform: 'instagram', url: 'https://instagram.com/brand' }
      ],
      '© 2025 Brand. All rights reserved.'
    )
  }
}

// Industry-specific element configurations
export const industryElements = {
  restaurant: {
    hero: (id: string) => TemplateElementBuilder.createHero(
      id,
      'Delicious Food, Great Atmosphere',
      'Experience the finest cuisine in a warm and welcoming environment.',
      [
        { text: 'View Menu', link: '/menu', variant: 'primary' },
        { text: 'Make Reservation', link: '/reservation', variant: 'secondary' }
      ],
      undefined,
      'centered'
    ),
    menu: (id: string) => ({
      id,
      type: 'menu-section',
      props: {
        title: 'Our Menu',
        subtitle: 'Fresh ingredients, authentic flavors',
        categories: [
          {
            name: 'Appetizers',
            items: [
              { name: 'Bruschetta', description: 'Fresh tomatoes, basil, garlic', price: 'Rs. 450' },
              { name: 'Caesar Salad', description: 'Romaine lettuce, parmesan, croutons', price: 'Rs. 550' }
            ]
          },
          {
            name: 'Main Courses',
            items: [
              { name: 'Grilled Salmon', description: 'Fresh salmon with herbs', price: 'Rs. 1,200' },
              { name: 'Chicken Parmesan', description: 'Breaded chicken with marinara', price: 'Rs. 950' }
            ]
          }
        ]
      },
      style: {
        padding: '4rem 0',
        backgroundColor: '#ffffff'
      },
      children: []
    })
  },

  medical: {
    hero: (id: string) => TemplateElementBuilder.createHero(
      id,
      'Your Health, Our Priority',
      'Comprehensive healthcare services with compassionate care.',
      [
        { text: 'Book Appointment', link: '/appointment', variant: 'primary' },
        { text: 'Emergency', link: '/emergency', variant: 'secondary' }
      ],
      undefined,
      'centered'
    ),
    services: (id: string) => TemplateElementBuilder.createFeatureGrid(
      id,
      'Our Services',
      'Comprehensive healthcare services for all your needs',
      [
        {
          icon: 'heart',
          title: 'Cardiology',
          description: 'Expert heart care and cardiovascular treatments.'
        },
        {
          icon: 'brain',
          title: 'Neurology',
          description: 'Advanced neurological care and treatments.'
        },
        {
          icon: 'bone',
          title: 'Orthopedics',
          description: 'Bone and joint care with modern techniques.'
        }
      ],
      3
    )
  },

  ecommerce: {
    hero: (id: string) => TemplateElementBuilder.createHero(
      id,
      'Shop the Latest Trends',
      'Discover amazing products at unbeatable prices.',
      [
        { text: 'Shop Now', link: '/products', variant: 'primary' },
        { text: 'View Sale', link: '/sale', variant: 'secondary' }
      ],
      undefined,
      'centered'
    ),
    products: (id: string) => ({
      id,
      type: 'product-grid',
      props: {
        title: 'Featured Products',
        subtitle: 'Handpicked items just for you',
        products: [
          {
            name: 'Wireless Headphones',
            price: 'Rs. 2,500',
            originalPrice: 'Rs. 3,000',
            image: '/images/products/headphones.jpg',
            rating: 4.5,
            reviews: 128
          },
          {
            name: 'Smart Watch',
            price: 'Rs. 8,500',
            originalPrice: 'Rs. 10,000',
            image: '/images/products/smartwatch.jpg',
            rating: 4.8,
            reviews: 89
          }
        ],
        columns: 3,
        showRating: true,
        showReviews: true
      },
      style: {
        padding: '4rem 0',
        backgroundColor: '#ffffff'
      },
      children: []
    })
  }
}

// Pakistan-specific elements
export const pakistanElements = {
  paymentMethods: (id: string) => ({
    id,
    type: 'payment-methods',
    props: {
      title: 'Payment Options',
      methods: [
        { name: 'JazzCash', icon: 'jazzcash', description: 'Mobile wallet payments' },
        { name: 'EasyPaisa', icon: 'easypaisa', description: 'Digital payments' },
        { name: 'Bank Transfer', icon: 'bank', description: 'Direct bank transfer' },
        { name: 'Cash on Delivery', icon: 'cash', description: 'Pay when delivered' }
      ]
    },
    style: {
      padding: '2rem 0',
      backgroundColor: '#f9fafb'
    },
    children: []
  }),

  contactInfo: (id: string) => ({
    id,
    type: 'contact-info',
    props: {
      title: 'Contact Information',
      info: [
        { type: 'phone', label: 'Phone', value: '+92 21 1234567' },
        { type: 'email', label: 'Email', value: 'info@company.com.pk' },
        { type: 'address', label: 'Address', value: '123 Main Street, Karachi, Pakistan' },
        { type: 'hours', label: 'Business Hours', value: 'Mon-Fri: 9AM-6PM' }
      ]
    },
    style: {
      padding: '2rem 0',
      backgroundColor: '#ffffff'
    },
    children: []
  })
}

export default {
  TemplateElementBuilder,
  elementTemplates,
  industryElements,
  pakistanElements
}
