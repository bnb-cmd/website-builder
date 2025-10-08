const fs = require('fs')
const path = require('path')

// Import template elements
const { TemplateElementBuilder, elementTemplates, industryElements, pakistanElements } = require('../src/data/template-elements')

// Template configurations to update
const templateConfigs = [
  // Core Business Templates
  {
    id: 'restaurant-1',
    name: 'Restaurant Deluxe',
    category: 'Restaurant',
    industry: 'restaurant',
    localizedFor: 'pk'
  },
  {
    id: 'portfolio-1',
    name: 'Creative Portfolio',
    category: 'Portfolio',
    industry: 'portfolio'
  },
  {
    id: 'education-1',
    name: 'Learning Academy',
    category: 'Education',
    industry: 'education'
  },
  {
    id: 'medical-1',
    name: 'Health Center',
    category: 'Medical',
    industry: 'medical'
  },
  {
    id: 'realestate-1',
    name: 'Property Solutions',
    category: 'Real Estate',
    industry: 'realestate'
  },
  {
    id: 'wedding-1',
    name: 'Wedding Planner',
    category: 'Wedding',
    industry: 'wedding'
  },
  {
    id: 'blog-1',
    name: 'Modern Blog',
    category: 'Blog',
    industry: 'blog'
  },
  {
    id: 'nonprofit-1',
    name: 'Charity Foundation',
    category: 'Non-profit',
    industry: 'nonprofit'
  },
  {
    id: 'fitness-1',
    name: 'Fitness Center',
    category: 'Fitness',
    industry: 'fitness'
  },
  {
    id: 'travel-1',
    name: 'Travel Agency',
    category: 'Travel',
    industry: 'travel'
  }
]

// Generate complete elements for a template
function generateTemplateElements(templateConfig) {
  const elements = []
  
  // Navbar
  elements.push(TemplateElementBuilder.createNavbar(
    `navbar-${templateConfig.id}`,
    templateConfig.name,
    getMenuItems(templateConfig.category),
    'modern'
  ))
  
  // Hero section
  elements.push(generateHeroSection(templateConfig))
  
  // Industry-specific sections
  if (templateConfig.industry === 'restaurant') {
    elements.push(generateRestaurantSections(templateConfig))
  } else if (templateConfig.industry === 'medical') {
    elements.push(generateMedicalSections(templateConfig))
  } else if (templateConfig.industry === 'ecommerce') {
    elements.push(generateEcommerceSections(templateConfig))
  } else {
    elements.push(generateGenericSections(templateConfig))
  }
  
  // Contact form
  elements.push(generateContactSection(templateConfig))
  
  // Footer
  elements.push(generateFooterSection(templateConfig))
  
  return elements
}

// Generate hero section based on industry
function generateHeroSection(templateConfig) {
  const heroConfigs = {
    restaurant: {
      title: 'Delicious Food, Great Atmosphere',
      subtitle: 'Experience the finest cuisine in a warm and welcoming environment.',
      ctaButtons: [
        { text: 'View Menu', link: '/menu', variant: 'primary' },
        { text: 'Make Reservation', link: '/reservation', variant: 'secondary' }
      ]
    },
    medical: {
      title: 'Your Health, Our Priority',
      subtitle: 'Comprehensive healthcare services with compassionate care.',
      ctaButtons: [
        { text: 'Book Appointment', link: '/appointment', variant: 'primary' },
        { text: 'Emergency', link: '/emergency', variant: 'secondary' }
      ]
    },
    portfolio: {
      title: 'Creative Portfolio',
      subtitle: 'Showcasing innovative designs and creative solutions.',
      ctaButtons: [
        { text: 'View Work', link: '/portfolio', variant: 'primary' }
      ]
    },
    education: {
      title: 'Empowering Minds',
      subtitle: 'Quality education for a brighter future.',
      ctaButtons: [
        { text: 'Enroll Now', link: '/enrollment', variant: 'primary' },
        { text: 'Learn More', link: '/about', variant: 'secondary' }
      ]
    },
    realestate: {
      title: 'Find Your Dream Home',
      subtitle: 'Premium properties in the best locations.',
      ctaButtons: [
        { text: 'Browse Properties', link: '/properties', variant: 'primary' },
        { text: 'Get Valuation', link: '/valuation', variant: 'secondary' }
      ]
    },
    fitness: {
      title: 'Transform Your Body',
      subtitle: 'Achieve your fitness goals with expert guidance.',
      ctaButtons: [
        { text: 'Join Now', link: '/membership', variant: 'primary' },
        { text: 'Free Trial', link: '/trial', variant: 'secondary' }
      ]
    },
    travel: {
      title: 'Explore the World',
      subtitle: 'Amazing destinations and unforgettable experiences.',
      ctaButtons: [
        { text: 'Plan Trip', link: '/plan', variant: 'primary' },
        { text: 'View Packages', link: '/packages', variant: 'secondary' }
      ]
    }
  }
  
  const config = heroConfigs[templateConfig.industry] || {
    title: `Welcome to ${templateConfig.name}`,
    subtitle: 'Professional solutions for your needs.',
    ctaButtons: [
      { text: 'Get Started', link: '/contact', variant: 'primary' }
    ]
  }
  
  return TemplateElementBuilder.createHero(
    `hero-${templateConfig.id}`,
    config.title,
    config.subtitle,
    config.ctaButtons,
    `/templates/hero-${templateConfig.industry}.jpg`,
    'centered'
  )
}

