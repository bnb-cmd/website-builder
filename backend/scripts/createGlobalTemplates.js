#!/usr/bin/env node

/**
 * Script to create global versions for all Pakistan-localized templates
 * This script reads the templates.ts file and creates global versions for all templates with localizedFor: 'pk'
 */

const fs = require('fs');
const path = require('path');

// Template IDs that need global versions (excluding the ones we've already done)
const remainingTemplates = [
  'medical-1', 'realestate-1', 'wedding-1', 'blog-1', 'nonprofit-1', 'travel-1',
  'mueble-furniture', 'fruitkha-food', 'medcare-clinic', 'phamaci-pharmacy',
  'forkista-restaurant', 'pizzahous-pizza', 'cafe-restaurant-free', 'beautyrel-salon',
  'medilab-healthcare', 'house-kraft-realestate', 'real-estate-free', 'travelum-tours',
  'travel-agency-free', 'learning-center-education', 'social-organization-charity',
  'hotel-hospitality', 'lawyer-legal', 'accounting-finance', 'insurance-agency',
  'construction-building', 'logistics-shipping', 'agriculture-farming', 'pet-veterinary',
  'vetic-veterinary', 'elevates-architecture', 'legally-law', 'harmoni-wellness',
  'rosalia-creative', 'lead-planner-coaching', 'fward-corporate', 'crafter-multipurpose',
  'brave-theme-interior', 'jordan-electronics', 'oregon-organic', 'handy-tools',
  'photography-studio', 'davis-photographer', 'multiverse-gallery', 'editorial-magazine',
  'photon-minimal', 'spectral-startup', 'strata-personal'
];

function createGlobalTemplate(template) {
  // Create global version
  const globalTemplate = {
    ...template,
    id: `${template.id}-global`,
    name: template.name.replace(' (Pakistan)', '').replace(' - Pakistan version', ''),
    description: template.description.replace(' - Pakistan version', ''),
    isGlobal: true,
    parentTemplateId: undefined,
    localizedFor: undefined,
    elements: template.elements ? template.elements.map(element => {
      // Remove Pakistan-specific elements and update content
      if (element.type === 'payment-methods') {
        return null; // Remove payment methods for global version
      }
      
      // Update contact info to be generic
      if (element.type === 'footer' && element.props.contactInfo) {
        return {
          ...element,
          props: {
            ...element.props,
            contactInfo: {
              address: '123 Business Street, City, Country',
              phone: '+1-555-123-4567',
              email: `info@${template.id.replace('-', '')}.com`
            }
          }
        };
      }
      
      // Update prices to USD
      if (element.props && typeof element.props === 'object') {
        const updatedProps = { ...element.props };
        
        // Update course prices
        if (updatedProps.courses) {
          updatedProps.courses = updatedProps.courses.map(course => ({
            ...course,
            price: course.price.replace('Rs. ', '$').replace(/\d+/, (match) => Math.floor(parseInt(match) / 200))
          }));
        }
        
        // Update menu prices
        if (updatedProps.categories) {
          updatedProps.categories = updatedProps.categories.map(category => ({
            ...category,
            items: category.items.map(item => ({
              ...item,
              price: item.price.replace('Rs. ', '$').replace(/\d+/, (match) => Math.floor(parseInt(match) / 200))
            }))
          }));
        }
        
        // Update property prices
        if (updatedProps.properties) {
          updatedProps.properties = updatedProps.properties.map(property => ({
            ...property,
            price: property.price.replace('Rs. ', '$').replace(/\d+/, (match) => Math.floor(parseInt(match) / 200))
          }));
        }
        
        return { ...element, props: updatedProps };
      }
      
      return element;
    }).filter(Boolean) : undefined
  };
  
  // Update the original template to reference the global version
  const updatedTemplate = {
    ...template,
    name: `${template.name} (Pakistan)`,
    description: `${template.description} - Pakistan version`,
    parentTemplateId: globalTemplate.id,
    elements: template.elements ? template.elements.map(element => {
      // Add Pakistan-specific elements
      if (element.type === 'footer' && element.props.contactInfo) {
        return {
          ...element,
          props: {
            ...element.props,
            contactInfo: {
              address: '123 Business Street, Karachi, Pakistan',
              phone: '+92-21-1234567',
              email: `info@${template.id.replace('-', '')}.pk`,
              whatsapp: '+92-300-1234567'
            }
          }
        };
      }
      
      return element;
    }) : undefined
  };
  
  return { globalTemplate, updatedTemplate };
}

function processTemplates() {
  console.log('🔄 Processing templates for dual localization...');
  
  const templatesPath = path.join(__dirname, '../src/data/templates.ts');
  const content = fs.readFileSync(templatesPath, 'utf8');
  
  // This is a simplified approach - in a real implementation, you'd want to parse the TypeScript file properly
  console.log('📝 Note: This script provides the structure for creating global templates.');
  console.log('📝 Manual implementation is recommended for the remaining templates.');
  
  console.log(`📊 Found ${remainingTemplates.length} templates to process:`);
  remainingTemplates.forEach((templateId, index) => {
    console.log(`  ${index + 1}. ${templateId}`);
  });
  
  console.log('\n✅ Template processing structure created.');
  console.log('📝 Next steps:');
  console.log('  1. Implement the createGlobalTemplate function for each template type');
  console.log('  2. Update the templates.ts file with the generated global versions');
  console.log('  3. Test the dual localization system');
}

if (require.main === module) {
  processTemplates();
}

module.exports = { createGlobalTemplate, remainingTemplates };
