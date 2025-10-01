const fs = require('fs');
const path = require('path');

// Template data from the backend
const templates = [
  { id: 'business-1', name: 'Business', category: 'Business' },
  { id: 'ecommerce-1', name: 'E-commerce', category: 'E-commerce' },
  { id: 'restaurant-1', name: 'Restaurant', category: 'Restaurant' },
  { id: 'portfolio-1', name: 'Portfolio', category: 'Portfolio' },
  { id: 'education-1', name: 'Education', category: 'Education' },
  { id: 'medical-1', name: 'Medical', category: 'Medical' },
  { id: 'real-estate-1', name: 'Real Estate', category: 'Real Estate' },
  { id: 'events-1', name: 'Events', category: 'Events' },
  { id: 'blog-1', name: 'Blog', category: 'Blog' },
  { id: 'nonprofit-1', name: 'Non-Profit', category: 'Non-Profit' },
  { id: 'fitness-1', name: 'Fitness', category: 'Fitness' },
  { id: 'travel-1', name: 'Travel', category: 'Travel' }
];

// Create a simple SVG placeholder for each template
function createSVGPlaceholder(template) {
  const colors = {
    'Business': '#3B82F6',
    'E-commerce': '#10B981', 
    'Restaurant': '#F59E0B',
    'Portfolio': '#8B5CF6',
    'Education': '#EF4444',
    'Medical': '#06B6D4',
    'Real Estate': '#84CC16',
    'Events': '#F97316',
    'Blog': '#EC4899',
    'Non-Profit': '#6366F1',
    'Fitness': '#14B8A6',
    'Travel': '#F43F5E'
  };

  const color = colors[template.category] || '#6B7280';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="${color}" opacity="0.1"/>
  <rect x="20" y="20" width="360" height="40" fill="${color}" opacity="0.3" rx="4"/>
  <rect x="20" y="80" width="200" height="20" fill="${color}" opacity="0.2" rx="2"/>
  <rect x="20" y="110" width="150" height="20" fill="${color}" opacity="0.2" rx="2"/>
  <rect x="20" y="140" width="180" height="20" fill="${color}" opacity="0.2" rx="2"/>
  <rect x="20" y="200" width="100" height="30" fill="${color}" opacity="0.4" rx="4"/>
  <rect x="140" y="200" width="100" height="30" fill="${color}" opacity="0.4" rx="4"/>
  <rect x="260" y="200" width="100" height="30" fill="${color}" opacity="0.4" rx="4"/>
  <text x="200" y="250" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${color}">${template.name}</text>
</svg>`;
}

// Generate images for all templates
templates.forEach(template => {
  const svgContent = createSVGPlaceholder(template);
  const filePath = path.join(__dirname, '../public/templates', `${template.id}.svg`);
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`Generated: ${template.id}.svg`);
});

console.log('✅ Template images generated successfully!');
