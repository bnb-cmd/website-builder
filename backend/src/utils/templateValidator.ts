import { PrismaClient } from '@prisma/client'
import { websiteTemplates, blockTemplates } from '../data/templates'

const prisma = new PrismaClient()

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

interface TemplateValidationResult {
  templateId: string
  templateName: string
  isValid: boolean
  errors: string[]
  warnings: string[]
}

class TemplateValidator {
  private requiredFields = [
    'id',
    'name',
    'category',
    'description',
    'thumbnail',
    'tags',
    'pages',
    'features'
  ]

  private requiredElementFields = [
    'id',
    'type',
    'props',
    'style',
    'children'
  ]

  private validCategories = [
    'Business',
    'E-commerce',
    'Restaurant',
    'Portfolio',
    'Education',
    'Medical',
    'Real Estate',
    'Wedding',
    'Blog',
    'Non-profit',
    'Fitness',
    'Travel',
    'Technology',
    'Creative',
    'Corporate',
    'Startup',
    'Agency',
    'Consulting',
    'Finance',
    'Legal',
    'Healthcare',
    'Automotive',
    'Fashion',
    'Food & Beverage',
    'Entertainment',
    'Sports',
    'Real Estate',
    'Home & Garden',
    'Beauty & Wellness',
    'Travel & Tourism',
    'Education & Training',
    'Non-profit & Charity',
    'Government',
    'Manufacturing',
    'Retail',
    'Services',
    'Other'
  ]

  private validElementTypes = [
    'navbar',
    'hero',
    'feature-grid',
    'about-section',
    'contact-form',
    'footer',
    'testimonials',
    'team-section',
    'stats-counter',
    'gallery',
    'cta-section',
    'pricing-table',
    'timeline',
    'image',
    'text',
    'heading',
    'button',
    'container',
    'section',
    'row',
    'column'
  ]

  private validBlockCategories = [
    'Heroes',
    'Features',
    'Testimonials',
    'Pricing',
    'Contact',
    'Call to Action',
    'Team',
    'Statistics',
    'Footers',
    'Gallery'
  ]

  // Validate a single template
  validateTemplate(template: any): TemplateValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Check required fields
    for (const field of this.requiredFields) {
      if (!template[field]) {
        errors.push(`Missing required field: ${field}`)
      }
    }

    // Validate ID format
    if (template.id && !/^[a-z0-9-]+$/.test(template.id)) {
      errors.push('Template ID must contain only lowercase letters, numbers, and hyphens')
    }

    // Validate category
    if (template.category && !this.validCategories.includes(template.category)) {
      warnings.push(`Unknown category: ${template.category}`)
    }

    // Validate thumbnail path
    if (template.thumbnail && !template.thumbnail.startsWith('/')) {
      errors.push('Thumbnail path must start with /')
    }

    // Validate tags array
    if (template.tags && !Array.isArray(template.tags)) {
      errors.push('Tags must be an array')
    }

    // Validate pages array
    if (template.pages && !Array.isArray(template.pages)) {
      errors.push('Pages must be an array')
    }

    // Validate features array
    if (template.features && !Array.isArray(template.features)) {
      errors.push('Features must be an array')
    }

    // Validate elements if present
    if (template.elements) {
      if (!Array.isArray(template.elements)) {
        errors.push('Elements must be an array')
      } else {
        template.elements.forEach((element: any, index: number) => {
          const elementErrors = this.validateElement(element, index)
          errors.push(...elementErrors)
        })
      }
    } else {
      warnings.push('Template has no elements array')
    }

    // Validate isPremium field
    if (template.isPremium !== undefined && typeof template.isPremium !== 'boolean') {
      errors.push('isPremium must be a boolean')
    }

    // Validate localizedFor field
    if (template.localizedFor && !['pk', 'us', 'uk', 'ca', 'au'].includes(template.localizedFor)) {
      warnings.push(`Unknown localization: ${template.localizedFor}`)
    }

