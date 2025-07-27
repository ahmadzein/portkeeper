#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Fixing favicon files...\n');

// 1. Fix favicon.svg - Main logo
const faviconSVG = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Purple gradient background -->
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="256" cy="256" r="240" fill="url(#bg)"/>
  
  <!-- White inner circle -->
  <circle cx="256" cy="256" r="200" fill="white"/>
  
  <!-- Purple P -->
  <text x="256" y="340" font-family="Arial, sans-serif" font-size="280" font-weight="bold" text-anchor="middle" fill="#667eea">P</text>
  
  <!-- Green port dots -->
  <circle cx="360" cy="160" r="25" fill="#10b981"/>
  <circle cx="360" cy="360" r="25" fill="#10b981"/>
</svg>`;

fs.writeFileSync(path.join(__dirname, 'favicon.svg'), faviconSVG);
console.log('✅ Fixed favicon.svg');

// 2. Fix favicon-emoji.svg
const emojiSVG = `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" fill="#667eea" rx="20"/>
  <text x="64" y="90" font-size="80" text-anchor="middle" fill="white">🚀</text>
</svg>`;

fs.writeFileSync(path.join(__dirname, 'favicon-emoji.svg'), emojiSVG);
console.log('✅ Fixed favicon-emoji.svg');

// 3. Create colored PNG placeholders
//