// Generate industry-specific sections
function generateRestaurantSections(templateConfig) {
  const sections = []
  
  // Menu section
  sections.push({
    id: `menu-${templateConfig.id}`,
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
  
  // Features section
  sections.push(TemplateElementBuilder.createFeatureGrid(
    `features-${templateConfig.id}`,
    'Why Choose Us',
    'Experience the difference in every bite',
    [
      {
        icon: 'chef',
        title: 'Expert Chefs',
        description: 'Our talented chefs create culinary masterpieces.'
      },
      {
        icon: 'fresh',
        title: 'Fresh Ingredients',
        description: 'Only the finest, freshest ingredients are used.'
      },
      {
        icon: 'ambiance',
        title: 'Perfect Ambiance',
        description: 'Enjoy your meal in a beautiful, comfortable setting.'
      }
    ],
    3
  ))
  
  return sections
}

function generateMedicalSections(templateConfig) {
  const sections = []
  
  // Services section
  sections.push(TemplateElementBuilder.createFeatureGrid(
    `services-${templateConfig.id}`,
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
  ))
  
  // Team section
  sections.push(TemplateElementBuilder.createTeamSection(
    `team-${templateConfig.id}`,
    'Our Medical Team',
    'Experienced professionals dedicated to your health',
    [
      {
        name: 'Dr. Ahmed Khan',
        role: 'Chief Medical Officer',
        bio: '20+ years of experience in internal medicine.',
        avatar: '/templates/team/dr-ahmed.jpg'
      },
      {
        name: 'Dr. Sarah Ali',
        role: 'Cardiologist',
        bio: 'Specialist in cardiovascular diseases.',
        avatar: '/templates/team/dr-sarah.jpg'
      }
    ]
  ))
  
  return sections
}

function generateEcommerceSections(templateConfig) {
  const sections = []
  
  // Product grid
  sections.push({
    id: `products-${templateConfig.id}`,
    type: 'product-grid',
    props: {
      title: 'Featured Products',
      subtitle: 'Handpicked items just for you',
      products: [
        {
          name: 'Wireless Headphones',
          price: 'Rs. 2,500',
          originalPrice: 'Rs. 3,000',
          image: '/templates/products/headphones.jpg',
          rating: 4.5,
          reviews: 128,
          badge: 'Sale'
        },
        {
          name: 'Smart Watch',
          price: 'Rs. 8,500',
          originalPrice: 'Rs. 10,000',
          image: '/templates/products/smartwatch.jpg',
          rating: 4.8,
          reviews: 89,
          badge: 'New'
        }
      ],
      columns: 3,
      showRating: true,
      showReviews: true,
      showBadges: true
    },
    style: {
      padding: '4rem 0',
      backgroundColor: '#ffffff'
    },
    children: []
  })
  
  return sections
}

function generateGenericSections(templateConfig) {
  const sections = []
  
  // Features section
  sections.push(TemplateElementBuilder.createFeatureGrid(
    `features-${templateConfig.id}`,
    'Why Choose Us',
    'We provide comprehensive solutions for your needs',
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
  ))
  
  // About section
  sections.push(TemplateElementBuilder.createAboutSection(
    `about-${templateConfig.id}`,
    `About ${templateConfig.name}`,
    `We are a team of passionate professionals dedicated to delivering exceptional results. With years of experience in the industry, we understand what it takes to build successful businesses and create meaningful impact.`,
    `/templates/about-${templateConfig.industry}.jpg`,
    'text-image'
  ))
  
  return sections
}

// Generate contact section
function generateContactSection(templateConfig) {
  if (templateConfig.industry === 'restaurant') {
    return TemplateElementBuilder.createContactForm(
      `contact-${templateConfig.id}`,
      'Make a Reservation',
      'Book your table for an unforgettable dining experience.',
      [
        { name: 'name', type: 'text', required: true, placeholder: 'Your Name' },
        { name: 'email', type: 'email', required: true, placeholder: 'Your Email' },
        { name: 'phone', type: 'tel', required: true, placeholder: 'Your Phone' },
        { name: 'date', type: 'date', required: true, placeholder: 'Preferred Date' },
        { name: 'time', type: 'time', required: true, placeholder: 'Preferred Time' },
        { name: 'guests', type: 'number', required: true, placeholder: 'Number of Guests' },
        { name: 'message', type: 'textarea', required: false, placeholder: 'Special Requests' }
      ],
      'Book Table'
    )
  } else if (templateConfig.industry === 'medical') {
    return TemplateElementBuilder.createContactForm(
      `contact-${templateConfig.id}`,
      'Book an Appointment',
      'Schedule your consultation with our medical professionals.',
      [
        { name: 'name', type: 'text', required: true, placeholder: 'Your Name' },
        { name: 'email', type: 'email', required: true, placeholder: 'Your Email' },
        { name: 'phone', type: 'tel', required: true, placeholder: 'Your Phone' },
        { name: 'department', type: 'select', required: true, placeholder: 'Department' },
        { name: 'date', type: 'date', required: true, placeholder: 'Preferred Date' },
        { name: 'time', type: 'time', required: true, placeholder: 'Preferred Time' },
        { name: 'symptoms', type: 'textarea', required: false, placeholder: 'Brief description of symptoms' }
      ],
      'Book Appointment'
    )
  } else {
    return TemplateElementBuilder.createContactForm(
      `contact-${templateConfig.id}`,
      'Get In Touch',
      'Ready to start your project? Contact us today for a free consultation.',
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
function generateFooterSection(templateConfig) {
  const footerConfigs = {
    restaurant: {
      logo: templateConfig.name,
      description: 'Creating memorable dining experiences with exceptional food and service.',
      links: [
        {
          title: 'Menu',
          items: [
            { label: 'Appetizers', link: '/menu/appetizers' },
            { label: 'Main Courses', link: '/menu/main' },
            { label: 'Desserts', link: '/menu/desserts' },
            { label: 'Beverages', link: '/menu/beverages' }
          ]
        },
        {
          title: 'Restaurant',
          items: [
            { label: 'About Us', link: '/about' },
            { label: 'Our Story', link: '/story' },
            { label: 'Gallery', link: '/gallery' },
            { label: 'Contact', link: '/contact' }
          ]
        },
        {
          title: 'Services',
          items: [
            { label: 'Reservations', link: '/reservations' },
            { label: 'Private Events', link: '/events' },
            { label: 'Catering', link: '/catering' },
            { label: 'Delivery', link: '/delivery' }
          ]
        }
      ]
    },
    medical: {
      logo: templateConfig.name,
      description: 'Providing compassionate healthcare services for your well-being.',
      links: [
        {
          title: 'Services',
          items: [
            { label: 'General Medicine', link: '/services/general' },
            { label: 'Cardiology', link: '/services/cardiology' },
            { label: 'Neurology', link: '/services/neurology' },
            { label: 'Orthopedics', link: '/services/orthopedics' }
          ]
        },
        {
          title: 'Patient Care',
          items: [
            { label: 'Appointments', link: '/appointments' },
            { label: 'Emergency', link: '/emergency' },
            { label: 'Insurance', link: '/insurance' },
            { label: 'Patient Portal', link: '/portal' }
          ]
        },
        {
          title: 'About',
          items: [
            { label: 'Our Team', link: '/team' },
            { label: 'Facilities', link: '/facilities' },
            { label: 'History', link: '/history' },
            { label: 'Contact', link: '/contact' }
          ]
        }
      ]
    }
  }
  
  const config = footerConfigs[templateConfig.industry] || {
    logo: templateConfig.name,
    description: `Professional solutions for your ${templateConfig.category.toLowerCase()} needs.`,
    links: [
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
          { label: 'Our Services', link: '/services' },
          { label: 'Pricing', link: '/pricing' },
          { label: 'Support', link: '/support' },
          { label: 'FAQ', link: '/faq' }
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
    `footer-${templateConfig.id}`,
    config.logo,
    config.description,
    config.links,
    [
      { platform: 'facebook', url: `https://facebook.com/${templateConfig.id}` },
      { platform: 'twitter', url: `https://twitter.com/${templateConfig.id}` },
      { platform: 'linkedin', url: `https://linkedin.com/company/${templateConfig.id}` },
      { platform: 'instagram', url: `https://instagram.com/${templateConfig.id}` }
    ],
    `© 2025 ${templateConfig.name}. All rights reserved.`
  )
}

// Get menu items based on category
function getMenuItems(category) {
  const menuConfigs = {
    'Restaurant': [
      { label: 'Home', link: '/' },
      { label: 'Menu', link: '/menu' },
      { label: 'About', link: '/about' },
      { label: 'Reservations', link: '/reservations' },
      { label: 'Contact', link: '/contact' }
    ],
    'Medical': [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Doctors', link: '/doctors' },
      { label: 'Appointments', link: '/appointments' },
      { label: 'Contact', link: '/contact' }
    ],
    'E-commerce': [
      { label: 'Home', link: '/' },
      { label: 'Shop', link: '/shop' },
      { label: 'Categories', link: '/categories' },
      { label: 'Sale', link: '/sale' },
      { label: 'Contact', link: '/contact' }
    ],
    'Portfolio': [
      { label: 'Home', link: '/' },
      { label: 'Work', link: '/work' },
      { label: 'About', link: '/about' },
      { label: 'Services', link: '/services' },
      { label: 'Contact', link: '/contact' }
    ]
  }
  
  return menuConfigs[category] || [
    { label: 'Home', link: '/' },
    { label: 'About', link: '/about' },
    { label: 'Services', link: '/services' },
    { label: 'Contact', link: '/contact' }
  ]
}

// Main function to update templates
function updateTemplatesWithCompleteElements() {
  console.log('🔧 Updating templates with complete element configurations...')
  
  // Read the current templates file
  const templatesPath = path.join(__dirname, '../src/data/templates.ts')
  let content = fs.readFileSync(templatesPath, 'utf8')
  
  templateConfigs.forEach(templateConfig => {
    console.log(`📝 Updating ${templateConfig.id}...`)
    
    // Generate complete elements
    const elements = generateTemplateElements(templateConfig)
    
    // Find the template in the content and replace its elements
    const templateRegex = new RegExp(
      `(id: '${templateConfig.id}'[\\s\\S]*?elements: \\[)([\\s\\S]*?)(\\s*\\])`,
      'g'
    )
    
    const elementsString = JSON.stringify(elements, null, 6)
      .replace(/"/g, "'")
      .replace(/'/g, "'")
    
    content = content.replace(templateRegex, `$1${elementsString}$3`)
  })
  
  // Write the updated content back
  fs.writeFileSync(templatesPath, content)
  
  console.log('✅ Successfully updated templates with complete element configurations!')
}

// Run if called directly
if (require.main === module) {
  updateTemplatesWithCompleteElements()
}

module.exports = { updateTemplatesWithCompleteElements, generateTemplateElements }
