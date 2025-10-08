const fs = require('fs')
const path = require('path')

// Import template elements
const { TemplateElementBuilder, elementTemplates, industryElements } = require('../src/data/template-elements.ts')

// 2025 Trending Templates that need complete configurations
const trendingTemplates = [
  {
    id: 'glassmorphism-modern',
    name: 'Glassmorphism Modern',
    category: 'Business',
    style: 'glassmorphism',
    industry: 'tech'
  },
  {
    id: 'dark-mode-premium',
    name: 'Dark Mode Premium',
    category: 'Business',
    style: 'dark-mode',
    industry: 'tech'
  },
  {
    id: 'neomorphism-soft',
    name: 'Neomorphism Soft',
    category: 'Business',
    style: 'neomorphism',
    industry: 'tech'
  },
  {
    id: 'brutalism-bold',
    name: 'Brutalism Bold',
    category: 'Business',
    style: 'brutalism',
    industry: 'creative'
  },
  {
    id: 'ai-assistant-platform',
    name: 'AI Assistant Platform',
    category: 'Business',
    style: 'modern',
    industry: 'ai'
  },
  {
    id: 'machine-learning-lab',
    name: 'Machine Learning Lab',
    category: 'Business',
    style: 'scientific',
    industry: 'ai'
  },
  {
    id: 'automation-suite',
    name: 'Automation Suite',
    category: 'Business',
    style: 'modern',
    industry: 'automation'
  },
  {
    id: 'remote-work-hub',
    name: 'Remote Work Hub',
    category: 'Business',
    style: 'modern',
    industry: 'collaboration'
  },
  {
    id: 'virtual-office',
    name: 'Virtual Office',
    category: 'Business',
    style: 'modern',
    industry: 'coworking'
  },
  {
    id: 'crypto-exchange',
    name: 'Crypto Exchange',
    category: 'Business',
    style: 'modern',
    industry: 'crypto'
  },
  {
    id: 'nft-marketplace',
    name: 'NFT Marketplace',
    category: 'Business',
    style: 'modern',
    industry: 'nft'
  },
  {
    id: 'metaverse-platform',
    name: 'Metaverse Platform',
    category: 'Business',
    style: 'futuristic',
    industry: 'metaverse'
  },
  {
    id: 'ar-vr-showcase',
    name: 'AR/VR Showcase',
    category: 'Business',
    style: 'immersive',
    industry: 'ar-vr'
  },
  {
    id: 'iot-dashboard',
    name: 'IoT Dashboard',
    category: 'Business',
    style: 'dashboard',
    industry: 'iot'
  },
  {
    id: 'smart-home-platform',
    name: 'Smart Home Platform',
    category: 'Business',
    style: 'modern',
    industry: 'smart-home'
  }
]

// Generate elements for trending templates
function generateTrendingElements(template) {
  const elements = []
  
  // Navbar
  elements.push(TemplateElementBuilder.createNavbar(
    `navbar-${template.id}`,
    template.name,
    getMenuItems(template.industry),
    'modern'
  ))
  
  // Hero section with style-specific configurations
  elements.push(generateTrendingHero(template))
  
  // Industry-specific sections
  elements.push(generateIndustrySections(template))
  
  // Contact form
  elements.push(generateContactSection(template))
  
  // Footer
  elements.push(generateFooterSection(template))
  
  return elements
}

