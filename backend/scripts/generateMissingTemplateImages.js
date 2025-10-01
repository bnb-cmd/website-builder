const fs = require('fs')
const path = require('path')

// Missing template IDs from the analysis
const missingTemplates = [
  'lead-planner-coaching',
  'brave-theme-interior',
  'cafe-restaurant-free',
  'house-kraft-realestate',
  'real-estate-free',
  'travel-agency-free',
  'learning-center-education',
  'social-organization-charity',
  'music-band-template',
  'fitness-gym-template',
  'escape-velocity-business',
  'flex-it-digital',
  'online-academy-2025',
  'dark-mode-premium',
  'ai-assistant-platform',
  'machine-learning-lab',
  'remote-work-hub',
  'custom-design-studio',
  'electric-vehicle-charging',
  'space-tech-company',
  'quantum-computing-lab',
  'gene-therapy-clinic',
  'smart-city-platform',
  'ar-experience-platform',
  'mental-health-app',
  'food-tech-platform',
  'smart-home-platform'
]

const templatesDir = path.join(__dirname, '../public/templates')

// Create templates directory if it doesn't exist
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true })
}

console.log(`Generating ${missingTemplates.length} missing SVG images...`)

missingTemplates.forEach(templateId => {
  // Extract first letter for the icon
  const firstLetter = templateId.charAt(0).toUpperCase()
  
  // Generate a color based on template ID hash
  const hash = templateId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const colors = [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ]
  const bgColor = colors[Math.abs(hash) % colors.length]
  
  // Create SVG content
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgColor};stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:${bgColor};stop-opacity:0.3" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="400" height="300" fill="url(#bg)" />
  
  <!-- Main content area -->
  <rect x="20" y="20" width="360" height="260" fill="white" stroke="${bgColor}" stroke-width="2" rx="8" />
  
  <!-- Header -->
  <rect x="30" y="30" width="340" height="40" fill="${bgColor}" rx="4" />
  <text x="200" y="55" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">${templateId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</text>
  
  <!-- Icon -->
  <circle cx="200" cy="120" r="30" fill="${bgColor}" />
  <text x="200" y="130" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">${firstLetter}</text>
  
  <!-- Content blocks -->
  <rect x="50" y="170" width="80" height="60" fill="${bgColor}" opacity="0.2" rx="4" />
  <rect x="150" y="170" width="80" height="60" fill="${bgColor}" opacity="0.2" rx="4" />
  <rect x="250" y="170" width="80" height="60" fill="${bgColor}" opacity="0.2" rx="4" />
  
  <!-- Footer -->
  <rect x="30" y="250" width="340" height="20" fill="${bgColor}" opacity="0.1" rx="4" />
</svg>`

  // Write SVG file
  const filePath = path.join(templatesDir, `${templateId}.svg`)
  fs.writeFileSync(filePath, svgContent)
  console.log(`✅ Generated: ${templateId}.svg`)
})

console.log(`\n🎉 Successfully generated ${missingTemplates.length} SVG images!`)
console.log(`📁 All images saved to: ${templatesDir}`)
