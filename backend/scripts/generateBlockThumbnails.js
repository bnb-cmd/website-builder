const fs = require('fs')
const path = require('path')

// Block template configurations
const blockTemplates = [
  {
    id: 'hero-gradient',
    name: 'Gradient Hero',
    category: 'Heroes',
    color: '#3b82f6'
  },
  {
    id: 'features-grid',
    name: 'Features Grid',
    category: 'Features',
    color: '#10b981'
  },
  {
    id: 'testimonial-carousel',
    name: 'Testimonial Carousel',
    category: 'Testimonials',
    color: '#f59e0b'
  },
  {
    id: 'pricing-table',
    name: 'Pricing Table',
    category: 'Pricing',
    color: '#8b5cf6'
  },
  {
    id: 'contact-split',
    name: 'Split Contact',
    category: 'Contact',
    color: '#ef4444'
  },
  {
    id: 'cta-gradient',
    name: 'Gradient CTA',
    category: 'Call to Action',
    color: '#06b6d4'
  },
  {
    id: 'team-cards',
    name: 'Team Cards',
    category: 'Team',
    color: '#84cc16'
  },
  {
    id: 'stats-animated',
    name: 'Animated Stats',
    category: 'Statistics',
    color: '#f97316'
  },
  {
    id: 'footer-mega',
    name: 'Mega Footer',
    category: 'Footers',
    color: '#6b7280'
  }
]

