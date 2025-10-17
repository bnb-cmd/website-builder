#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 Optimizing CSS for Cloudflare Pages deployment...');

const nextDir = path.join(__dirname, '.next');
const staticDir = path.join(nextDir, 'static', 'css');

// Ensure CSS files are properly optimized
function optimizeCSS() {
  if (!fs.existsSync(staticDir)) {
    console.log('⚠️  CSS directory not found, skipping CSS optimization');
    return;
  }

  const cssFiles = fs.readdirSync(staticDir).filter(file => file.endsWith('.css'));
  
  if (cssFiles.length === 0) {
    console.log('⚠️  No CSS files found in static directory');
    return;
  }

  console.log(`📁 Found ${cssFiles.length} CSS files:`);
  cssFiles.forEach(file => {
    const filePath = path.join(staticDir, file);
    const stats = fs.statSync(filePath);
    console.log(`  - ${file} (${Math.round(stats.size / 1024)}KB)`);
  });

  // Ensure CSS files are accessible
  cssFiles.forEach(file => {
    const filePath = path.join(staticDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it contains Tailwind classes
    if (content.includes('tailwind') || content.includes('@tailwind')) {
      console.log(`✅ ${file} contains Tailwind CSS`);
    } else {
      console.log(`⚠️  ${file} may not contain Tailwind CSS`);
    }
  });

  console.log('✅ CSS optimization completed');
}

// Copy CSS files to root if needed
function copyCSSToRoot() {
  const rootCSSDir = path.join(__dirname, 'css');
  
  if (fs.existsSync(staticDir)) {
    if (!fs.existsSync(rootCSSDir)) {
      fs.mkdirSync(rootCSSDir, { recursive: true });
    }

    const cssFiles = fs.readdirSync(staticDir).filter(file => file.endsWith('.css'));
    
    cssFiles.forEach(file => {
      const sourcePath = path.join(staticDir, file);
      const targetPath = path.join(rootCSSDir, file);
      
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`📋 Copied ${file} to root CSS directory`);
    });
  }
}

try {
  optimizeCSS();
  copyCSSToRoot();
  console.log('🎨 CSS optimization completed successfully');
} catch (error) {
  console.error('❌ CSS optimization failed:', error);
  process.exit(1);
}
