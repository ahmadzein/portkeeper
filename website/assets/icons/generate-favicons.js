#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create canvas-like SVG and save it
const createFaviconSVG = () => {
  const svg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background Circle -->
  <circle cx="256" cy="256" r="240" fill="#667eea"/>
  
  <!-- White P Letter -->
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="280" font-weight="bold" text-anchor="middle" fill="white">P</text>
  
  <!-- Port dots -->
  <circle cx="360" cy="160" r="25" fill="#10b981"/>
  <circle cx="360" cy="360" r="25" fill="#10b981"/>
</svg>`;
  
  fs.writeFileSync(path.join(__dirname, 'favicon.svg'), svg);
  console.log('✅ Created favicon.svg');
};

// Create simple emoji favicon
const createEmojiFavicon = () => {
  const svg = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <text x="50" y="70" font-size="70" text-anchor="middle">🚀</text>
</svg>`;
  
  fs.writeFileSync(path.join(__dirname, 'favicon-emoji.svg'), svg);
  console.log('✅ Created favicon-emoji.svg');
};

// Create PNG data for different sizes
const createPNGBase64 = () => {
  // Base64 encoded 32x32 PNG with purple background and white P
  const png32 = `iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACx
jwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKeSURBVFhHtZe9jtpAEMfXGIgJBAiEEEJCQkJC
QkJCoqCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKSkpKSkpKSkpKSk5D6e8e7szO7a3h3cRfrpbO/s
7H9mZ2fX5n7T2dzcXKfT6fR6vf5gMBiNRqPxeDyZTKbT6Ww2m8/ni8VisVwuV6vVer3ebDab7Xa7
2+32+/3hcDgej6fT6Xy5XP6ey+UKUqfXaDRAAwEajQZo0Gg0Go1Go9FoNBqNRqPRaDQaCBjiOM5F
EARBEARBEAT5/3zwz5AQCQSC