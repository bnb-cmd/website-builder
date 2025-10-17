#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📁 Copying HTML files for Cloudflare Pages deployment...');

// Function to inject CSS links into HTML
function injectCSSIntoHTML(htmlContent) {
  // Find CSS files in the static directory
  const staticCSSDir = path.join(__dirname, '.next', 'static', 'css');
  let cssLinks = '';
  
  if (fs.existsSync(staticCSSDir)) {
    const cssFiles = fs.readdirSync(staticCSSDir).filter(file => file.endsWith('.css'));
    
    cssFiles.forEach(file => {
      cssLinks += `<link rel="stylesheet" href="/_next/static/css/${file}" />\n`;
    });
  }
  
  // Inject CSS links before closing head tag
  if (cssLinks && htmlContent.includes('</head>')) {
    htmlContent = htmlContent.replace('</head>', `${cssLinks}</head>`);
  }
  
  return htmlContent;
}

// Copy HTML files from server/pages to root for Cloudflare Pages
function copyHtmlFiles() {
  const sourceDir = '.next/server/pages';
  const targetDir = '.next';
  
  if (!fs.existsSync(sourceDir)) {
    console.log('❌ Source directory not found:', sourceDir);
    return;
  }
  
  // Copy LandingPage.html as index.html
  const landingPage = path.join(sourceDir, 'LandingPage.html');
  const indexFile = path.join(targetDir, 'index.html');
  
  if (fs.existsSync(landingPage)) {
    let htmlContent = fs.readFileSync(landingPage, 'utf8');
    htmlContent = injectCSSIntoHTML(htmlContent);
    fs.writeFileSync(indexFile, htmlContent);
    console.log('✅ Copied LandingPage.html as index.html with CSS injection');
  }
  
  // Copy other important pages
  const pagesToCopy = [
    'LoginPage.html',
    'RegisterPage.html',
    'DashboardPage.html',
    'TemplatesPage.html',
    'WebsitesPage.html',
    'OnboardingPage.html',
    'EditorPage.html'
  ];
  
  pagesToCopy.forEach(page => {
    const sourceFile = path.join(sourceDir, page);
    const targetFile = path.join(targetDir, page);
    
    if (fs.existsSync(sourceFile)) {
      let htmlContent = fs.readFileSync(sourceFile, 'utf8');
      htmlContent = injectCSSIntoHTML(htmlContent);
      fs.writeFileSync(targetFile, htmlContent);
      console.log(`✅ Copied ${page} with CSS injection`);
    }
  });
}

copyHtmlFiles();
console.log('✅ HTML files copied for Cloudflare Pages deployment');
