#!/usr/bin/env node

/**
 * Template Component Validation Script
 * 
 * This script validates that all templates use registered components
 * and reports any missing or invalid component references.
 */

const fs = require('fs');
const path = require('path');

// Registered components from the frontend
const REGISTERED_COMPONENTS = [
  // Basic components
  'badge', 'button', 'code', 'divider', 'heading', 'highlight', 'icon', 'image', 
  'link', 'progress', 'quote', 'spacer', 'text', 'tooltip', 'typography',
  
  // Layout components
  'breadcrumb', 'card', 'columns', 'container', 'flexbox', 'footer', 'grid', 
  'header', 'herosection', 'navbar', 'navigation', 'pagination', 'section', 'sidebar',
  
  // Content components
  'accordion', 'article', 'blogpost', 'faq', 'filter', 'gallery', 'list', 
  'newsletter', 'search', 'socialmedia', 'tabs', 'testimonials', 'timeline',
  'blogfeatured', 'bloggrid', 'categorygrid', 'features', 'menusection',
  
  // Business components
  'aboutsection', 'contactform', 'contactinfo', 'cta', 'email', 'featurelist', 
  'hours', 'locationcard', 'map', 'phone', 'pricingtable', 'reviews', 'servicecard', 
  'teammember', 'appointmentbooking', 'statscounter', 'team', 'propertygrid', 
  'propertysearch', 'causegrid',
  
  // Ecommerce components
  'cartsummary', 'categoryfilter', 'checkout', 'ordersummary', 'paymentform', 
  'pricingcard', 'productcard', 'productgrid', 'productreviews', 'relatedproducts', 
  'shippinginfo', 'shoppingcart', 'wishlist', 'paymentmethods', 'coursegrid',
  
  // Media components
  'calendar', 'video'
];

// Field types that are not components
const FIELD_TYPES = ['text', 'email', 'tel', 'textarea', 'select'];

// Component name mappings (template name -> registered name)
const COMPONENT_MAPPINGS = {
  'menu-section': 'menusection',
  'payment-methods': 'paymentmethods',
  'course-grid': 'coursegrid',
  'team-section': 'teammember',
  'appointment-booking': 'appointmentbooking',
  'property-search': 'propertysearch',
  'property-grid': 'propertygrid',
  'blog-featured': 'blogfeatured',
  'blog-grid': 'bloggrid',
  'category-grid': 'categorygrid',
  'newsletter-signup': 'newsletter',
  'cause-grid': 'causegrid',
  'stats-counter': 'statscounter',
  'address': 'contactinfo'
};

/**
 * Extract all component types from templates
 */
function extractComponentTypes(templates) {
  const componentTypes = new Set();
  
  templates.forEach(template => {
    if (template.elements && Array.isArray(template.elements)) {
      template.elements.forEach(element => {
        if (element.type) {
          componentTypes.add(element.type);
        }
      });
    }
  });
  
  return Array.from(componentTypes);
}

/**
 * Validate component types against registered components
 */
function validateComponentTypes(componentTypes) {
  const errors = [];
  const warnings = [];
  
  componentTypes.forEach(type => {
    if (FIELD_TYPES.includes(type)) {
      // Field types are valid, skip validation
      return;
    }
    
    // Check if there's a mapping for this component type
    const mappedType = COMPONENT_MAPPINGS[type] || type;
    
    if (!REGISTERED_COMPONENTS.includes(mappedType)) {
      errors.push(`❌ Invalid component type: "${type}" - not registered (mapped to: "${mappedType}")`);
    }
  });
  
  return { errors, warnings };
}

/**
 * Validate template structure
 */
function validateTemplateStructure(templates) {
  const errors = [];
  const warnings = [];
  
  templates.forEach((template, index) => {
    // Check required fields
    if (!template.id) {
      errors.push(`❌ Template ${index + 1}: Missing required field "id"`);
    }
    
    if (!template.name) {
      errors.push(`❌ Template ${index + 1}: Missing required field "name"`);
    }
    
    // Check elements
    if (!template.elements || !Array.isArray(template.elements)) {
      warnings.push(`⚠️  Template ${index + 1} (${template.id}): No elements array`);
    } else if (template.elements.length === 0) {
      warnings.push(`⚠️  Template ${index + 1} (${template.id}): Empty elements array`);
    } else {
      // Validate each element
      template.elements.forEach((element, elementIndex) => {
        if (!element.id) {
          errors.push(`❌ Template ${index + 1}, Element ${elementIndex + 1}: Missing element "id"`);
        }
        
        if (!element.type) {
          errors.push(`❌ Template ${index + 1}, Element ${elementIndex + 1}: Missing element "type"`);
        }
        
        if (!element.props) {
          warnings.push(`⚠️  Template ${index + 1}, Element ${elementIndex + 1}: Missing element "props"`);
        }
      });
    }
  });
  
  return { errors, warnings };
}

/**
 * Main validation function
 */
function validateTemplates() {
  console.log('🔍 Validating template components...\n');
  
  try {
    // Read templates file
    const templatesPath = path.join(__dirname, '..', 'src', 'data', 'templates.ts');
    const templatesContent = fs.readFileSync(templatesPath, 'utf8');
    
    // Extract component types using regex
    const componentTypeMatches = templatesContent.match(/type:\s*['"]([^'"]+)['"]/g);
    if (!componentTypeMatches) {
      console.log('❌ No component types found in templates');
      process.exit(1);
    }
    
    const componentTypes = componentTypeMatches.map(match => {
      const typeMatch = match.match(/type:\s*['"]([^'"]+)['"]/);
      return typeMatch ? typeMatch[1] : null;
    }).filter(Boolean);
    
    // Count templates
    const templateMatches = templatesContent.match(/id:\s*['"][^'"]+['"]/g);
    const templateCount = templateMatches ? templateMatches.length : 0;
    console.log(`📊 Found ${templateCount} templates\n`);
    
    // Get unique component types
    const uniqueComponentTypes = [...new Set(componentTypes)];
    console.log(`🔧 Found ${uniqueComponentTypes.length} unique component types: ${uniqueComponentTypes.join(', ')}\n`);
    
    // Validate component types
    const componentValidation = validateComponentTypes(uniqueComponentTypes);
    
    // Report results
    if (componentValidation.errors.length === 0) {
      console.log('✅ All component types are valid!');
    } else {
      console.log('❌ Validation errors found:');
      componentValidation.errors.forEach(error => console.log(`   ${error}`));
    }
    
    if (componentValidation.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      componentValidation.warnings.forEach(warning => console.log(`   ${warning}`));
    }
    
    // Summary
    console.log(`\n📈 Summary:`);
    console.log(`   • Templates: ${templateCount}`);
    console.log(`   • Component types: ${uniqueComponentTypes.length}`);
    console.log(`   • Errors: ${componentValidation.errors.length}`);
    console.log(`   • Warnings: ${componentValidation.warnings.length}`);
    
    if (componentValidation.errors.length > 0) {
      console.log('\n❌ Validation failed!');
      process.exit(1);
    } else {
      console.log('\n✅ Validation passed!');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('❌ Error during validation:', error.message);
    process.exit(1);
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  validateTemplates();
}

module.exports = { validateTemplates };
