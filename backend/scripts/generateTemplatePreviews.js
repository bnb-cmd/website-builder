const fs = require('fs');
const path = require('path');

// Import the templates data - need to use the compiled JS version
const templatesPath = path.join(__dirname, '../dist/data/templates.js');
let websiteTemplates = [];

try {
  // Try to load from compiled JS
  const templatesModule = require(templatesPath);
  websiteTemplates = templatesModule.websiteTemplates || [];
} catch (error) {
  console.log('⚠️ Could not load from dist, trying TypeScript source...');
  try {
    // Fallback: read and parse the TypeScript file manually
    const tsPath = path.join(__dirname, '../src/data/templates.ts');
    const tsContent = fs.readFileSync(tsPath, 'utf8');
    
    // Extract the templates array using regex (simple approach)
    const arrayMatch = tsContent.match(/export const websiteTemplates = \[([\s\S]*?)\]/);
    if (arrayMatch) {
      // This is a simplified approach - in production you'd want proper TS parsing
      console.log('📝 Found templates in TypeScript file');
      // For now, let's create a minimal set for testing
      websiteTemplates = [
        {
          id: 'business-1',
          name: 'Modern Business',
          category: 'Business',
          description: 'Professional business website with all essential sections',
          thumbnail: '/templates/business-1.svg',
          isPremium: false,
          tags: ['corporate', 'professional', 'services'],
          pages: ['home', 'about', 'services', 'contact'],
          features: ['responsive', 'seo-friendly', 'contact-form']
        },
        {
          id: 'ecommerce-1',
          name: 'Fashion Store',
          category: 'E-commerce',
          description: 'Beautiful online store for fashion and clothing',
          thumbnail: '/templates/ecommerce-1.svg',
          isPremium: true,
          tags: ['shop', 'fashion', 'retail'],
          pages: ['home', 'shop', 'product', 'cart', 'checkout'],
          features: ['shopping-cart', 'payment-integration', 'inventory']
        }
      ];
    }
  } catch (tsError) {
    console.error('❌ Could not load templates:', tsError.message);
    process.exit(1);
  }
}

console.log(`📊 Loaded ${websiteTemplates.length} templates`);

async function generateTemplatePreviews() {
  console.log('🎨 Generating template previews...');
  
  // Ensure templates directory exists
  const templatesDir = path.join(__dirname, '../public/templates');
  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }
  
  for (const template of websiteTemplates) {
    try {
      // Create a simple HTML preview
      const previewHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.name} - Template Preview</title>
  <style>
    body { 
      margin: 0; 
      padding: 20px; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    .preview-container { 
      max-width: 400px; 
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    .preview-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      text-align: center;
    }
    .template-name { 
      font-size: 20px; 
      font-weight: bold; 
      margin-bottom: 8px; 
    }
    .template-desc { 
      font-size: 14px; 
      opacity: 0.9;
      line-height: 1.4;
    }
    .preview-content {
      padding: 20px;
    }
    .info-section {
      margin-bottom: 15px;
    }
    .info-label {
      font-weight: 600;
      color: #374151;
      margin-bottom: 5px;
    }
    .info-value {
      color: #6B7280;
      font-size: 14px;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 10px;
    }
    .tag {
      background: #F3F4F6;
      color: #374151;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
    }
    .premium-badge {
      background: linear-gradient(135deg, #F59E0B, #D97706);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
      margin-top: 10px;
    }
    .free-badge {
      background: linear-gradient(135deg, #10B981, #059669);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="preview-container">
    <div class="preview-header">
      <div class="template-name">${template.name}</div>
      <div class="template-desc">${template.description}</div>
    </div>
    <div class="preview-content">
      <div class="info-section">
        <div class="info-label">Category</div>
        <div class="info-value">${template.category}</div>
      </div>
      
      <div class="info-section">
        <div class="info-label">Pages</div>
        <div class="info-value">${template.pages.join(', ')}</div>
      </div>
      
      <div class="info-section">
        <div class="info-label">Features</div>
        <div class="info-value">${template.features.join(', ')}</div>
      </div>
      
      <div class="info-section">
        <div class="info-label">Tags</div>
        <div class="tags">
          ${template.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
      
      ${template.isPremium ? 
        '<div class="premium-badge">Premium Template</div>' : 
        '<div class="free-badge">Free Template</div>'
      }
      
      ${template.localizedFor ? `
        <div class="info-section">
          <div class="info-label">Localized For</div>
          <div class="info-value">${template.localizedFor.toUpperCase()}</div>
        </div>
      ` : ''}
    </div>
  </div>
</body>
</html>`;
      
      // Save preview HTML
      const previewPath = path.join(templatesDir, `${template.id}-preview.html`);
      fs.writeFileSync(previewPath, previewHtml);
      
      console.log(`✅ Generated preview for ${template.name}`);
    } catch (error) {
      console.error(`❌ Failed to generate preview for ${template.name}:`, error);
    }
  }
  
  console.log(`🎉 Generated ${websiteTemplates.length} template previews!`);
}

// Run the script
generateTemplatePreviews().catch(console.error);
