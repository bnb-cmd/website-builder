#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning up cache files for Cloudflare Pages deployment...');

// Remove cache directories that cause deployment issues
const cacheDirs = [
  '.next/cache',
  '.next/server/chunks',
  '.next/static/chunks'
];

function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`Removing: ${dirPath}`);
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

// Remove cache directories
cacheDirs.forEach(removeDir);

// Also remove any large .pack files
function removeLargeFiles(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      removeLargeFiles(filePath);
    } else if (file.endsWith('.pack') && stat.size > 10 * 1024 * 1024) { // 10MB
      console.log(`Removing large file: ${filePath} (${Math.round(stat.size / 1024 / 1024)}MB)`);
      fs.unlinkSync(filePath);
    }
  });
}

removeLargeFiles('.next');

console.log('✅ Cache cleanup completed for Cloudflare Pages deployment');