// Generate trending hero sections
function generateTrendingHero(template) {
  const heroConfigs = {
    glassmorphism: {
      title: 'Modern Glass Design',
      subtitle: 'Experience the future of web design with glassmorphism effects.',
      ctaButtons: [
        { text: 'Explore Features', link: '/features', variant: 'primary' },
        { text: 'View Demo', link: '/demo', variant: 'secondary' }
      ],
      backgroundImage: '/templates/hero-glassmorphism.jpg',
      style: 'glassmorphism'
    },
    'dark-mode': {
      title: 'Premium Dark Experience',
      subtitle: 'Sleek, modern design that reduces eye strain and looks professional.',
      ctaButtons: [
        { text: 'Get Started', link: '/signup', variant: 'primary' },
        { text: 'Learn More', link: '/about', variant: 'secondary' }
      ],
      backgroundImage: '/templates/hero-dark-mode.jpg',
      style: 'dark-mode'
    },
    neomorphism: {
      title: 'Soft & Modern',
      subtitle: 'Clean, minimalist design with soft shadows and modern aesthetics.',
      ctaButtons: [
        { text: 'Try It Out', link: '/demo', variant: 'primary' }
      ],
      backgroundImage: '/templates/hero-neomorphism.jpg',
      style: 'neomorphism'
    },
    brutalism: {
      title: 'Bold & Creative',
      subtitle: 'Stand out with bold, unconventional design that demands attention.',
      ctaButtons: [
        { text: 'View Portfolio', link: '/portfolio', variant: 'primary' },
        { text: 'Get Quote', link: '/contact', variant: 'secondary' }
      ],
      backgroundImage: '/templates/hero-brutalism.jpg',
      style: 'brutalism'
    },
    ai: {
      title: 'AI-Powered Solutions',
      subtitle: 'Harness the power of artificial intelligence for your business.',
      ctaButtons: [
        { text: 'Try AI Demo', link: '/demo', variant: 'primary' },
        { text: 'See Features', link: '/features', variant: 'secondary' }
      ],
      backgroundImage: '/templates/hero-ai.jpg',
      style: 'modern'
    },
    automation: {
      title: 'Automate Everything',
      subtitle: 'Streamline your workflows with intelligent automation tools.',
      ctaButtons: [
        { text: 'Start Automating', link: '/automation', variant: 'primary' },
        { text: 'View Workflows', link: '/workflows', variant: 'secondary' }
      ],
      backgroundImage: '/templates/hero-automation.jpg',
      style: 'modern'
    },
    crypto: {
      title: 'Trade Crypto Safely',
      subtitle: 'Secure, fast, and reliable cryptocurrency trading platform.',
      ctaButtons: [
        { text: 'Start Trading', link: '/trade', variant: 'primary' },
        { text: 'Learn Crypto', link: '/learn', variant: 'secondary' }
      ],
      backgroundImage: '/templates/hero-crypto.jpg',
      style: 'modern'
    },
    nft: {
      title: 'Discover NFTs',
      subtitle: 'Explore, buy, and sell unique digital assets in our marketplace.',
      ctaButtons: [
        { text: 'Browse NFTs', link: '/marketplace', variant: 'primary' },
        { text: 'Create NFT', link: '/create', variant: 'secondary' }
      ],
      backgroundImage: '/templates/hero-nft.jpg',
      style: 'modern'
    },
    metaverse: {
      title: 'Enter the Metaverse',
      subtitle: 'Experience virtual worlds and connect with others in immersive environments.',
      ctaButtons: [
        { text: 'Enter Now', link: '/metaverse', variant: 'primary' },
        { text: 'Learn More', link: '/about', variant: 'secondary' }
      ],
      backgroundImage: '/templates/hero-metaverse.jpg',
      style: 'futuristic'
    },
    'ar-vr': {
      title: 'Immersive Experiences',
      subtitle: 'Create and experience augmented and virtual reality content.',
      ctaButtons: [
        { text: 'Try AR/VR', link: '/demo', variant: 'primary' },
        { text: 'View Gallery', link: '/gallery', variant: 'secondary' }
      ],
      backgroundImage: '/templates/hero-ar-vr.jpg',
      style: 'immersive'
    },
    iot: {
      title: 'Connected World',
      subtitle: 'Monitor and control your IoT devices from anywhere.',
      ctaButtons: [
        { text: 'View Dashboard', link: '/dashboard', variant: 'primary' },
        { text: 'Add Device', link: '/devices', variant: 'secondary' }
      ],
      backgroundImage: '/templates/hero-iot.jpg',
      style: 'dashboard'
    },
    'smart-home': {
      title: 'Smart Home Control',
      subtitle: 'Control your entire home with intelligent automation.',
      ctaButtons: [
        { text: 'Control Home', link: '/control', variant: 'primary' },
        { text: 'Setup Guide', link: '/setup', variant: 'secondary' }
      ],
      backgroundImage: '/templates/hero-smart-home.jpg',
      style: 'modern'
    }
  }
  
  const config = heroConfigs[template.style] || heroConfigs[template.industry] || {
    title: `Welcome to ${template.name}`,
    subtitle: 'Experience the future of technology.',
    ctaButtons: [
      { text: 'Get Started', link: '/contact', variant: 'primary' }
    ],
    backgroundImage: `/templates/hero-${template.id}.jpg`,
    style: 'modern'
  }
  
  return TemplateElementBuilder.createHero(
    `hero-${template.id}`,
    config.title,
    config.subtitle,
    config.ctaButtons,
    config.backgroundImage,
    'centered'
  )
}

