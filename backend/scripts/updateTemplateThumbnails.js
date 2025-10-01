const fs = require('fs');
const path = require('path');

// Read the templates file
const templatesPath = path.join(__dirname, '../src/data/templates.ts');
let content = fs.readFileSync(templatesPath, 'utf8');

// Replace all .jpg thumbnail references with .svg
content = content.replace(/thumbnail: '\/templates\/([^']+)\.jpg'/g, (match, templateId) => {
  return `thumbnail: '/templates/${templateId}.svg'`;
});

// Write the updated content back
fs.writeFileSync(templatesPath, content);

console.log('✅ Updated all template thumbnails to use SVG files');
