const fs = require('fs')
const path = require('path')

// Read the templates file
const templatesPath = path.join(__dirname, '../src/data/templates.ts')
const templatesContent = fs.readFileSync(templatesPath, 'utf8')

// Extract main template IDs (not element IDs)
const mainTemplateIds = []
const lines = templatesContent.split('\n')

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim()
  
  // Look for main template IDs (4 spaces + id: '...')
  if (line.match(/^id: '[^']*',$/)) {
    const prevLine = i > 0 ? lines[i - 1].trim() : ''
    
    // Check if this is a main template (not an element)
    // Main templates have 4 spaces, elements have 8+ spaces
    if (lines[i].startsWith('    id: ')) {
      const templateId = line.match(/id: '([^']*)',/)[1]
      mainTemplateIds.push(templateId)
    }
  }
}

console.log(`Found ${mainTemplateIds.length} main templates:`)
mainTemplateIds.forEach(id => console.log(`- ${id}`))

// Check which templates have SVG images
const templatesDir = path.join(__dirname, '../public/templates')
const existingSvgs = fs.readdirSync(templatesDir).filter(file => file.endsWith('.svg'))

console.log(`\nFound ${existingSvgs.length} SVG files:`)
existingSvgs.forEach(file => console.log(`- ${file}`))

// Check which templates are missing SVG images
const missingSvgs = mainTemplateIds.filter(id => !existingSvgs.includes(`${id}.svg`))

console.log(`\nMissing SVG images (${missingSvgs.length}):`)
missingSvgs.forEach(id => console.log(`- ${id}.svg`))

// Check which SVGs don't have corresponding templates
const orphanedSvgs = existingSvgs.filter(file => {
  const templateId = file.replace('.svg', '')
  return !mainTemplateIds.includes(templateId)
})

console.log(`\nOrphaned SVG files (${orphanedSvgs.length}):`)
orphanedSvgs.forEach(file => console.log(`- ${file}`))