// Generate industry-specific sections
function generateIndustrySections(template) {
  const sections = []
  
  // Features section
  sections.push(generateFeaturesSection(template))
  
  // Industry-specific content section
  sections.push(generateIndustryContent(template))
  
  // Stats or showcase section
  sections.push(generateShowcaseSection(template))
  
  return sections
}

// Generate features section
function generateFeaturesSection(template) {
  const featureConfigs = {
    glassmorphism: {
      title: 'Glass Effects',
      subtitle: 'Modern design elements with glassmorphism effects',
      features: [
        {
          icon: 'glass',
          title: 'Glass Morphism',
          description: 'Beautiful glass-like effects with transparency and blur.'
        },
        {
          icon: 'modern',
          title: 'Modern Design',
          description: 'Clean, contemporary design that stands out.'
        },
        {
          icon: 'responsive',
          title: 'Fully Responsive',
          description: 'Perfect on all devices and screen sizes.'
        }
      ]
    },
    'dark-mode': {
      title: 'Dark Mode Features',
      subtitle: 'Premium dark theme with modern aesthetics',
      features: [
        {
          icon: 'moon',
          title: 'Dark Theme',
          description: 'Easy on the eyes with professional dark design.'
        },
        {
          icon: 'contrast',
          title: 'High Contrast',
          description: 'Excellent readability and accessibility.'
        },
        {
          icon: 'battery',
          title: 'Battery Saving',
          description: 'Reduces battery consumption on OLED screens.'
        }
      ]
    },
    ai: {
      title: 'AI Capabilities',
      subtitle: 'Powerful artificial intelligence features',
      features: [
        {
          icon: 'brain',
          title: 'Machine Learning',
          description: 'Advanced ML algorithms for intelligent automation.'
        },
        {
          icon: 'chat',
          title: 'AI Chatbot',
          description: 'Intelligent conversational AI assistant.'
        },
        {
          icon: 'analytics',
          title: 'Predictive Analytics',
          description: 'Data-driven insights and predictions.'
        }
      ]
    },
    automation: {
      title: 'Automation Tools',
      subtitle: 'Streamline your workflows with smart automation',
      features: [
        {
          icon: 'workflow',
          title: 'Workflow Automation',
          description: 'Automate repetitive tasks and processes.'
        },
        {
          icon: 'integration',
          title: 'API Integrations',
          description: 'Connect with hundreds of popular services.'
        },
        {
          icon: 'monitoring',
          title: 'Real-time Monitoring',
          description: 'Track and monitor all automated processes.'
        }
      ]
    },
    crypto: {
      title: 'Trading Features',
      subtitle: 'Advanced cryptocurrency trading capabilities',
      features: [
        {
          icon: 'security',
          title: 'Secure Trading',
          description: 'Bank-level security for all transactions.'
        },
        {
          icon: 'speed',
          title: 'Lightning Fast',
          description: 'Execute trades in milliseconds.'
        },
        {
          icon: 'analytics',
          title: 'Market Analytics',
          description: 'Advanced charts and market analysis tools.'
        }
      ]
    },
    nft: {
      title: 'NFT Features',
      subtitle: 'Complete NFT marketplace functionality',
      features: [
        {
          icon: 'gallery',
          title: 'Digital Gallery',
          description: 'Showcase and discover unique digital art.'
        },
        {
          icon: 'auction',
          title: 'Auction System',
          description: 'Bid and auction NFTs with smart contracts.'
        },
        {
          icon: 'wallet',
          title: 'Wallet Integration',
          description: 'Connect your crypto wallet seamlessly.'
        }
      ]
    }
  }
  
  const config = featureConfigs[template.style] || featureConfigs[template.industry] || {
    title: 'Key Features',
    subtitle: 'Discover what makes us different',
    features: [
      {
        icon: 'star',
        title: 'Premium Quality',
        description: 'High-quality solutions for your business needs.'
      },
      {
        icon: 'support',
        title: '24/7 Support',
        description: 'Round-the-clock support whenever you need help.'
      },
      {
        icon: 'security',
        title: 'Secure & Reliable',
        description: 'Enterprise-grade security and reliability.'
      }
    ]
  }
  
  return TemplateElementBuilder.createFeatureGrid(
    `features-${template.id}`,
    config.title,
    config.subtitle,
    config.features,
    3
  )
}

