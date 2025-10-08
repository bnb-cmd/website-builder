const fs = require('fs')
const path = require('path')

// Simple template validation script
function validateTemplates() {
  console.log('🔍 Starting template validation...')
  
  try {
    // Read templates file
    const templatesPath = path.join(__dirname, '../src/data/templates.ts')
    const content = fs.readFileSync(templatesPath, 'utf8')
    
    // Basic validation checks
    const errors = []
    const warnings = []
    
    // Check for websiteTemplates export
    if (!content.includes('export const websiteTemplates')) {
      errors.push('Missing websiteTemplates export')
    }
    
    // Check for blockTemplates export
    if (!content.includes('export const blockTemplates')) {
      errors.push('Missing blockTemplates export')
    }
    
    // Count templates
    const websiteTemplateMatches = content.match(/id: '[^']+'/g) || []
    const blockTemplateMatches = content.match(/id: '[^']+'/g) || []
    
    // Count elements
    const elementMatches = content.match(/elements: \[/g) || []
    
    // Count thumbnails
    const thumbnailMatches = content.match(/thumbnail: '[^']+'/g) || []
    
    // Check for .jpg references (should be .svg)
    const jpgMatches = content.match(/\.jpg/g) || []
    if (jpgMatches.length > 0) {
      warnings.push(`Found ${jpgMatches.length} .jpg references (should be .svg)`)
    }
    
    // Check for missing elements
    const templatesWithElements = content.match(/elements: \[[\s\S]*?\]/g) || []
    const templatesWithoutElements = websiteTemplateMatches.length - templatesWithElements.length
    
    if (templatesWithoutElements > 0) {
      warnings.push(`${templatesWithoutElements} templates missing elements array`)
    }
    
    // Generate report
    console.log('\n' + '='.repeat(50))
    console.log('TEMPLATE VALIDATION SUMMARY')
    console.log('='.repeat(50))
    console.log(`Website Templates: ${websiteTemplateMatches.length}`)
    console.log(`Block Templates: ${blockTemplateMatches.length}`)
    console.log(`Total Templates: ${websiteTemplateMatches.length + blockTemplateMatches.length}`)
    console.log(`Templates with Elements: ${templatesWithElements.length}`)
    console.log(`Templates without Elements: ${templatesWithoutElements}`)
    console.log(`Total Thumbnails: ${thumbnailMatches.length}`)
    console.log(`JPG References: ${jpgMatches.length}`)
    
    if (errors.length > 0) {
      console.log('\n❌ ERRORS:')
      errors.forEach(error => console.log(`- ${error}`))
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️ WARNINGS:')
      warnings.forEach(warning => console.log(`- ${warning}`))
    }
    
    if (errors.length === 0) {
      console.log('\n✅ All basic validations passed!')
    } else {
      console.log('\n❌ Some validations failed!')
    }
    
    // Save report
    const report = `# Template Validation Report

## Summary
- **Website Templates**: ${websiteTemplateMatches.length}
- **Block Templates**: ${blockTemplateMatches.length}
- **Total Templates**: ${websiteTemplateMatches.length + blockTemplateMatches.length}
- **Templates with Elements**: ${templatesWithElements.length}
- **Templates without Elements**: ${templatesWithoutElements}
- **Total Thumbnails**: ${thumbnailMatches.length}
- **JPG References**: ${jpgMatches.length}

## Errors
${errors.length > 0 ? errors.map(e => `- ${e}`).join('\n') : 'None'}

## Warnings
${warnings.length > 0 ? warnings.map(w => `- ${w}`).join('\n') : 'None'}

## Recommendations
1. Convert all .jpg references to .svg
2. Add elements array to templates missing them
3. Ensure all templates have proper thumbnails
4. Validate all template IDs are unique
5. Check all asset paths are correct
`
    
    const reportPath = path.join(__dirname, '../validation-report.md')
    fs.writeFileSync(reportPath, report)
    console.log(`\n📄 Report saved to: ${reportPath}`)
    
  } catch (error) {
    console.error('💥 Validation failed:', error)
    process.exit(1)
  }
}

// Run validation
validateTemplates()