    return {
      templateId: template.id || 'unknown',
      templateName: template.name || 'Unknown',
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  // Validate a single element
  validateElement(element: any, index: number): string[] {
    const errors: string[] = []

    // Check required element fields
    for (const field of this.requiredElementFields) {
      if (!element[field]) {
        errors.push(`Element ${index}: Missing required field: ${field}`)
      }
    }

    // Validate element type
    if (element.type && !this.validElementTypes.includes(element.type)) {
      errors.push(`Element ${index}: Unknown element type: ${element.type}`)
    }

    // Validate element ID format
    if (element.id && !/^[a-z0-9-]+$/.test(element.id)) {
      errors.push(`Element ${index}: Element ID must contain only lowercase letters, numbers, and hyphens`)
    }

    // Validate props object
    if (element.props && typeof element.props !== 'object') {
      errors.push(`Element ${index}: Props must be an object`)
    }

    // Validate style object
    if (element.style && typeof element.style !== 'object') {
      errors.push(`Element ${index}: Style must be an object`)
    }

    // Validate children array
    if (element.children && !Array.isArray(element.children)) {
      errors.push(`Element ${index}: Children must be an array`)
    }

    return errors
  }

  // Validate a block template
  validateBlockTemplate(blockTemplate: any): TemplateValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Check required fields for block templates
    const requiredBlockFields = ['id', 'name', 'category', 'thumbnail', 'elements']
    
    for (const field of requiredBlockFields) {
      if (!blockTemplate[field]) {
        errors.push(`Missing required field: ${field}`)
      }
    }

    // Validate category
    if (blockTemplate.category && !this.validBlockCategories.includes(blockTemplate.category)) {
      warnings.push(`Unknown block category: ${blockTemplate.category}`)
    }

    // Validate elements
    if (blockTemplate.elements) {
      if (!Array.isArray(blockTemplate.elements)) {
        errors.push('Elements must be an array')
      } else {
        blockTemplate.elements.forEach((element: any, index: number) => {
          const elementErrors = this.validateElement(element, index)
          errors.push(...elementErrors)
        })
      }
    }

    return {
      templateId: blockTemplate.id || 'unknown',
      templateName: blockTemplate.name || 'Unknown',
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  // Validate all templates
  async validateAllTemplates(): Promise<{
    websiteTemplates: TemplateValidationResult[]
    blockTemplates: TemplateValidationResult[]
    summary: {
      totalTemplates: number
      validTemplates: number
      invalidTemplates: number
      totalErrors: number
      totalWarnings: number
    }
  }> {
    console.log('🔍 Starting template validation...')

    // Validate website templates
    const websiteResults = websiteTemplates.map(template => 
      this.validateTemplate(template)
    )

    // Validate block templates
    const blockResults = blockTemplates.map(blockTemplate => 
      this.validateBlockTemplate(blockTemplate)
    )

    // Calculate summary
    const allResults = [...websiteResults, ...blockResults]
    const validTemplates = allResults.filter(r => r.isValid).length
    const invalidTemplates = allResults.filter(r => !r.isValid).length
    const totalErrors = allResults.reduce((sum, r) => sum + r.errors.length, 0)
    const totalWarnings = allResults.reduce((sum, r) => sum + r.warnings.length, 0)

    const summary = {
      totalTemplates: allResults.length,
      validTemplates,
      invalidTemplates,
      totalErrors,
      totalWarnings
    }

    console.log('✅ Template validation completed!')
    console.log(`📊 Summary: ${validTemplates}/${summary.totalTemplates} templates valid`)
    console.log(`❌ Errors: ${totalErrors}, ⚠️ Warnings: ${totalWarnings}`)

    return {
      websiteTemplates: websiteResults,
      blockTemplates: blockResults,
      summary
    }
  }

  // Generate validation report
  generateReport(results: {
    websiteTemplates: TemplateValidationResult[]
    blockTemplates: TemplateValidationResult[]
    summary: any
  }): string {
    let report = '# Template Validation Report\n\n'
    
    report += `## Summary\n`
    report += `- **Total Templates**: ${results.summary.totalTemplates}\n`
    report += `- **Valid Templates**: ${results.summary.validTemplates}\n`
    report += `- **Invalid Templates**: ${results.summary.invalidTemplates}\n`
    report += `- **Total Errors**: ${results.summary.totalErrors}\n`
    report += `- **Total Warnings**: ${results.summary.totalWarnings}\n\n`

    // Website templates section
    report += `## Website Templates (${results.websiteTemplates.length})\n\n`
    
    const invalidWebsiteTemplates = results.websiteTemplates.filter(r => !r.isValid)
    if (invalidWebsiteTemplates.length > 0) {
      report += `### ❌ Invalid Templates (${invalidWebsiteTemplates.length})\n\n`
      invalidWebsiteTemplates.forEach(result => {
        report += `#### ${result.templateName} (${result.templateId})\n`
        if (result.errors.length > 0) {
          report += `**Errors:**\n`
          result.errors.forEach(error => report += `- ${error}\n`)
        }
        if (result.warnings.length > 0) {
          report += `**Warnings:**\n`
          result.warnings.forEach(warning => report += `- ${warning}\n`)
        }
        report += '\n'
      })
    }

    const validWebsiteTemplates = results.websiteTemplates.filter(r => r.isValid)
    if (validWebsiteTemplates.length > 0) {
      report += `### ✅ Valid Templates (${validWebsiteTemplates.length})\n\n`
      validWebsiteTemplates.forEach(result => {
        report += `- ${result.templateName} (${result.templateId})`
        if (result.warnings.length > 0) {
          report += ` - ${result.warnings.length} warning(s)`
        }
        report += '\n'
      })
      report += '\n'
    }

    // Block templates section
    report += `## Block Templates (${results.blockTemplates.length})\n\n`
    
    const invalidBlockTemplates = results.blockTemplates.filter(r => !r.isValid)
    if (invalidBlockTemplates.length > 0) {
      report += `### ❌ Invalid Block Templates (${invalidBlockTemplates.length})\n\n`
      invalidBlockTemplates.forEach(result => {
        report += `#### ${result.templateName} (${result.templateId})\n`
        if (result.errors.length > 0) {
          report += `**Errors:**\n`
          result.errors.forEach(error => report += `- ${error}\n`)
        }
        if (result.warnings.length > 0) {
          report += `**Warnings:**\n`
          result.warnings.forEach(warning => report += `- ${warning}\n`)
        }
        report += '\n'
      })
    }

    const validBlockTemplates = results.blockTemplates.filter(r => r.isValid)
    if (validBlockTemplates.length > 0) {
      report += `### ✅ Valid Block Templates (${validBlockTemplates.length})\n\n`
      validBlockTemplates.forEach(result => {
        report += `- ${result.templateName} (${result.templateId})`
        if (result.warnings.length > 0) {
          report += ` - ${result.warnings.length} warning(s)`
        }
        report += '\n'
      })
    }

    return report
  }

  // Check for duplicate IDs
  checkDuplicateIds(): { duplicates: string[], uniqueIds: number } {
    const allIds: string[] = []
    
    // Collect all template IDs
    websiteTemplates.forEach(template => {
      if (template.id) allIds.push(template.id)
    })
    
    blockTemplates.forEach(blockTemplate => {
      if (blockTemplate.id) allIds.push(blockTemplate.id)
    })

    // Find duplicates
    const duplicates = allIds.filter((id, index) => allIds.indexOf(id) !== index)
    const uniqueIds = new Set(allIds).size

    return { duplicates: [...new Set(duplicates)], uniqueIds }
  }

  // Check asset references
  checkAssetReferences(): { missingAssets: string[], totalAssets: number } {
    const assetPaths: string[] = []
    const missingAssets: string[] = []

    // Collect all asset references
    websiteTemplates.forEach(template => {
      if (template.thumbnail) assetPaths.push(template.thumbnail)
      
      if (template.elements) {
        template.elements.forEach((element: any) => {
          if (element.props?.backgroundImage) assetPaths.push(element.props.backgroundImage)
          if (element.props?.imageUrl) assetPaths.push(element.props.imageUrl)
          if (element.props?.src) assetPaths.push(element.props.src)
        })
      }
    })

    blockTemplates.forEach(blockTemplate => {
      if (blockTemplate.thumbnail) assetPaths.push(blockTemplate.thumbnail)
      
      if (blockTemplate.elements) {
        blockTemplate.elements.forEach((element: any) => {
          if (element.props?.backgroundImage) assetPaths.push(element.props.backgroundImage)
          if (element.props?.imageUrl) assetPaths.push(element.props.imageUrl)
          if (element.props?.src) assetPaths.push(element.props.src)
        })
      }
    })

    // Check for common missing asset patterns
    const uniqueAssets = [...new Set(assetPaths)]
    uniqueAssets.forEach(asset => {
      if (asset.includes('placeholder') || asset.includes('example') || asset.includes('sample')) {
        missingAssets.push(asset)
      }
    })

    return { missingAssets, totalAssets: uniqueAssets.length }
  }
}

// Main validation function
async function runTemplateValidation() {
  try {
    const validator = new TemplateValidator()
    
    // Run validation
    const results = await validator.validateAllTemplates()
    
    // Check for duplicates
    const duplicateCheck = validator.checkDuplicateIds()
    if (duplicateCheck.duplicates.length > 0) {
      console.log(`⚠️ Found ${duplicateCheck.duplicates.length} duplicate IDs:`, duplicateCheck.duplicates)
    }
    
    // Check asset references
    const assetCheck = validator.checkAssetReferences()
    console.log(`📁 Total assets referenced: ${assetCheck.totalAssets}`)
    if (assetCheck.missingAssets.length > 0) {
      console.log(`⚠️ Potentially missing assets: ${assetCheck.missingAssets.length}`)
    }
    
    // Generate report
    const report = validator.generateReport(results)
    
    // Save report to file
    const fs = require('fs')
    const path = require('path')
    const reportPath = path.join(__dirname, '../validation-report.md')
    fs.writeFileSync(reportPath, report)
    
    console.log(`📄 Validation report saved to: ${reportPath}`)
    
    // Print summary to console
    console.log('\n' + '='.repeat(50))
    console.log('VALIDATION SUMMARY')
    console.log('='.repeat(50))
    console.log(`Total Templates: ${results.summary.totalTemplates}`)
    console.log(`Valid Templates: ${results.summary.validTemplates}`)
    console.log(`Invalid Templates: ${results.summary.invalidTemplates}`)
    console.log(`Total Errors: ${results.summary.totalErrors}`)
    console.log(`Total Warnings: ${results.summary.totalWarnings}`)
    console.log(`Unique IDs: ${duplicateCheck.uniqueIds}`)
    console.log(`Duplicate IDs: ${duplicateCheck.duplicates.length}`)
    console.log(`Total Assets: ${assetCheck.totalAssets}`)
    console.log(`Missing Assets: ${assetCheck.missingAssets.length}`)
    
    if (results.summary.invalidTemplates > 0) {
      console.log('\n❌ Some templates have validation errors. Check the report for details.')
      process.exit(1)
    } else {
      console.log('\n✅ All templates passed validation!')
      process.exit(0)
    }
    
  } catch (error) {
    console.error('💥 Validation failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  runTemplateValidation()
}

export { TemplateValidator, runTemplateValidation }