// Create SVG thumbnail for block template
function createBlockThumbnail(template) {
  const { id, name, category, color } = template
  
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:${color};stop-opacity:0.3" />
    </linearGradient>
    <linearGradient id="header-${id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="400" height="300" fill="url(#bg-${id})" />
  
  <!-- Main container -->
  <rect x="20" y="20" width="360" height="260" fill="white" stroke="${color}" stroke-width="2" rx="8" />
  
  <!-- Header -->
  <rect x="30" y="30" width="340" height="40" fill="url(#header-${id})" rx="4" />
  <text x="200" y="55" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${name}</text>
  
  <!-- Category badge -->
  <rect x="30" y="80" width="80" height="20" fill="${color}" opacity="0.2" rx="10" />
  <text x="70" y="94" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="10" font-weight="bold">${category}</text>
  
  <!-- Content area based on block type -->
  ${generateBlockContent(id, color)}
  
  <!-- Footer -->
  <rect x="30" y="250" width="340" height="20" fill="${color}" opacity="0.1" rx="4" />
  <text x="200" y="264" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="10">Block Template</text>
</svg>`

  return svgContent
}

// Generate block-specific content
function generateBlockContent(blockId, color) {
  switch (blockId) {
    case 'hero-gradient':
      return `
        <!-- Hero content -->
        <rect x="50" y="120" width="300" height="60" fill="${color}" opacity="0.1" rx="4" />
        <text x="200" y="140" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="12" font-weight="bold">Hero Section</text>
        <text x="200" y="155" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="10">Gradient Background</text>
        <rect x="150" y="170" width="100" height="30" fill="${color}" opacity="0.3" rx="15" />
        <text x="200" y="188" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10">CTA Button</text>
      `
    
    case 'features-grid':
      return `
        <!-- Features grid -->
        <rect x="50" y="120" width="80" height="80" fill="${color}" opacity="0.1" rx="4" />
        <circle cx="90" cy="140" r="8" fill="${color}" />
        <text x="90" y="145" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="8">⚡</text>
        <text x="90" y="160" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="9">Feature 1</text>
        
        <rect x="150" y="120" width="80" height="80" fill="${color}" opacity="0.1" rx="4" />
        <circle cx="190" cy="140" r="8" fill="${color}" />
        <text x="190" y="145" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="8">🛡️</text>
        <text x="190" y="160" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="9">Feature 2</text>
        
        <rect x="250" y="120" width="80" height="80" fill="${color}" opacity="0.1" rx="4" />
        <circle cx="290" cy="140" r="8" fill="${color}" />
        <text x="290" y="145" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="8">🌐</text>
        <text x="290" y="160" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="9">Feature 3</text>
      `
    
    case 'testimonial-carousel':
      return `
        <!-- Testimonial carousel -->
        <rect x="50" y="120" width="300" height="80" fill="${color}" opacity="0.1" rx="4" />
        <circle cx="80" cy="140" r="15" fill="${color}" opacity="0.3" />
        <text x="80" y="145" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12">👤</text>
        <text x="110" y="135" fill="${color}" font-family="Arial, sans-serif" font-size="10" font-weight="bold">John Doe</text>
        <text x="110" y="150" fill="${color}" font-family="Arial, sans-serif" font-size="9">"Amazing service!"</text>
        <text x="110" y="165" fill="${color}" font-family="Arial, sans-serif" font-size="9">★★★★★</text>
        
        <!-- Carousel dots -->
        <circle cx="200" cy="210" r="3" fill="${color}" opacity="0.5" />
        <circle cx="220" cy="210" r="3" fill="${color}" />
        <circle cx="240" cy="210" r="3" fill="${color}" opacity="0.5" />
      `
    
    case 'pricing-table':
      return `
        <!-- Pricing table -->
        <rect x="50" y="120" width="80" height="100" fill="${color}" opacity="0.1" rx="4" />
        <text x="90" y="140" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="10" font-weight="bold">Basic</text>
        <text x="90" y="155" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="12" font-weight="bold">Rs. 500</text>
        <text x="90" y="170" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">✓ Feature 1</text>
        <text x="90" y="180" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">✓ Feature 2</text>
        
        <rect x="150" y="120" width="80" height="100" fill="${color}" opacity="0.2" rx="4" stroke="${color}" stroke-width="2" />
        <text x="190" y="140" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="10" font-weight="bold">Pro</text>
        <text x="190" y="155" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="12" font-weight="bold">Rs. 1000</text>
        <text x="190" y="170" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">✓ All Features</text>
        <text x="190" y="180" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">✓ Support</text>
        
        <rect x="250" y="120" width="80" height="100" fill="${color}" opacity="0.1" rx="4" />
        <text x="290" y="140" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="10" font-weight="bold">Enterprise</text>
        <text x="290" y="155" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="12" font-weight="bold">Custom</text>
        <text x="290" y="170" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">✓ Everything</text>
        <text x="290" y="180" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">✓ Priority</text>
      `
    
    case 'contact-split':
      return `
        <!-- Split contact -->
        <rect x="50" y="120" width="150" height="80" fill="${color}" opacity="0.1" rx="4" />
        <text x="125" y="140" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="10" font-weight="bold">Contact Info</text>
        <text x="125" y="155" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">📧 info@company.com</text>
        <text x="125" y="170" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">📞 +92 21 1234567</text>
        
        <rect x="220" y="120" width="150" height="80" fill="${color}" opacity="0.1" rx="4" />
        <text x="295" y="140" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="10" font-weight="bold">Contact Form</text>
        <rect x="230" y="150" width="130" height="15" fill="white" stroke="${color}" stroke-width="1" rx="2" />
        <rect x="230" y="170" width="130" height="15" fill="white" stroke="${color}" stroke-width="1" rx="2" />
        <rect x="230" y="190" width="80" height="15" fill="${color}" rx="2" />
      `
    
    case 'cta-gradient':
      return `
        <!-- CTA gradient -->
        <rect x="50" y="120" width="300" height="80" fill="${color}" opacity="0.2" rx="4" />
        <text x="200" y="140" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="12" font-weight="bold">Ready to Get Started?</text>
        <text x="200" y="155" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="10">Join thousands of satisfied customers</text>
        <rect x="170" y="170" width="60" height="20" fill="${color}" rx="10" />
        <text x="200" y="184" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="9">Get Started</text>
      `
    
    case 'team-cards':
      return `
        <!-- Team cards -->
        <rect x="50" y="120" width="80" height="80" fill="${color}" opacity="0.1" rx="4" />
        <circle cx="90" cy="140" r="12" fill="${color}" opacity="0.3" />
        <text x="90" y="145" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12">👤</text>
        <text x="90" y="165" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="9" font-weight="bold">John Doe</text>
        <text x="90" y="175" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">CEO</text>
        
        <rect x="150" y="120" width="80" height="80" fill="${color}" opacity="0.1" rx="4" />
        <circle cx="190" cy="140" r="12" fill="${color}" opacity="0.3" />
        <text x="190" y="145" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12">👤</text>
        <text x="190" y="165" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="9" font-weight="bold">Jane Smith</text>
        <text x="190" y="175" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">CTO</text>
        
        <rect x="250" y="120" width="80" height="80" fill="${color}" opacity="0.1" rx="4" />
        <circle cx="290" cy="140" r="12" fill="${color}" opacity="0.3" />
        <text x="290" y="145" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12">👤</text>
        <text x="290" y="165" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="9" font-weight="bold">Mike Johnson</text>
        <text x="290" y="175" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">Designer</text>
      `
    
    case 'stats-animated':
      return `
        <!-- Animated stats -->
        <rect x="50" y="120" width="80" height="60" fill="${color}" opacity="0.1" rx="4" />
        <text x="90" y="140" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="16" font-weight="bold">500+</text>
        <text x="90" y="155" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="9">Projects</text>
        
        <rect x="150" y="120" width="80" height="60" fill="${color}" opacity="0.1" rx="4" />
        <text x="190" y="140" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="16" font-weight="bold">1000+</text>
        <text x="190" y="155" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="9">Clients</text>
        
        <rect x="250" y="120" width="80" height="60" fill="${color}" opacity="0.1" rx="4" />
        <text x="290" y="140" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="16" font-weight="bold">99%</text>
        <text x="290" y="155" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="9">Satisfaction</text>
        
        <!-- Animation indicator -->
        <circle cx="200" cy="200" r="3" fill="${color}" opacity="0.5">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
      `
    
    case 'footer-mega':
      return `
        <!-- Mega footer -->
        <rect x="30" y="120" width="340" height="100" fill="${color}" opacity="0.1" rx="4" />
        <text x="200" y="140" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="12" font-weight="bold">Company Name</text>
        
        <!-- Footer columns -->
        <rect x="50" y="150" width="60" height="60" fill="${color}" opacity="0.05" rx="2" />
        <text x="80" y="165" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="9" font-weight="bold">Company</text>
        <text x="80" y="180" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">About</text>
        <text x="80" y="190" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">Team</text>
        <text x="80" y="200" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">Contact</text>
        
        <rect x="130" y="150" width="60" height="60" fill="${color}" opacity="0.05" rx="2" />
        <text x="160" y="165" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="9" font-weight="bold">Services</text>
        <text x="160" y="180" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">Web Dev</text>
        <text x="160" y="190" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">Mobile</text>
        <text x="160" y="200" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">Consulting</text>
        
        <rect x="210" y="150" width="60" height="60" fill="${color}" opacity="0.05" rx="2" />
        <text x="240" y="165" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="9" font-weight="bold">Resources</text>
        <text x="240" y="180" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">Blog</text>
        <text x="240" y="190" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">Docs</text>
        <text x="240" y="200" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">Support</text>
        
        <rect x="290" y="150" width="60" height="60" fill="${color}" opacity="0.05" rx="2" />
        <text x="320" y="165" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="9" font-weight="bold">Social</text>
        <text x="320" y="180" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">Facebook</text>
        <text x="320" y="190" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">Twitter</text>
        <text x="320" y="200" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="8">LinkedIn</text>
      `
    
    default:
      return `
        <!-- Default content -->
        <rect x="50" y="120" width="300" height="80" fill="${color}" opacity="0.1" rx="4" />
        <text x="200" y="150" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${name}</text>
        <text x="200" y="170" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="10">Block Template</text>
      `
  }
}

// Main function to generate all block thumbnails
function generateBlockThumbnails() {
  const blocksDir = path.join(__dirname, '../public/blocks')
  
  // Create blocks directory if it doesn't exist
  if (!fs.existsSync(blocksDir)) {
    fs.mkdirSync(blocksDir, { recursive: true })
  }
  
  console.log('🎨 Generating block template thumbnails...')
  
  blockTemplates.forEach(template => {
    const svgContent = createBlockThumbnail(template)
    const filePath = path.join(blocksDir, `${template.id}.svg`)
    
    fs.writeFileSync(filePath, svgContent)
    console.log(`✅ Generated ${template.id}.svg`)
  })
  
  console.log(`🎉 Successfully generated ${blockTemplates.length} block thumbnails!`)
}

// Run if called directly
if (require.main === module) {
  generateBlockThumbnails()
}

module.exports = { generateBlockThumbnails, createBlockThumbnail }