// Generate industry-specific content
function generateIndustryContent(template) {
  const contentConfigs = {
    ai: {
      title: 'AI Technology',
      content: 'Our advanced AI technology uses machine learning algorithms to provide intelligent solutions. From natural language processing to computer vision, we leverage cutting-edge AI to solve complex business problems.',
      imageUrl: '/templates/about-ai.jpg',
      layout: 'text-image'
    },
    automation: {
      title: 'Automation Solutions',
      content: 'Transform your business with intelligent automation. Our platform helps you automate workflows, integrate systems, and eliminate manual processes. Save time, reduce errors, and increase productivity.',
      imageUrl: '/templates/about-automation.jpg',
      layout: 'image-text'
    },
    crypto: {
      title: 'Cryptocurrency Trading',
      content: 'Trade cryptocurrencies with confidence on our secure platform. We provide advanced trading tools, real-time market data, and comprehensive security measures to protect your investments.',
      imageUrl: '/templates/about-crypto.jpg',
      layout: 'text-image'
    },
    nft: {
      title: 'NFT Marketplace',
      content: 'Discover, buy, and sell NFTs in our vibrant marketplace. We support various blockchain networks and provide tools for creators to mint and showcase their digital art.',
      imageUrl: '/templates/about-nft.jpg',
      layout: 'image-text'
    },
    metaverse: {
      title: 'Metaverse Platform',
      content: 'Step into the future with our metaverse platform. Create virtual experiences, connect with others, and explore immersive digital worlds. The future of social interaction is here.',
      imageUrl: '/templates/about-metaverse.jpg',
      layout: 'text-image'
    }
  }
  
  const config = contentConfigs[template.industry] || {
    title: `About ${template.name}`,
    content: `We are at the forefront of ${template.industry} technology, providing innovative solutions for modern businesses. Our team of experts is dedicated to delivering cutting-edge products and services.`,
    imageUrl: `/templates/about-${template.id}.jpg`,
    layout: 'text-image'
  }
  
  return TemplateElementBuilder.createAboutSection(
    `about-${template.id}`,
    config.title,
    config.content,
    config.imageUrl,
    config.layout
  )
}

// Generate showcase section
function generateShowcaseSection(template) {
  if (template.industry === 'ai' || template.industry === 'automation') {
    return TemplateElementBuilder.createStatsCounter(
      `stats-${template.id}`,
      [
        { number: '99.9%', label: 'Uptime', suffix: '', icon: 'uptime' },
        { number: '1M+', label: 'Processed', suffix: 'Requests', icon: 'requests' },
        { number: '50+', label: 'Integrations', suffix: '', icon: 'integrations' },
        { number: '24/7', label: 'Support', suffix: '', icon: 'support' }
      ]
    )
  } else if (template.industry === 'crypto' || template.industry === 'nft') {
    return TemplateElementBuilder.createStatsCounter(
      `stats-${template.id}`,
      [
        { number: '$1B+', label: 'Volume', suffix: 'Traded', icon: 'volume' },
        { number: '100K+', label: 'Users', suffix: 'Active', icon: 'users' },
        { number: '99.9%', label: 'Security', suffix: 'Score', icon: 'security' },
        { number: '24/7', label: 'Trading', suffix: '', icon: 'trading' }
      ]
    )
  } else {
    return TemplateElementBuilder.createStatsCounter(
      `stats-${template.id}`,
      [
        { number: '500+', label: 'Projects', suffix: 'Completed', icon: 'projects' },
        { number: '1000+', label: 'Clients', suffix: 'Satisfied', icon: 'clients' },
        { number: '99%', label: 'Success', suffix: 'Rate', icon: 'success' },
        { number: '24/7', label: 'Support', suffix: '', icon: 'support' }
      ]
    )
  }
}

