const fs = require('fs')
const path = require('path')

// Read the templates data to get all template IDs
const templatesPath = path.join(__dirname, '../src/data/templates.ts')
const templatesContent = fs.readFileSync(templatesPath, 'utf8')

// Extract template IDs from the file
const templateIds = []
const regex = /id: '([^']+)',/g
let match
while ((match = regex.exec(templatesContent)) !== null) {
  // Only get the main template IDs, not element IDs
  if (!match[1].includes('-') || match[1].match(/-/g).length === 1) {
    templateIds.push(match[1])
  }
}

console.log(`Found ${templateIds.length} templates to generate images for:`)
templateIds.forEach(id => console.log(`- ${id}`))

// Ensure templates directory exists
const templatesDir = path.join(__dirname, '../public/templates')
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true })
}

// Generate SVG for each template
templateIds.forEach(templateId => {
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-${templateId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="400" height="300" fill="url(#bg-${templateId})" />
  
  <!-- Header -->
  <rect x="20" y="20" width="360" height="40" fill="rgba(255,255,255,0.2)" rx="8" />
  <rect x="30" y="30" width="80" height="20" fill="rgba(255,255,255,0.8)" rx="4" />
  
  <!-- Navigation -->
  <rect x="120" y="30" width="40" height="20" fill="rgba(255,255,255,0.6)" rx="4" />
  <rect x="170" y="30" width="40" height="20" fill="rgba(255,255,255,0.6)" rx="4" />
  <rect x="220" y="30" width="40" height="20" fill="rgba(255,255,255,0.6)" rx="4" />
  
  <!-- Hero Section -->
  <rect x="20" y="80" width="360" height="120" fill="rgba(255,255,255,0.15)" rx="12" />
  <rect x="40" y="100" width="200" height="30" fill="rgba(255,255,255,0.9)" rx="6" />
  <rect x="40" y="140" width="300" height="20" fill="rgba(255,255,255,0.7)" rx="4" />
  <rect x="40" y="170" width="120" height="25" fill="rgba(255,255,255,0.8)" rx="6" />
  
  <!-- Content Blocks -->
  <rect x="20" y="220" width="110" height="60" fill="rgba(255,255,255,0.1)" rx="8" />
  <rect x="30" y="230" width="90" height="15" fill="rgba(255,255,255,0.8)" rx="3" />
  <rect x="30" y="250" width="70" height="10" fill="rgba(255,255,255,0.6)" rx="2" />
  
  <rect x="145" y="220" width="110" height="60" fill="rgba(255,255,255,0.1)" rx="8" />
  <rect x="155" y="230" width="90" height="15" fill="rgba(255,255,255,0.8)" rx="3" />
  <rect x="155" y="250" width="70" height="10" fill="rgba(255,255,255,0.6)" rx="2" />
  
  <rect x="270" y="220" width="110" height="60" fill="rgba(255,255,255,0.1)" rx="8" />
  <rect x="280" y="230" width="90" height="15" fill="rgba(255,255,255,0.8)" rx="3" />
  <rect x="280" y="250" width="70" height="10" fill="rgba(255,255,255,0.6)" rx="2" />
  
  <!-- Template Name -->
  <text x="200" y="290" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${templateId}</text>
</svg>`

  const filePath = path.join(templatesDir, `${templateId}.svg`)
  fs.writeFileSync(filePath, svgContent)
  console.log(`Generated: ${templateId}.svg`)
})

console.log(`✅ Generated ${templateIds.length} template images successfully!`)
