#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📁 Copying HTML files for Cloudflare Pages deployment...');

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
    fs.copyFileSync(landingPage, indexFile);
    console.log('✅ Copied LandingPage.html as index.html');
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
      fs.copyFileSync(sourceFile, targetFile);
      console.log(`✅ Copied ${page}`);
    }
  });
}

copyHtmlFiles();
console.log('✅ HTML files copied for Cloudflare Pages deployment');