// Generate contact section
function generateContactSection(template) {
  if (template.industry === 'ai' || template.industry === 'automation') {
    return TemplateElementBuilder.createContactForm(
      `contact-${template.id}`,
      'Get Started with AI',
      'Ready to automate your business? Contact us for a consultation.',
      [
        { name: 'name', type: 'text', required: true, placeholder: 'Your Name' },
        { name: 'email', type: 'email', required: true, placeholder: 'Your Email' },
        { name: 'company', type: 'text', required: true, placeholder: 'Company Name' },
        { name: 'use-case', type: 'select', required: true, placeholder: 'Use Case' },
        { name: 'budget', type: 'select', required: false, placeholder: 'Budget Range' },
        { name: 'message', type: 'textarea', required: true, placeholder: 'Tell us about your automation needs' }
      ],
      'Request Consultation'
    )
  } else if (template.industry === 'crypto' || template.industry === 'nft') {
    return TemplateElementBuilder.createContactForm(
      `contact-${template.id}`,
      'Join Our Platform',
      'Ready to start trading? Get in touch with our team.',
      [
        { name: 'name', type: 'text', required: true, placeholder: 'Your Name' },
        { name: 'email', type: 'email', required: true, placeholder: 'Your Email' },
        { name: 'phone', type: 'tel', required: true, placeholder: 'Phone Number' },
        { name: 'experience', type: 'select', required: true, placeholder: 'Trading Experience' },
        { name: 'investment', type: 'select', required: false, placeholder: 'Investment Amount' },
        { name: 'message', type: 'textarea', required: true, placeholder: 'Tell us about your trading goals' }
      ],
      'Start Trading'
    )
  } else {
    return TemplateElementBuilder.createContactForm(
      `contact-${template.id}`,
      'Get In Touch',
      'Ready to get started? Contact us today.',
      [
        { name: 'name', type: 'text', required: true, placeholder: 'Your Name' },
        { name: 'email', type: 'email', required: true, placeholder: 'Your Email' },
        { name: 'phone', type: 'tel', required: false, placeholder: 'Your Phone' },
        { name: 'message', type: 'textarea', required: true, placeholder: 'Your Message' }
      ],
      'Send Message'
    )
  }
}

// Generate footer section
function generateFooterSection(template) {
  const footerConfigs = {
    ai: {
      logo: template.name,
      description: 'Leading AI solutions for modern businesses.',
      links: [
        {
          title: 'AI Solutions',
          items: [
            { label: 'Machine Learning', link: '/ml' },
            { label: 'Natural Language', link: '/nlp' },
            { label: 'Computer Vision', link: '/cv' },
            { label: 'Predictive Analytics', link: '/analytics' }
          ]
        },
        {
          title: 'Resources',
          items: [
            { label: 'Documentation', link: '/docs' },
            { label: 'API Reference', link: '/api' },
            { label: 'Tutorials', link: '/tutorials' },
            { label: 'Support', link: '/support' }
          ]
        },
        {
          title: 'Company',
          items: [
            { label: 'About Us', link: '/about' },
            { label: 'Careers', link: '/careers' },
            { label: 'Blog', link: '/blog' },
            { label: 'Contact', link: '/contact' }
          ]
        }
      ]
    },
    crypto: {
      logo: template.name,
      description: 'Secure and reliable cryptocurrency trading platform.',
      links: [
        {
          title: 'Trading',
          items: [
            { label: 'Spot Trading', link: '/spot' },
            { label: 'Futures', link: '/futures' },
            { label: 'Margin Trading', link: '/margin' },
            { label: 'P2P Trading', link: '/p2p' }
          ]
        },
        {
          title: 'Learn',
          items: [
            { label: 'Crypto Basics', link: '/basics' },
            { label: 'Trading Guide', link: '/guide' },
            { label: 'Market Analysis', link: '/analysis' },
            { label: 'Security Tips', link: '/security' }
          ]
        },
        {
          title: 'Support',
          items: [
            { label: 'Help Center', link: '/help' },
            { label: 'Contact Us', link: '/contact' },
            { label: 'Status', link: '/status' },
            { label: 'API', link: '/api' }
          ]
        }
      ]
    }
  }
  
  const config = footerConfigs[template.industry] || {
    logo: template.name,
    description: `Professional ${template.category.toLowerCase()} solutions for modern businesses.`,
    links: [
      {
        title: 'Services',
        items: [
          { label: 'Our Services', link: '/services' },
          { label: 'Pricing', link: '/pricing' },
          { label: 'Support', link: '/support' },
          { label: 'FAQ', link: '/faq' }
        ]
      },
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
        title: 'Resources',
        items: [
          { label: 'Blog', link: '/blog' },
          { label: 'Documentation', link: '/docs' },
          { label: 'Help Center', link: '/help' },
          { label: 'Community', link: '/community' }
        ]
      }
    ]
  }
  
  return TemplateElementBuilder.createFooter(
    `footer-${template.id}`,
    config.logo,
    config.description,
    config.links,
    [
      { platform: 'facebook', url: `https://facebook.com/${template.id}` },
      { platform: 'twitter', url: `https://twitter.com/${template.id}` },
      { platform: 'linkedin', url: `https://linkedin.com/company/${template.id}` },
      { platform: 'instagram', url: `https://instagram.com/${template.id}` }
    ],
    `© 2025 ${template.name}. All rights reserved.`
  )
}

