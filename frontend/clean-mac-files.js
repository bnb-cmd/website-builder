#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function cleanMacFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      cleanMacFiles(filePath);
    } else if (file.startsWith('._')) {
      console.log(`Removing: ${filePath}`);
      fs.unlinkSync(filePath);
    }
  });
}

// Clean src directory
cleanMacFiles('./src');
console.log('Cleaned all macOS metadata files');