// Get menu items based on industry
function getMenuItems(industry) {
  const menuConfigs = {
    ai: [
      { label: 'Home', link: '/' },
      { label: 'AI Solutions', link: '/solutions' },
      { label: 'Features', link: '/features' },
      { label: 'Demo', link: '/demo' },
      { label: 'Pricing', link: '/pricing' },
      { label: 'Contact', link: '/contact' }
    ],
    automation: [
      { label: 'Home', link: '/' },
      { label: 'Automation', link: '/automation' },
      { label: 'Workflows', link: '/workflows' },
      { label: 'Integrations', link: '/integrations' },
      { label: 'Pricing', link: '/pricing' },
      { label: 'Contact', link: '/contact' }
    ],
    crypto: [
      { label: 'Home', link: '/' },
      { label: 'Trade', link: '/trade' },
      { label: 'Markets', link: '/markets' },
      { label: 'Learn', link: '/learn' },
      { label: 'Support', link: '/support' }
    ],
    nft: [
      { label: 'Home', link: '/' },
      { label: 'Marketplace', link: '/marketplace' },
      { label: 'Create', link: '/create' },
      { label: 'Collections', link: '/collections' },
      { label: 'About', link: '/about' }
    ],
    metaverse: [
      { label: 'Home', link: '/' },
      { label: 'Metaverse', link: '/metaverse' },
      { label: 'Events', link: '/events' },
      { label: 'Community', link: '/community' },
      { label: 'About', link: '/about' }
    ]
  }
  
  return menuConfigs[industry] || [
    { label: 'Home', link: '/' },
    { label: 'About', link: '/about' },
    { label: 'Services', link: '/services' },
    { label: 'Contact', link: '/contact' }
  ]
}

// Main function to update trending templates
function updateTrendingTemplates() {
  console.log('🚀 Updating 2025 trending templates with complete element configurations...')
  
  // Read the current templates file
  const templatesPath = path.join(__dirname, '../src/data/templates.ts')
  let content = fs.readFileSync(templatesPath, 'utf8')
  
  trendingTemplates.forEach(template => {
    console.log(`📝 Updating ${template.id}...`)
    
    // Generate complete elements
    const elements = generateTrendingElements(template)
    
    // Find the template in the content and add elements array
    const templateRegex = new RegExp(
      `(id: '${template.id}'[\\s\\S]*?features: \\[[\\s\\S]*?\\])([\\s\\S]*?)(\\n\\s*\\})`,
      'g'
    )
    
    const elementsString = `,\n    elements: ${JSON.stringify(elements, null, 6)
      .replace(/"/g, "'")
      .replace(/'/g, "'")}`
    
    content = content.replace(templateRegex, `$1${elementsString}$2$3`)
  })
  
  // Write the updated content back
  fs.writeFileSync(templatesPath, content)
  
  console.log('✅ Successfully updated 2025 trending templates!')
}

// Run if called directly
if (require.main === module) {
  updateTrendingTemplates()
}

module.exports = { updateTrendingTemplates, generateTrendingElements }
